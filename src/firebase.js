// Firebase helper (modular SDK v9+)
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  getDatabase,
  ref as rtdbRef,
  get as rtdbGet,
  update as rtdbUpdate
} from 'firebase/database';


// Add your Firebase config to .env.local or environment variables
// Example variables to add to .env (do NOT commit real keys):
// REACT_APP_FIREBASE_API_KEY=...
// REACT_APP_FIREBASE_AUTH_DOMAIN=...
// REACT_APP_FIREBASE_PROJECT_ID=...

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // Optional (only needed if you want to use Firebase Realtime Database)
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

const hasRTDB = Boolean(firebaseConfig.databaseURL);

// Helpful validation when running locally
const REQUIRED_FIREBASE_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'messagingSenderId',
  'appId'
];
const missing = REQUIRED_FIREBASE_KEYS.filter((k) => !firebaseConfig[k]);
if (missing.length) {
  console.error('Firebase config missing the following REACT_APP_ vars:', missing);
  console.error('Copy `.env.local.example` to `.env.local` and fill values (do not commit `.env.local`).');
  // do not initialize Firebase without config
  throw new Error('Missing Firebase configuration: ' + missing.join(', '));
}

// Initialize Firebase safely and provide masked diagnostic output
function maskKey(key){
  if(!key || key.length < 8) return '****';
  return key.slice(0,4) + '...' + key.slice(-4);
}

let app;
let auth;
let db;
let rtdb;
try{
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  if (hasRTDB) {
    rtdb = getDatabase(app);
  }

  console.info('Firebase initialized. Project:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: maskKey(firebaseConfig.apiKey)
  });
}catch(err){
  console.error('Firebase initialization failed:', err && err.message ? err.message : err);
  console.error('If this is `auth/invalid-api-key`, verify `.env.local` contains the Web app SDK config (API key) and restart the dev server.');
  throw err;
}

export { auth, db, rtdb, hasRTDB };

export async function upsertUserProfile(uid, data) {
  if (!uid) throw new Error('Missing uid');
  if (!data || typeof data !== 'object') throw new Error('Missing profile data');
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
}

// Realtime Database (RTDB) profile helpers
// Stores profile at: Realtime Database -> users/{uid}
export async function upsertUserProfileRTDB(uid, data) {
  if (!uid) throw new Error('Missing uid');
  if (!data || typeof data !== 'object') throw new Error('Missing profile data');
  if (!hasRTDB || !rtdb) {
    throw new Error('Realtime Database is not configured. Set REACT_APP_FIREBASE_DATABASE_URL in .env.local and restart the dev server.');
  }
  const now = Date.now();
  const pathRef = rtdbRef(rtdb, `users/${uid}`);
  await rtdbUpdate(pathRef, {
    ...data,
    updatedAt: now,
    createdAt: data.createdAt ? data.createdAt : now
  });
}

export async function getUserProfileRTDB(uid) {
  if (!uid) throw new Error('Missing uid');
  if (!hasRTDB || !rtdb) {
    return null;
  }
  const pathRef = rtdbRef(rtdb, `users/${uid}`);
  const snap = await rtdbGet(pathRef);
  if (!snap.exists()) return null;
  return { uid, ...snap.val() };
}

export async function signupUser({ name, id, branch, phone, email, password, role, photoFile }) {
  try{
    console.info('signupUser: creating user', email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    console.info('signupUser: created uid=', user.uid);

    // Keep existing verification behavior, but send the email ASAP so it isn't blocked
    // by photo upload / Firestore writes.
    console.info('signupUser: sending verification email');
    await sendEmailVerification(user);
    console.info('signupUser: verification email sent');

    // Photo uploads use Supabase private buckets with token exchange.
    // Keep signup flow simple and billing-free: upload photo from Profile page after login.
    let photoURL = null;
    if (photoFile) {
      console.info('signupUser: photoFile provided; skipping upload at signup (upload from Profile page instead)');
    }

    // Store profile in Firestore (best-effort). If this fails or hangs due to network,
    // do NOT keep the UI stuck on "Saving...".
    let profileSaved = false;
    let profileError = null;
    try {
      const userRef = doc(db, 'users', user.uid);
      console.info('signupUser: writing user profile to Firestore');

      const writePromise = setDoc(userRef, {
        name,
        id,
        branch,
        phone,
        email: email || user.email || null,
        role,
        photoURL,
        createdAt: serverTimestamp()
      });

      const timeoutMs = 15000;
      await Promise.race([
        writePromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile save timed out (network issue). You can still log in after verifying email.')), timeoutMs)
        )
      ]);

      profileSaved = true;
      console.info('signupUser: profile written');
    } catch (err) {
      profileError = err?.message || String(err);
      console.warn('signupUser: profile write skipped/failed:', profileError);
    }

    // Sign out so user must verify first (non-blocking)
    try {
      await signOut(auth);
      console.info('signupUser: signed out after signup');
    } catch (err) {
      console.warn('signupUser: signOut failed:', err?.message || String(err));
    }

    return { uid: user.uid, profileSaved, profileError };
  }catch(err){
    console.error('signupUser error:', err && err.message ? err.message : err);
    throw err;
  }
}

export async function loginUser(email, password) {
  try{
    console.info('loginUser: signing in', email);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    // Ensure emailVerified is up to date after clicking the verification link.
    try {
      await user.reload();
    } catch (err) {
      console.warn('loginUser: user.reload failed:', err?.message || String(err));
    }
    console.info('loginUser: signed in uid=', user.uid, 'emailVerified=', user.emailVerified);
    if (!user.emailVerified) {
      // sign out immediately
      await signOut(auth);
      const err = new Error('email-not-verified');
      err.code = 'email-not-verified';
      err.user = user;
      throw err;
    }
    // fetch profile (non-fatal)
    let profile = null;
    let profileError = null;
    try{
      profile = await getUserProfile(user.uid);
      console.info('loginUser: fetched profile', profile && profile.uid);
    }catch(err){
      profileError = err && err.message ? err.message : String(err);
      console.warn('loginUser: profile fetch failed, continuing without profile:', profileError);
    }
    return { user, profile, profileError };
  }catch(err){
    console.error('loginUser error:', err && err.message ? err.message : err);
    throw err;
  }
}

export async function resendVerificationForSignedInUser(email, password) {
  // Sign in then resend verification then sign out
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  if (user.emailVerified) {
    await signOut(auth);
    return { alreadyVerified: true };
  }
  await sendEmailVerification(user);
  await signOut(auth);
  return { sent: true };
}

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid) {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() };
  } catch (err) {
    // Firestore throws when offline; surface a clear message and return null so caller can continue
    console.error('getUserProfile error:', err && err.message ? err.message : err);
    if (err && err.message && err.message.toLowerCase().includes('offline')) {
      // return null to indicate profile unavailable due to offline
      return null;
    }
    // rethrow unknown errors
    throw err;
  }
}

export async function updateUserProfile(uid, patch) {
  if (!uid) throw new Error('Missing uid');
  if (!patch || typeof patch !== 'object') throw new Error('Missing profile update');
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, patch);
}

export async function fetchAllUsers() {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ uid: d.id, ...d.data() }));
}
