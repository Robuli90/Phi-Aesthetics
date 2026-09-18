import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request minimal scope required: gmail.send
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

export interface GmailStatus {
  connected: boolean;
  practiceEmail?: string;
  configuredInEnv?: boolean;
}

export async function fetchGmailStatus(): Promise<GmailStatus> {
  try {
    const res = await fetch('/api/auth/gmail-status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return await res.json();
  } catch {
    return { connected: false };
  }
}

export async function connectPracticeGmail(): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) {
      throw new Error('Kein OAuth-Zugriffstoken von Google erhalten.');
    }

    // Send token strictly to server backend to store and use exclusively server-side
    const res = await fetch('/api/auth/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        email: result.user.email,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Server konnte das Token nicht speichern');
    }

    const data = await res.json();
    return { success: true, email: data.email };
  } catch (err: any) {
    console.error('Fehler bei der Google Workspace / Gmail Verbindung:', err);
    return { success: false, error: err.message };
  }
}

export async function disconnectPracticeGmail(): Promise<boolean> {
  try {
    await signOut(auth);
    await fetch('/api/auth/disconnect', { method: 'POST' });
    return true;
  } catch {
    return false;
  }
}
