import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), '.data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const TOKEN_FILE = path.join(DATA_DIR, 'gmail-token.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(express.json());

// Practice Configuration (Keep entirely on server-side)
const PRACTICE_CONFIG = {
  name: 'Phi Aesthetics – Dr. Milena Philippi',
  email: process.env.GMAIL_RECIPIENT_EMAIL || 'info.phiaesthetics@gmail.com',
  phone: '0173 1234567',
  address: 'Musterstrasse 69, 12345 Musterstadt',
};

// In-Memory Token Cache
let cachedGmailToken: {
  accessToken: string;
  email?: string;
  obtainedAt: number;
} | null = null;

// Load persisted token if available
function loadPersistedToken() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
      if (data && data.accessToken) {
        cachedGmailToken = data;
        console.log('[Server] Loaded persisted Gmail OAuth token for:', data.email || 'account');
      }
    }
  } catch (err) {
    console.error('[Server] Could not read persisted token:', err);
  }
}
loadPersistedToken();

function savePersistedToken(tokenData: { accessToken: string; email?: string; obtainedAt: number }) {
  cachedGmailToken = tokenData;
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Could not save token to file:', err);
  }
}

// Helper to get active Gmail token
async function getEffectiveGmailToken(): Promise<string | null> {
  // 1. Check environment variable
  if (process.env.GMAIL_ACCESS_TOKEN) {
    return process.env.GMAIL_ACCESS_TOKEN.trim();
  }

  // 2. Check cached/persisted token
  if (cachedGmailToken?.accessToken) {
    return cachedGmailToken.accessToken;
  }

  // 3. Check if refresh token exists in env
  if (
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET
  ) {
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GMAIL_CLIENT_ID,
          client_secret: process.env.GMAIL_CLIENT_SECRET,
          refresh_token: process.env.GMAIL_REFRESH_TOKEN,
          grant_type: 'refresh_token',
        }),
      });
      if (tokenRes.ok) {
        const tokenJson = await tokenRes.json();
        if (tokenJson.access_token) {
          savePersistedToken({
            accessToken: tokenJson.access_token,
            email: PRACTICE_CONFIG.email,
            obtainedAt: Date.now(),
          });
          return tokenJson.access_token;
        }
      }
    } catch (e) {
      console.error('[Server] Failed to refresh Gmail access token:', e);
    }
  }

  return null;
}

// MIME RFC 2822 Email Builder for Gmail API
function createRawEmail({
  to,
  from,
  subject,
  body,
}: {
  to: string;
  from?: string;
  subject: string;
  body: string;
}): string {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
  const senderHeader = from ? `From: ${from}\r\n` : '';
  const message = [
    `To: ${to}`,
    senderHeader.trim(),
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
  ]
    .filter((line) => line !== '')
    .join('\r\n');

  return Buffer.from(message, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Send via Google Gmail API (using https://www.googleapis.com/auth/gmail.send)
async function sendGmailEmail(token: string, rawBase64Url: string) {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gmail API request failed with status ${response.status}: ${errorBody}`);
  }

  return await response.json();
}

// Store appointment record safely
function saveAppointment(record: Record<string, unknown>) {
  try {
    let appointments: unknown[] = [];
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      appointments = JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, 'utf-8'));
    }
    appointments.unshift(record);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Could not save appointment to disk:', err);
  }
}

/* ==========================================================================
   API ROUTES (Mounted BEFORE Vite Middleware)
   ========================================================================== */

// 1. Health & Server Status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'phi-aesthetics-backend',
    timestamp: new Date().toISOString(),
  });
});

// 2. Gmail Integration Status
app.get('/api/auth/gmail-status', async (_req, res) => {
  const token = await getEffectiveGmailToken();
  res.json({
    connected: Boolean(token),
    practiceEmail: PRACTICE_CONFIG.email,
    configuredInEnv: Boolean(process.env.GMAIL_ACCESS_TOKEN || process.env.GMAIL_REFRESH_TOKEN),
  });
});

// 3. Save OAuth Token from Admin Sign-In (Google Workspace Auth)
app.post('/api/auth/save-token', async (req, res) => {
  try {
    const { accessToken, email } = req.body;
    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({ error: 'accessToken is required' });
    }

    // Verify token validity with Google Tokeninfo
    const verifyRes = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(accessToken)}`);
    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Invalid or expired Google OAuth token' });
    }

    const info = await verifyRes.json();
    const verifiedEmail = info.email || email || PRACTICE_CONFIG.email;

    savePersistedToken({
      accessToken,
      email: verifiedEmail,
      obtainedAt: Date.now(),
    });

    console.log(`[Server] Successfully stored Gmail OAuth token for ${verifiedEmail}`);
    return res.json({ success: true, email: verifiedEmail });
  } catch (err: any) {
    console.error('[Server] Error saving token:', err);
    return res.status(500).json({ error: 'Failed to save token', details: err.message });
  }
});

// 4. Disconnect OAuth Token
app.post('/api/auth/disconnect', (_req, res) => {
  cachedGmailToken = null;
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      fs.unlinkSync(TOKEN_FILE);
    } catch {}
  }
  res.json({ success: true, message: 'Token cleared' });
});

// 5. Main Booking Request Endpoint
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, treatment, date, slot, notes } = req.body;

    // Strict validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name des Kunden ist erforderlich.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Gültige E-Mail-Adresse ist erforderlich.' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Telefonnummer ist erforderlich.' });
    }
    if (!treatment || typeof treatment !== 'string') {
      return res.status(400).json({ error: 'Gewünschte Behandlung ist erforderlich.' });
    }
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Gewünschtes Datum ist erforderlich.' });
    }
    if (!slot || typeof slot !== 'string') {
      return res.status(400).json({ error: 'Gewünschte Uhrzeit ist erforderlich.' });
    }

    const clientName = name.trim();
    const clientEmail = email.trim();
    const clientPhone = phone.trim();
    const treatmentText = treatment.trim();
    const appointmentDate = date.trim();
    const appointmentSlot = slot.trim();
    const clientNotes = (notes || '').trim();

    const appointmentId = `phi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    // 1. Email to Practice (info.phiaesthetics@gmail.com)
    // Required Subject: Neue Terminanfrage – [Name des Kunden]
    const practiceSubject = `Neue Terminanfrage – ${clientName}`;
    const practiceBody = [
      `Neue Terminanfrage über phiaesthetics:`,
      `========================================`,
      `Name des Kunden:        ${clientName}`,
      `E-Mail-Adresse:         ${clientEmail}`,
      `Telefonnummer:          ${clientPhone}`,
      `gewünschte Behandlung:  ${treatmentText}`,
      `gewünschtes Datum:      ${appointmentDate}`,
      `gewünschte Uhrzeit:     ${appointmentSlot} Uhr`,
      `Nachricht/Anmerkungen:  ${clientNotes || 'Keine Anmerkungen angegeben'}`,
      `========================================`,
      `Buchungs-ID:            ${appointmentId}`,
      `Eingegangen am:         ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
    ].join('\n');

    // 2. Automated Confirmation Email to the Client
    const clientSubject = `Terminbestätigung: Deine Terminanfrage bei Phi Aesthetics`;
    const clientBody = [
      `Liebe(r) ${clientName},`,
      ``,
      `vielen Dank für deine Terminanfrage bei Phi Aesthetics!`,
      ``,
      `Wir haben deine Anfrage mit folgenden Angaben erhalten:`,
      `----------------------------------------`,
      `• Behandlung:    ${treatmentText}`,
      `• Wunschtermin:  ${appointmentDate} um ${appointmentSlot} Uhr`,
      `• Telefonnummer: ${clientPhone}`,
      clientNotes ? `• Deine Notiz:   ${clientNotes}` : null,
      `----------------------------------------`,
      ``,
      `Dr. Milena Philippi und das Team werden deinen Terminwunsch prüfen und sich zeitnah persönlich bei dir zur finalen Abstimmung melden.`,
      ``,
      `Herzliche Grüße,`,
      `Dr. Milena Philippi & das Phi Aesthetics Team`,
      `${PRACTICE_CONFIG.address}`,
      `Telefon: ${PRACTICE_CONFIG.phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    const appointmentRecord: Record<string, unknown> = {
      id: appointmentId,
      createdAt,
      clientName,
      clientEmail,
      clientPhone,
      treatment: treatmentText,
      date: appointmentDate,
      slot: appointmentSlot,
      notes: clientNotes,
      emailSent: false,
      practiceEmailTarget: PRACTICE_CONFIG.email,
    };

    // Attempt Gmail Send via OAuth
    const token = await getEffectiveGmailToken();
    let emailStatus = 'pending_auth';

    if (token) {
      try {
        // Send email to practice
        const rawPracticeEmail = createRawEmail({
          to: PRACTICE_CONFIG.email,
          from: PRACTICE_CONFIG.email,
          subject: practiceSubject,
          body: practiceBody,
        });
        await sendGmailEmail(token, rawPracticeEmail);

        // Send confirmation email to client
        const rawClientEmail = createRawEmail({
          to: clientEmail,
          from: PRACTICE_CONFIG.email,
          subject: clientSubject,
          body: clientBody,
        });
        await sendGmailEmail(token, rawClientEmail);

        emailStatus = 'sent';
        appointmentRecord.emailSent = true;
        console.log(`[Server] Gmail sent successfully for appointment ${appointmentId} to ${PRACTICE_CONFIG.email} & ${clientEmail}`);
      } catch (gmailErr: any) {
        console.error(`[Server] Failed to send via Gmail API:`, gmailErr);
        appointmentRecord.emailError = gmailErr.message;
        emailStatus = 'error_during_send';
      }
    } else {
      console.log(`[Server] Gmail token not yet connected. Stored appointment ${appointmentId} to disk. Prepared dispatch payload.`);
      appointmentRecord.note = 'Gmail OAuth connection pending on server';
    }

    // Always persist appointment safely
    saveAppointment(appointmentRecord);

    return res.status(200).json({
      success: true,
      id: appointmentId,
      emailSent: appointmentRecord.emailSent,
      emailStatus,
      message: 'Deine Terminanfrage wurde erfolgreich entgegengenommen und verarbeitet.',
      details: {
        name: clientName,
        date: appointmentDate,
        slot: appointmentSlot,
        treatment: treatmentText,
        email: clientEmail,
      },
    });
  } catch (err: any) {
    console.error('[Server] Error processing appointment:', err);
    return res.status(500).json({
      error: 'Bei der Verarbeitung der Terminanfrage ist ein interner Serverfehler aufgetreten.',
      details: err.message,
    });
  }
});

// 6. View Appointments (Safe summary for admin verification)
app.get('/api/appointments', (_req, res) => {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const list = JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, 'utf-8'));
      return res.json({ appointments: list });
    }
    return res.json({ appointments: [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   Vite Middleware & Static Serving Setup
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Phi Aesthetics Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
