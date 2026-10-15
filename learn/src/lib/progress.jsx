/* ---------------------------------------------------------------------------
   Progress store.

   Signed in  → Firestore at users/{uid}/progress/all
   Signed out → the same shape in localStorage, so the site is usable without
                an account and nothing is lost if a kid signs up later.

   Writes are debounced (2s) and merged, so finishing a lesson costs one write
   rather than one per keystroke. That keeps a whole branch inside the Firestore
   free tier.

   Who the progress belongs to, and when and where it's saved, lives in
   progressStore.js — including the rules that stop one student's work landing
   in the next student's account on a shared computer.
   --------------------------------------------------------------------------- */

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react";
import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth";
import {
  applyAnswer, applyCompleteLesson, applyBuy, applyEquip, canBuy as canBuyIn, isOwned, isUnlocked,
  isEquipped as isEquippedIn, wornItems, earnedBreakdown, spentOf, gameOf, ensureGame, localDay, lessonSolved,
} from "./sparks";
import { SHOP_BY_ID } from "../data/shop";
import { createProgressStore, emptyCourse, hasWork } from "./progressStore";

const ProgressCtx = createContext(null);

// The student's own calendar day, the same as Sparks days — a UTC date would
// roll over mid-evening in the US and break a streak of consecutive days.
const today = () => localDay();
const daysBetween = (a, b) =>
  Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);

const progressDoc = (uid) => doc(db, "users", uid, "progress", "all");

const firestoreRemote = db && {
  async load(uid) {
    const snap = await getDoc(progressDoc(uid));
    return snap.exists() ? snap.data() : null;
  },
  /* Read, merge, write — atomically, so two tabs or devices saving at once
     can't overwrite each other. `merge` (in progressStore.js) decides the
     result; this only does the I/O. */
  update(uid, merge) {
    return runTransaction(db, async (tx) => {
      const ref = progressDoc(uid);
      const snap = await tx.get(ref);
      const next = merge(snap.exists() ? snap.data() : null);
      tx.set(ref, { ...next, updatedAt: serverTimestamp() });
      return next;
    });
  },
};

/* Signing out waits this long for the last change to reach Firestore before
   letting go of the account, so a slow network can't hold the button. */
const SIGN_OUT_FLUSH_MS = 1500;

export function ProgressProvider({ children }) {
  const { user, enabled } = useAuth();
  const [store] = useState(() => createProgressStore({ remote: firestoreRemote }));
  // `epoch` is bumped whenever state is replaced wholesale (load, sign-in,
  // sign-out) rather than changed by something the student did. The Sparks
  // counter uses it to tell "you just earned 5" from "your account just loaded".
  const { state, status, epoch } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  /* Layout effect, so the switch happens before the browser paints the new
     user — nothing can be clicked against the old user's state in between. */
  useLayoutEffect(() => {
    store.setIdentity(enabled && db ? user : null);
  }, [store, user, enabled]);

  const mutate = store.mutate;

  /* Save straight away if the page is going away mid-debounce — closing the
     tab, a full reload, or (on phones) switching apps. */
  useEffect(() => {
    const flush = () => store.flush();
    const onHide = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [store]);

  const bumpStreak = (s) => {
    const d = today();
    const last = s.streak?.lastDay;
    if (last === d) return s;
    const gap = last ? daysBetween(last, d) : null;
    s.streak = { count: gap === 1 ? (s.streak.count || 0) + 1 : 1, lastDay: d };
    return s;
  };

  const game = useMemo(() => {
    const g = gameOf(state);
    const earned = earnedBreakdown(state);
    const spent = spentOf(state);
    return {
      fun: g.fun,
      funOffered: g.funOffered,
      sparksEarned: earned.total,
      sparksBreakdown: earned,
      spent,
      // Can dip below zero if a course is reset after spending; never shown that way.
      sparks: Math.max(0, earned.total - spent),
      owned: Object.keys(g.owned),
      equipped: wornItems(state),
    };
  }, [state]);

  const api = {
    state,
    status,

    course(courseId) {
      return state.courses?.[courseId] || emptyCourse();
    },

    streak: state.streak || { count: 0, lastDay: null },

    isLessonDone(courseId, lessonId) {
      return Boolean(state.courses?.[courseId]?.completedLessons?.[lessonId]);
    },

    isLessonSolved(courseId, lessonId) {
      return lessonSolved(state, courseId, lessonId);
    },

    answerOf(courseId, qid) {
      return state.courses?.[courseId]?.answers?.[qid] || null;
    },

    completeLesson(courseId, lessonId, xp = 10) {
      mutate((s) => {
        applyCompleteLesson(s, courseId, lessonId, xp);
        return bumpStreak(s);
      }, { soon: true });
    },

    visitLesson(courseId, lessonId) {
      mutate((s) => {
        const c = (s.courses[courseId] ||= emptyCourse());
        c.lastLessonId = lessonId;
        return s;
      });
    },

    /* Sparks for a question come from the `correct` flag set here, so a
       question that is already solved pays nothing however often it's redone.
       See lib/sparks.js. */
    recordAnswer(courseId, qid, correct, xp = 5) {
      mutate((s) => {
        const { firstTimeRight } = applyAnswer(s, courseId, qid, correct, xp);
        return firstTimeRight ? bumpStreak(s) : s;
      });
    },

    /* Removes the course everywhere, Firestore included (see firestoreRemote).
       Its Sparks go with it because they're derived from it; what was bought
       stays bought, so resetting and redoing can't mint anything. */
    resetCourse(courseId) {
      mutate((s) => {
        delete s.courses[courseId];
        return s;
      }, { soon: true, removeCourse: courseId });
    },

    /* ---- the game layer: Sparks, the Workshop, Fun mode ---- */

    epoch,
    ...game,

    /* Get the last change into the account before signing out. Anything
       still pending once the user has changed is dropped, not carried over. */
    /* Work done signed out or as a guest that a sign-in could carry into an
       account — and the switch for whether it does. */
    carryable: (!user || user.isAnonymous) && hasWork(state)
      ? {
          lessons: Object.values(state.courses || {}).reduce((n, c) => n + Object.keys(c.completedLessons || {}).length, 0),
          answers: Object.values(state.courses || {}).reduce((n, c) => n + Object.values(c.answers || {}).filter((a) => a.correct).length, 0),
        }
      : null,
    setCarry: (on) => store.setCarry(on),

    flushBeforeSignOut() {
      return Promise.race([store.flush(), new Promise((r) => setTimeout(r, SIGN_OUT_FLUSH_MS))]);
    },

    canBuy: (itemId) => canBuyIn(state, itemId),
    isOwned: (itemId) => isOwned(state, SHOP_BY_ID[itemId]),
    isUnlocked: (itemId) => isUnlocked(state, SHOP_BY_ID[itemId]),
    isEquipped: (itemId) => isEquippedIn(state, itemId),

    buy(itemId) {
      // Re-checked against the latest state inside the update, so a double
      // tap can't spend twice or spend Sparks that aren't there.
      mutate((s) => (applyBuy(s, itemId), s), { soon: true });
    },

    equip(itemId) {
      mutate((s) => (applyEquip(s, itemId), s), { soon: true });
    },

    setFun(on) {
      mutate((s) => {
        const g = ensureGame(s);
        g.fun = Boolean(on);
        g.funOffered = true;
        return s;
      }, { soon: true });
    },

    markFunOffered() {
      if (gameOf(state).funOffered) return;
      mutate((s) => ((ensureGame(s).funOffered = true), s));
    },

    /* One-off moments (a building growing, a district lighting up, a new
       badge) are recorded here once they've been shown, so they play once. */
    hasSeen: (key) => Boolean(gameOf(state).seen[key]),
    markSeen(keys) {
      const list = [].concat(keys).filter((k) => !gameOf(state).seen[k]);
      if (!list.length) return;
      mutate((s) => {
        const g = ensureGame(s);
        for (const k of list) g.seen[k] = Date.now();
        return s;
      });
    },
  };

  return <ProgressCtx.Provider value={api}>{children}</ProgressCtx.Provider>;
}

export const useProgress = () => useContext(ProgressCtx);
