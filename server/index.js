import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'node:fs';

dotenv.config();

const PORT = Number(process.env.PORT || 5001);
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SUPABASE_JWT_EXPIRES_IN_SECONDS = Number(process.env.SUPABASE_JWT_EXPIRES_IN_SECONDS || 3600);
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

if (!SUPABASE_JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('Missing SUPABASE_JWT_SECRET. /supabase-token will be disabled until it is set (server/.env).');
}

let firebaseAdminInitError = null;

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const projectId = FIREBASE_PROJECT_ID || undefined;

  // Option A: read a service account JSON file from disk (simplest for local dev)
  const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (svcPath) {
    const raw = fs.readFileSync(svcPath, 'utf8');
    const parsed = JSON.parse(raw);
    const credential = admin.credential.cert(parsed);
    admin.initializeApp({ credential, projectId: projectId || parsed.project_id || undefined });
    return;
  }

  // Option B: paste the service account JSON (single-line)
  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (svcJson) {
    const credential = admin.credential.cert(JSON.parse(svcJson));
    const parsed = JSON.parse(svcJson);
    admin.initializeApp({ credential, projectId: projectId || parsed.project_id || undefined });
    return;
  }

  // Falls back to GOOGLE_APPLICATION_CREDENTIALS / ADC.
  // Providing projectId helps when the environment can't auto-detect it.
  const credential = admin.credential.applicationDefault();
  admin.initializeApp({ credential, projectId });
}

try {
  initFirebaseAdmin();
} catch (err) {
  firebaseAdminInitError = err?.message || String(err);
  // eslint-disable-next-line no-console
  console.error('Firebase Admin init failed (server will still run, but auth/firestore endpoints will fail):', firebaseAdminInitError);
}

function firebaseAdminNotReadyResponse() {
  return {
    error: 'Firebase Admin is not configured on the server',
    details:
      firebaseAdminInitError ||
      'Missing credentials or project id. Set FIREBASE_SERVICE_ACCOUNT_PATH (recommended) or GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON, plus FIREBASE_PROJECT_ID, then restart the backend.'
  };
}

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
    msg.includes('unable to detect a project id') ||
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
    if (!SUPABASE_JWT_SECRET) {
      return res.status(500).json({
        error: 'Server is missing SUPABASE_JWT_SECRET',
        details: 'Add SUPABASE_JWT_SECRET to server/.env and restart the backend.'
      });
    }

    if (firebaseAdminInitError) {
      return res.status(500).json(firebaseAdminNotReadyResponse());
    }

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

// GET /resolve-userid?userId=24021DAI21
// Returns: { email, uid, userId, userName, role }
// Used by the frontend to map UserID -> email for Firebase Auth login.
app.get('/resolve-userid', async (req, res) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    if (firebaseAdminInitError) {
      return res.status(500).json(firebaseAdminNotReadyResponse());
    }

    const requestId = Math.random().toString(16).slice(2, 10);
    const db = admin.firestore();

    // 1) Fast path: userIdIndex/{userId}
    const indexSnap = await db.collection('userIdIndex').doc(userId).get();
    if (indexSnap.exists) {
      const data = indexSnap.data() || {};
      const email = data.email;
      if (!email) {
        return res.status(500).json({ error: 'User ID mapping exists but email is missing' });
      }
      return res.json({
        email,
        uid: data.uid || null,
        userId: data.userId || userId,
        userName: data.userName || null,
        role: data.role || null
      });
    }

    // 2) Back-compat: query users where id/userId matches (works for older signups)
    // eslint-disable-next-line no-console
    console.info(`[resolve-userid:${requestId}] index missing; querying users for`, userId);
    let userDoc = null;

    const q1 = await db.collection('users').where('id', '==', userId).limit(1).get();
    if (!q1.empty) userDoc = q1.docs[0];
    if (!userDoc) {
      const q2 = await db.collection('users').where('userId', '==', userId).limit(1).get();
      if (!q2.empty) userDoc = q2.docs[0];
    }

    if (!userDoc) {
      return res.status(404).json({ error: 'User ID not found. Sign up first, then verify email.' });
    }

    const userData = userDoc.data() || {};
    const email = userData.email;
    if (!email) {
      return res.status(500).json({ error: 'User record found but email is missing' });
    }

    return res.json({
      email,
      uid: userDoc.id,
      userId,
      userName: userData.userName || userData.name || null,
      role: userData.role || null
    });
  } catch (err) {
    const msg = err?.message || String(err);
    if (isLikelyAdminConfigError(err)) {
      return res.status(500).json({ error: 'Firebase Admin is not configured on the server', details: msg });
    }
    return res.status(500).json({ error: 'Failed to resolve User ID', details: msg });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`supabase-token server listening on http://localhost:${PORT}`);
});
