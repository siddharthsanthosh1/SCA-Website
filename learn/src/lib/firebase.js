/* ---------------------------------------------------------------------------
   Firebase bootstrap.

   Every value comes from environment variables (see .env.example). If they are
   missing the app still runs — `firebaseReady` is false, sign-in is hidden, and
   progress falls back to localStorage. That lets you develop and demo before
   the Firebase project exists.
   --------------------------------------------------------------------------- */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

let app = null;
let auth = null;
let db = null;

if (firebaseReady) {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (import.meta.env.DEV) {
  console.info(
    "[SCA Learn] Running in local mode — no Firebase config found. " +
      "Copy .env.example to .env.local and fill it in to enable accounts."
  );
}

export { app, auth, db };
