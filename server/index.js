import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const PORT = Number(process.env.PORT || 5001);
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SUPABASE_JWT_EXPIRES_IN_SECONDS = Number(process.env.SUPABASE_JWT_EXPIRES_IN_SECONDS || 3600);
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

if (!SUPABASE_JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.error('Missing SUPABASE_JWT_SECRET. Add it to server/.env');
  process.exit(1);
}

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (svcJson) {
    const credential = admin.credential.cert(JSON.parse(svcJson));
    admin.initializeApp({ credential });
    return;
  }

  // Falls back to GOOGLE_APPLICATION_CREDENTIALS / ADC.
  admin.initializeApp();
}

initFirebaseAdmin();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isLikelyAdminConfigError(err) {
  const msg = (err?.message || String(err || '')).toLowerCase();
  return (
    msg.includes('google_application_credentials') ||
    msg.includes('could not load the default credentials') ||
    (msg.includes('credential') && msg.includes('initializeapp')) ||
    msg.includes('failed to initialize')
  );
}

// POST /supabase-token
// Header: Authorization: Bearer <FIREBASE_ID_TOKEN>
// Returns: { supabaseJwt, expiresInSeconds }
app.post('/supabase-token', async (req, res) => {
  const requestId = Math.random().toString(16).slice(2, 10);
  try {
    const firebaseIdToken = getBearerToken(req);
    if (!firebaseIdToken) {
      return res.status(401).json({ error: 'Missing Firebase ID token (Authorization: Bearer <token>)' });
    }

    // eslint-disable-next-line no-console
    console.info(`[supabase-token:${requestId}] token received len=${firebaseIdToken.length}`);

    const decoded = await admin.auth().verifyIdToken(firebaseIdToken);

    if (FIREBASE_PROJECT_ID && decoded.aud !== FIREBASE_PROJECT_ID) {
      return res.status(403).json({ error: 'Firebase token project mismatch' });
    }

    const uid = decoded.uid;
    const email = decoded.email || null;

    // Supabase expects JWTs with role + sub.
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: uid,
      role: 'authenticated',
      email,
      iat: now,
      exp: now + SUPABASE_JWT_EXPIRES_IN_SECONDS,
      aud: 'authenticated'
    };

    const supabaseJwt = jwt.sign(payload, SUPABASE_JWT_SECRET, { algorithm: 'HS256' });

    return res.json({ supabaseJwt, expiresInSeconds: SUPABASE_JWT_EXPIRES_IN_SECONDS });
  } catch (err) {
    const msg = err?.message || String(err);

    // If Firebase Admin isn't configured correctly, don't mislead with "Invalid token".
    if (isLikelyAdminConfigError(err)) {
      // eslint-disable-next-line no-console
      console.error(`[supabase-token:${requestId}] Firebase Admin config error:`, msg);
      return res.status(500).json({
        error: 'Firebase Admin is not configured on the server',
        details: msg
      });
    }

    // eslint-disable-next-line no-console
    console.warn(`[supabase-token:${requestId}] verifyIdToken failed:`, msg);
    return res.status(401).json({ error: 'Invalid Firebase ID token', details: msg });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`supabase-token server listening on http://localhost:${PORT}`);
});
