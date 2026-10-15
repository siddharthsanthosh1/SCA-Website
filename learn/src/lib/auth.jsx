import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseReady } from "./firebase";

const AuthCtx = createContext(null);

/* Friendlier text than Firebase's raw codes — these are read by 10-year-olds. */
const MESSAGES = {
  "auth/invalid-email": "That doesn't look like an email address.",
  "auth/missing-password": "Type a password first.",
  "auth/missing-email": "Type your email address first.",
  "auth/weak-password": "Passwords need at least 6 characters.",
  "auth/email-already-in-use": "There's already an account with that email. Try signing in.",
  "auth/credential-already-in-use": "There's already an account with that email. Try signing in.",
  "auth/invalid-credential": "That email and password don't match. Try again.",
  "auth/wrong-password": "That password isn't right.",
  "auth/user-not-found": "No account with that email yet. Create one below.",
  "auth/too-many-requests": "Too many tries. Wait a minute and try again.",
  "auth/operation-not-allowed": "That sign-in method isn't switched on in Firebase yet.",
  "auth/admin-restricted-operation": "Guest mode isn't switched on yet. Create an account instead, or ask your tutor.",
  "auth/network-request-failed": "Can't reach the internet right now.",
};
export const friendlyAuthError = (e) =>
  MESSAGES[e?.code] || "Something went wrong. Try again in a moment.";

async function ensureProfile(user) {
  if (!db || !user) return;
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        isAnonymous: user.isAnonymous,
        lastSeenAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    // Never block sign-in on a profile write.
    console.warn("[SCA Learn] profile write failed", err);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) ensureProfile(u);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      enabled: firebaseReady,

      async signIn(email, password) {
        const { user: u } = await signInWithEmailAndPassword(auth, email.trim(), password);
        await ensureProfile(u);
        return u;
      },

      /* `keepGuest`: a guest creating an account upgrades the guest pass in
         place (same uid), so their work stays put and no orphaned anonymous
         account is left behind. Otherwise it's a separate new account. */
      async signUp(name, email, password, { keepGuest = true } = {}) {
        const guest = auth.currentUser?.isAnonymous ? auth.currentUser : null;
        const { user: u } =
          guest && keepGuest
            ? await linkWithCredential(guest, EmailAuthProvider.credential(email.trim(), password))
            : await createUserWithEmailAndPassword(auth, email.trim(), password);
        const displayName = name.trim();
        if (displayName) await updateProfile(u, { displayName });
        await ensureProfile({ ...u, displayName });
        // onAuthStateChanged doesn't fire for a profile update, so show the new
        // name by hand — but only if they're still signed in: a sign-out while
        // the profile was saving must not be undone by this late update.
        if (auth.currentUser?.uid === u.uid) setUser({ ...u, displayName });
        return u;
      },

      /* Sends Firebase's reset link. Says nothing about whether the address
         has an account, so it can't be used to find out who's signed up. */
      async resetPassword(email) {
        try {
          await sendPasswordResetEmail(auth, email.trim());
        } catch (err) {
          if (err?.code !== "auth/user-not-found") throw err;
        }
      },

      signOut: () => fbSignOut(auth),
    }),
    [user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
