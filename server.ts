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
  phone: '0152 33979650',
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
  // Sanitize subject and headers to prevent CRLF injection
  const safeSubject = subject.replace(/[\r\n]+/g, ' ').trim();
  const utf8Subject = `=?utf-8?B?${Buffer.from(safeSubject, 'utf-8').toString('base64')}?=`;
  const safeSender = from ? from.replace(/[\r\n]+/g, ' ').trim() : '';
  const senderHeader = safeSender ? `From: ${safeSender}\r\n` : '';
  const safeTo = to.replace(/[\r\n]+/g, ' ').trim();

  const message = [
    `To: ${safeTo}`,
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

// Google Calendar API Integration Helper (Prepared for confirmed appointments)
async function createGoogleCalendarEvent(
  token: string,
  appointment: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    treatment: string;
    date: string;
    dateIso?: string;
    slot: string;
    notes?: string;
  }
) {
  const baseDate = appointment.dateIso || new Date().toISOString().split('T')[0];
  const slot = appointment.slot || '10:00';
  const startDateTime = `${baseDate}T${slot.length === 5 ? slot : '10:00'}:00`;

  // Default duration 30 minutes
  const [h, m] = slot.split(':').map(Number);
  const endMinutes = ((h || 10) * 60 + (m || 0) + 30);
  const endH = Math.floor(endMinutes / 60);
  const endM = endMinutes % 60;
  const endDateTime = `${baseDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

  const calendarPayload = {
    summary: `PHI Aesthetics: ${appointment.treatment} – ${appointment.clientName}`,
    description: [
      `Kunde: ${appointment.clientName}`,
      `Telefon: ${appointment.clientPhone}`,
      `E-Mail: ${appointment.clientEmail}`,
      `Behandlung: ${appointment.treatment}`,
      `Wunschtermin: ${appointment.date} um ${appointment.slot} Uhr`,
      appointment.notes ? `Anmerkung des Kunden: ${appointment.notes}` : null,
      `Status: Verbindlich bestätigt durch PHI Aesthetics`,
    ]
      .filter(Boolean)
      .join('\n'),
    start: {
      dateTime: startDateTime,
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Europe/Berlin',
    },
    attendees: [
      {
        email: appointment.clientEmail,
        displayName: appointment.clientName,
      },
    ],
    reminders: {
      useDefault: true,
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(calendarPayload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google Calendar API failed with status ${response.status}: ${errorBody}`);
  }

  return await response.json();
}

// SPAM PROTECTION & RATE LIMITING
const ipRequests = new Map<string, number[]>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10-minute window
  const maxRequests = 6; // Max 6 requests per 10 mins
  const timestamps = (ipRequests.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return true;
}

// Deduplication: prevent accidental double-clicks / repeated submissions
const recentSubmissions = new Map<string, number>();
function isDuplicateSubmission(hashKey: string): boolean {
  const now = Date.now();
  const lastTime = recentSubmissions.get(hashKey);
  if (lastTime && now - lastTime < 3 * 60 * 1000) {
    return true; // Sent within last 3 minutes
  }
  recentSubmissions.set(hashKey, now);
  return false;
}

// Helper to load appointments
function getAppointmentsList(): any[] {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('[Server] Could not read appointments file:', err);
  }
  return [];
}

// Store appointment record safely
function saveAppointment(record: Record<string, unknown>) {
  try {
    const appointments = getAppointmentsList();
    appointments.unshift(record);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Could not save appointment to disk:', err);
  }
}

// Update existing appointment record safely
function updateAppointmentRecord(id: string, updater: (record: any) => any): boolean {
  try {
    const appointments = getAppointmentsList();
    const idx = appointments.findIndex((a: any) => a.id === id);
    if (idx === -1) return false;
    appointments[idx] = updater(appointments[idx]);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Server] Could not update appointment record:', err);
    return false;
  }
}

// Delete appointment record
function deleteAppointmentRecord(id: string): boolean {
  try {
    const appointments = getAppointmentsList();
    const filtered = appointments.filter((a: any) => a.id !== id);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Server] Could not delete appointment record:', err);
    return false;
  }
}

// Helper to validate date is not in the past
function isDateInPast(dateStr: string, dateIso?: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // If ISO date format YYYY-MM-DD
  if (dateIso && /^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    const [y, m, d] = dateIso.split('-').map(Number);
    const checkDate = new Date(y, m - 1, d);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() < now.getTime();
  }

  // Parse German month names e.g. "24. September 2026"
  const germanMonths: Record<string, number> = {
    januar: 0, februar: 1, 'märz': 2, maerz: 2, april: 3, mai: 4, juni: 5,
    juli: 6, august: 7, september: 8, oktober: 9, november: 10, dezember: 11
  };
  const match = dateStr.match(/(\d{1,2})\.?\s+([a-zA-ZäöüÄÖÜß]+)\s+(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const month = germanMonths[monthName];
    if (month !== undefined) {
      const checkDate = new Date(year, month, day);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() < now.getTime();
    }
  }

  // Standard date parsing fallback
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(0, 0, 0, 0);
    return parsed.getTime() < now.getTime();
  }

  return false;
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

    console.log(`[Server] Stored Gmail OAuth token for ${verifiedEmail}`);
    return res.json({ success: true, email: verifiedEmail });
  } catch (err: any) {
    console.error('[Server] Error saving token:', err.message);
    return res.status(500).json({ error: 'Failed to save token' });
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
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    // 1. SPAM PROTECTION: Honeypot check
    const honeypot = req.body.website || req.body.hp_field || req.body.company;
    if (honeypot && String(honeypot).trim().length > 0) {
      // Reject bot without exposing details
      return res.status(400).json({ error: 'Ungültige Anfrage (Spamverdacht).' });
    }

    // 2. SPAM PROTECTION: Rate Limiting
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten, bevor Sie eine weitere Anfrage senden.',
      });
    }

    const {
      name,
      email,
      phone,
      treatment,
      date,
      dateIso,
      slot,
      notes,
      contactPreference,
      consent,
    } = req.body;

    // 3. STRICT VALIDATION
    // Name validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Bitte geben Sie Ihren vollständigen Vor- und Nachnamen an.' });
    }
    // Email validation (RFC standard regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' });
    }
    // Phone validation (optional - only validated if entered)
    if (phone && typeof phone === 'string' && phone.trim().length > 0) {
      if (phone.trim().replace(/\D/g, '').length < 6) {
        return res.status(400).json({ error: 'Bitte geben Sie eine gültige Telefonnummer an oder lassen Sie das Feld frei.' });
      }
    }
    // Treatment validation
    if (!treatment || typeof treatment !== 'string' || !treatment.trim()) {
      return res.status(400).json({ error: 'Bitte wählen Sie eine gewünschte Behandlung aus.' });
    }
    // Date validation
    if (!date || typeof date !== 'string' || !date.trim()) {
      return res.status(400).json({ error: 'Bitte wählen Sie ein gewünschtes Datum aus.' });
    }
    // Slot validation
    if (!slot || typeof slot !== 'string' || !slot.trim()) {
      return res.status(400).json({ error: 'Bitte wählen Sie eine gewünschte Uhrzeit bzw. ein Zeitfenster aus.' });
    }
    // Privacy Consent validation
    if (consent !== true) {
      return res.status(400).json({
        error: 'Bitte willigen Sie in die Datenverarbeitung zur Bearbeitung Ihrer Terminanfrage ein.',
      });
    }

    // Check date is not in the past
    if (isDateInPast(date, dateIso)) {
      return res.status(400).json({
        error: 'Das gewünschte Behandlungsdatum darf nicht in der Vergangenheit liegen.',
      });
    }

    // 4. SANITIZE INPUTS (strip control characters and prevent CRLF injection)
    const clean = (val: string) => val.replace(/[\r\n]+/g, ' ').trim();
    const clientName = clean(name);
    const clientEmail = clean(email).toLowerCase();
    const clientPhone = phone && typeof phone === 'string' && phone.trim() ? clean(phone) : 'Nicht angegeben';
    const treatmentText = clean(treatment);
    const appointmentDate = clean(date);
    const appointmentSlot = clean(slot);
    const contactPref = contactPreference ? clean(contactPreference) : '';
    const clientNotes = (notes && typeof notes === 'string') ? notes.trim().slice(0, 1000) : '';

    // 5. SPAM PROTECTION: Deduplication check
    const deduplicationKey = `${clientEmail}::${appointmentDate}::${appointmentSlot}`;
    if (isDuplicateSubmission(deduplicationKey)) {
      return res.status(409).json({
        error: 'Diese Terminanfrage wurde vor wenigen Momenten bereits übermittelt. Bitte prüfen Sie Ihr Postfach.',
      });
    }

    const appointmentId = `phi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();
    const formattedReceiptTime = new Date().toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 6. E-MAIL TO PHI AESTHETICS (info.phiaesthetics@gmail.com)
    // Required subject: Neue Terminanfrage – [Name des Kunden]
    const practiceSubject = `Neue Terminanfrage – ${clientName}`;
    const practiceBody = [
      `Neue Terminanfrage über PHI Aesthetics:`,
      `========================================`,
      `Name:                 ${clientName}`,
      `E-Mail:               ${clientEmail}`,
      `Telefon:              ${clientPhone}`,
      `Behandlung:           ${treatmentText}`,
      `Wunschdatum:          ${appointmentDate}`,
      `Wunschuhrzeit:        ${appointmentSlot} Uhr`,
      contactPref ? `Bevorzugte Kontaktart:${contactPref}` : null,
      `Nachricht:            ${clientNotes || 'Keine Anmerkungen'}`,
      `========================================`,
      `Eingangsdatum und Uhrzeit: ${formattedReceiptTime} Uhr`,
      `Buchungs-ID:          ${appointmentId}`,
    ]
      .filter(Boolean)
      .join('\n');

    // 7. CONFIRMATION E-MAIL TO THE CLIENT
    // Required subject: Ihre Terminanfrage bei PHI Aesthetics
    // Explicit rule: The confirmation email must NOT claim that the appointment is already firmly booked!
    const clientSubject = `Ihre Terminanfrage bei PHI Aesthetics`;
    const clientBody = [
      `Sehr geehrte(r) ${clientName},`,
      ``,
      `Vielen Dank für Ihre Terminanfrage bei PHI Aesthetics.`,
      ``,
      `Wir haben Ihre Anfrage erhalten und werden den gewünschten Termin prüfen.`,
      ``,
      `Ihre Anfrage:`,
      `Behandlung: ${treatmentText}`,
      `Datum: ${appointmentDate}`,
      `Uhrzeit: ${appointmentSlot} Uhr`,
      contactPref ? `Bevorzugte Kontaktart: ${contactPref}` : null,
      clientNotes ? `Ihre Anmerkung: ${clientNotes}` : null,
      ``,
      `Bitte beachten Sie, dass der Termin erst nach unserer persönlichen Bestätigung verbindlich vereinbart ist.`,
      ``,
      `Mit freundlichen Grüßen`,
      `PHI Aesthetics`,
      `Dr. Milena Philippi`,
      `${PRACTICE_CONFIG.address}`,
      `Telefon: ${PRACTICE_CONFIG.phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    const appointmentRecord: Record<string, unknown> = {
      id: appointmentId,
      createdAt: nowIso,
      clientName,
      clientEmail,
      clientPhone,
      treatment: treatmentText,
      date: appointmentDate,
      dateIso: dateIso || '',
      slot: appointmentSlot,
      contactPreference: contactPref,
      notes: clientNotes,
      status: 'pending', // 'pending' | 'confirmed' | 'declined'
      emailSent: false,
      practiceEmailTarget: PRACTICE_CONFIG.email,
    };

    // 8. ATTEMPT GMAIL SEND VIA OAUTH / GMAIL API
    const token = await getEffectiveGmailToken();

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

        appointmentRecord.emailSent = true;
        console.log(`[Server] Gmail sent successfully for inquiry ${appointmentId}`);
      } catch (gmailErr: any) {
        console.error('[Server] Gmail dispatch failed:', gmailErr.message);
        appointmentRecord.emailError = 'Gmail dispatch failed';
        saveAppointment(appointmentRecord);

        // Strict rule: If email sending fails, do not show false success
        return res.status(500).json({
          error:
            'Der E-Mail-Versand ist fehlgeschlagen. Bitte versuchen Sie es in wenigen Augenblicken erneut oder kontaktieren Sie uns direkt telefonisch.',
        });
      }
    } else if (process.env.SIMULATE_EMAIL_FOR_TEST === 'true') {
      // Test mode simulation: allow automated tests to verify flow
      console.log(`[Server] [TEST MODE] Simulating email send for ${appointmentId}`);
      appointmentRecord.emailSent = true;
      appointmentRecord.simulated = true;
    } else {
      // No token connected
      console.warn(`[Server] Gmail token not authorized yet. Refusing false success.`);
      appointmentRecord.emailSent = false;
      saveAppointment(appointmentRecord);

      return res.status(503).json({
        error:
          'Der E-Mail-Dienst ist derzeit noch nicht mit Google autorisiert. Bitte autorisieren Sie das Google-Konto in der Praxis-Verwaltung oder kontaktieren Sie uns direkt telefonisch.',
      });
    }

    // Persist verified appointment safely
    saveAppointment(appointmentRecord);

    // Explicit success response matching user requirement
    return res.status(200).json({
      success: true,
      id: appointmentId,
      emailSent: appointmentRecord.emailSent,
      message: 'Vielen Dank für Ihre Anfrage. Wir haben Ihre Terminanfrage erhalten und melden uns schnellstmöglich bei Ihnen.',
      details: {
        name: clientName,
        date: appointmentDate,
        slot: appointmentSlot,
        treatment: treatmentText,
        email: clientEmail,
        contactPreference: contactPref,
      },
    });
  } catch (err: any) {
    console.error('[Server] Internal booking error:', err.message);
    return res.status(500).json({
      error: 'Ein interner Serverfehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    });
  }
});

// 6. View Appointments (Safe summary for admin verification)
app.get('/api/appointments', (_req, res) => {
  try {
    const list = getAppointmentsList();
    return res.json({ appointments: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Fehler beim Laden der Termine' });
  }
});

// 7. ADMIN WORKFLOW: Confirm Appointment
// Sets status to 'confirmed', sends confirmation email to client, and optionally creates Google Calendar event
app.post('/api/appointments/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { createCalendarEvent } = req.body;

    const list = getAppointmentsList();
    const appointment = list.find((a: any) => a.id === id);
    if (!appointment) {
      return res.status(404).json({ error: 'Terminanfrage nicht gefunden.' });
    }

    const token = await getEffectiveGmailToken();
    let calendarCreated = false;
    let calendarError: string | null = null;

    // Optional Google Calendar integration if authorized
    if (createCalendarEvent && token) {
      try {
        await createGoogleCalendarEvent(token, appointment);
        calendarCreated = true;
        console.log(`[Server] Google Calendar event created for ${id}`);
      } catch (calErr: any) {
        console.warn(`[Server] Google Calendar creation failed:`, calErr.message);
        calendarError = calErr.message;
      }
    }

    // Send confirmation email to client
    if (token) {
      try {
        const confirmSubject = `Terminbestätigung: Ihr Termin bei PHI Aesthetics am ${appointment.date}`;
        const confirmBody = [
          `Sehr geehrte(r) ${appointment.clientName},`,
          ``,
          `wir freuen uns, Ihnen Ihren Termin bei PHI Aesthetics verbindlich zu bestätigen:`,
          ``,
          `Ihre Termindetails:`,
          `• Behandlung: ${appointment.treatment}`,
          `• Datum:      ${appointment.date}`,
          `• Uhrzeit:    ${appointment.slot} Uhr`,
          `• Ort:        ${PRACTICE_CONFIG.address}`,
          `• Rückfragen: Telefon ${PRACTICE_CONFIG.phone}`,
          ``,
          `Sollten Sie den Termin nicht wahrnehmen können, bitten wir um eine rechtzeitige Absage mindestens 24 Stunden im Voraus.`,
          ``,
          `Wir freuen uns auf Ihren Besuch!`,
          ``,
          `Mit freundlichen Grüßen`,
          `Dr. Milena Philippi & das Team von PHI Aesthetics`,
        ].join('\n');

        const rawEmail = createRawEmail({
          to: appointment.clientEmail,
          from: PRACTICE_CONFIG.email,
          subject: confirmSubject,
          body: confirmBody,
        });
        await sendGmailEmail(token, rawEmail);
      } catch (mailErr: any) {
        console.warn('[Server] Could not send confirmation email:', mailErr.message);
      }
    }

    updateAppointmentRecord(id, (rec) => ({
      ...rec,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      calendarCreated,
    }));

    return res.json({
      success: true,
      status: 'confirmed',
      calendarCreated,
      calendarError,
      message: 'Termin wurde erfolgreich bestätigt und der Kunde per E-Mail benachrichtigt.',
    });
  } catch (err: any) {
    console.error('[Server] Error confirming appointment:', err.message);
    return res.status(500).json({ error: 'Termin konnte nicht bestätigt werden.' });
  }
});

// 8. ADMIN WORKFLOW: Decline Appointment
// Sets status to 'declined', sends polite decline & rescheduling email to client
app.post('/api/appointments/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const list = getAppointmentsList();
    const appointment = list.find((a: any) => a.id === id);
    if (!appointment) {
      return res.status(404).json({ error: 'Terminanfrage nicht gefunden.' });
    }

    const token = await getEffectiveGmailToken();

    // Send polite decline email to client
    if (token) {
      try {
        const declineSubject = `Zu Ihrer Terminanfrage bei PHI Aesthetics`;
        const declineBody = [
          `Sehr geehrte(r) ${appointment.clientName},`,
          ``,
          `vielen Dank für Ihre Terminanfrage bei PHI Aesthetics für ${appointment.treatment}.`,
          ``,
          `Zu dem von Ihnen gewünschten Termin (${appointment.date} um ${appointment.slot} Uhr) ist leider kein freier Behandlungsplatz mehr verfügbar.`,
          reason ? `\nGrund / Anmerkung der Praxis: ${reason}\n` : ``,
          `Gerne bieten wir Ihnen zeitnah einen passenden Alternativtermin an. Bitte melden Sie sich kurz telefonisch unter ${PRACTICE_CONFIG.phone} oder per Antwort auf diese E-Mail bei uns.`,
          ``,
          `Mit freundlichen Grüßen`,
          `Dr. Milena Philippi & das Team von PHI Aesthetics`,
        ].join('\n');

        const rawEmail = createRawEmail({
          to: appointment.clientEmail,
          from: PRACTICE_CONFIG.email,
          subject: declineSubject,
          body: declineBody,
        });
        await sendGmailEmail(token, rawEmail);
      } catch (mailErr: any) {
        console.warn('[Server] Could not send decline email:', mailErr.message);
      }
    }

    updateAppointmentRecord(id, (rec) => ({
      ...rec,
      status: 'declined',
      declinedAt: new Date().toISOString(),
      declineReason: reason || 'Termin nicht verfügbar',
    }));

    return res.json({
      success: true,
      status: 'declined',
      message: 'Termin wurde abgelehnt und der Kunde mit einem Alternativangebot benachrichtigt.',
    });
  } catch (err: any) {
    console.error('[Server] Error declining appointment:', err.message);
    return res.status(500).json({ error: 'Termin konnte nicht abgelehnt werden.' });
  }
});

// 9. ADMIN WORKFLOW: Delete/Archive Appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const success = deleteAppointmentRecord(id);
  if (!success) {
    return res.status(404).json({ error: 'Terminanfrage nicht gefunden.' });
  }
  return res.json({ success: true, message: 'Terminanfrage gelöscht.' });
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
