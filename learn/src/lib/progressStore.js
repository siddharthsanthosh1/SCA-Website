/* ---------------------------------------------------------------------------
   The progress store's sync logic — who the progress belongs to, when it is
   saved, and where. No React and no Firebase in here: progress.jsx wraps it
   and hands it a Firestore adapter, and tests/progress-store.test.mjs drives
   it with a fake one.

   Signed in  → the remote adapter (Firestore at users/{uid}/progress/all)
   Signed out → the same shape in localStorage

   Shared Chromebooks are the normal case, so identity is strict:

   - Every pending save is tagged with the uid and session it was made in, and
     is dropped if that is no longer the current session when it comes due.
   - Changing identity discards the in-memory state and any pending save.
     The one exception is a genuine upgrade — signed out or guest → an account
     — where the work done so far is carried into the account and merged.
     Nothing is ever carried from one signed-in user to another.
   - Signing out clears the localStorage copy, so the next child starts clean.
   - Signed-in progress never touches localStorage, so it can't be picked up
     by whoever signs in next.

   An account can be open in two tabs or on two devices, so a save never just
   overwrites the stored copy with this tab's: it reads what's stored, merges
   (keeping the better of each value, as at sign-in) and writes the result in
   one transaction. A stale tab can't undo newer progress, and a course reset
   removes that one course rather than replacing the whole document. Saves
   from one tab run one at a time, so they never contend with each other.

   A save takes two round trips, and closing the tab or reloading mid-save
   would lose it. So every signed-in change is also kept in localStorage under
   that student's uid until the account confirms it, and merged back in the
   next time that same account loads. It is deleted on sign-out, and only ever
   read for the uid that wrote it, so it can't reach another student.
   --------------------------------------------------------------------------- */

import { gameOf, mergeGame, snapshot } from "./sparks.js";

export const LS_KEY = "sca-learn:progress:v1";
export const SAVE_DELAY = 2000;

export const emptyCourse = () => ({
  xp: 0,
  completedLessons: {},
  answers: {},
  lastLessonId: null,
});

export const emptyAll = () => ({ courses: {}, streak: { count: 0, lastDay: null }, game: gameOf({}) });

const browserStorage = {
  get: (k) => localStorage.getItem(k),
  set: (k, v) => localStorage.setItem(k, v),
  remove: (k) => localStorage.removeItem(k),
};

function readLocal(storage) {
  try {
    const raw = storage.get(LS_KEY);
    return raw ? { ...emptyAll(), ...JSON.parse(raw) } : emptyAll();
  } catch {
    return emptyAll();
  }
}

function writeLocal(storage, state) {
  try {
    storage.set(LS_KEY, JSON.stringify(state));
  } catch {
    /* private mode, quota — progress just won't persist */
  }
}

/* Unsaved signed-in changes, per uid (see the header comment). */
const unsavedKey = (uid) => `${LS_KEY}:unsaved:${uid}`;

function readUnsaved(storage, uid) {
  try {
    const raw = storage.get(unsavedKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeUnsaved(storage, uid, state, removed) {
  try {
    storage.set(unsavedKey(uid), JSON.stringify({ state, removed }));
  } catch {
    /* private mode, quota — the save itself still runs */
  }
}

function clearUnsaved(storage, uid) {
  try {
    storage.remove(unsavedKey(uid));
  } catch {
    /* nothing to clear */
  }
}

function clearLocal(storage) {
  try {
    storage.remove(LS_KEY);
  } catch {
    /* nothing to clear */
  }
}

/* A question is solved if either copy solved it; attempts are the larger count. */
function mergeAnswers(a = {}, b = {}) {
  const out = { ...b, ...a };
  for (const id of Object.keys(a)) {
    if (!b[id]) continue;
    out[id] = {
      correct: Boolean(a[id].correct || b[id].correct),
      attempts: Math.max(a[id].attempts || 0, b[id].attempts || 0),
      at: Math.max(a[id].at || 0, b[id].at || 0),
    };
  }
  return out;
}

/* Merge two progress blobs, keeping the better of each value. Used when a
   student works signed-out and then signs in. */
export function mergeAll(a, b) {
  const out = {
    courses: {},
    streak: a.streak?.count >= (b.streak?.count || 0) ? a.streak : b.streak,
    game: mergeGame(a.game, b.game),
  };
  const ids = new Set([...Object.keys(a.courses || {}), ...Object.keys(b.courses || {})]);
  for (const id of ids) {
    const x = a.courses?.[id] || emptyCourse();
    const y = b.courses?.[id] || emptyCourse();
    out.courses[id] = {
      xp: Math.max(x.xp || 0, y.xp || 0),
      completedLessons: { ...y.completedLessons, ...x.completedLessons },
      answers: mergeAnswers(x.answers, y.answers),
      lastLessonId: x.lastLessonId || y.lastLessonId || null,
    };
  }
  return snapshot(out);
}

/* Has anything been done in this state worth merging into an account? */
export function hasWork(s) {
  const g = s?.game || {};
  return (
    Object.keys(s?.courses || {}).length > 0 ||
    Object.keys(g.owned || {}).length > 0 ||
    Object.keys(g.seen || {}).length > 0 ||
    Boolean(g.funOffered)
  );
}

/**
 * @param remote  { load(uid) → data|null, update(uid, fn) → written } or null.
 *                `update` runs fn(stored|null) → next and writes `next`
 *                atomically (a Firestore transaction), returning what it wrote.
 * @param storage { get, set, remove } — localStorage by default
 */
export function createProgressStore({ remote = null, storage = browserStorage, saveDelay = SAVE_DELAY } = {}) {
  // `gen` changes on every identity change; anything tagged with an older gen
  // belongs to someone who has gone.
  let session = { uid: null, anon: true, gen: 0 };
  let loadedFor = null; // uid whose saved copy is in memory
  let loading = null; // gen of a load in flight
  let pending = null; // { next, uid, gen, timer } waiting on the debounce
  // Courses reset since the last successful save: removed from the stored
  // copy too, or the merge would bring them straight back.
  let removals = new Set();
  // Course resets not yet confirmed by the account — kept with the unsaved copy.
  let unsavedRemovals = new Set();
  // The save to the account currently on the wire, if any; the next one waits.
  let saving = Promise.resolve();
  // At most one save waits behind it, always carrying the latest state — so
  // saves can't pile up behind a slow network and arrive seconds late.
  let waiting = null; // { p, promise }
  // Whether the next sign-in takes the signed-out / guest work with it. On a
  // shared computer that work may be someone else's, so the sign-in page asks.
  let carryNext = true;
  let snap = { state: readLocal(storage), status: "idle", epoch: 0 };
  const listeners = new Set();

  const emit = (patch) => {
    snap = { ...snap, ...patch };
    for (const l of listeners) l();
  };

  function cancelPending() {
    if (!pending) return;
    clearTimeout(pending.timer);
    pending = null;
  }

  async function load(uid, gen, carry) {
    loading = gen;
    try {
      const data = await remote.load(uid);
      if (gen !== session.gen) return; // signed out or switched while loading
      const { updatedAt, ...saved } = data || {};
      const base = { ...emptyAll(), ...saved };
      // What's in memory now is either work carried in by an upgrade, or
      // what this same user did while the account was loading. Never another
      // user's: a real switch emptied it.
      const cur = snap.state;
      const touched = hasWork(cur);
      // Changes this account made here that never reached it (the tab closed
      // mid-save). Newer than the stored copy, so their settings win.
      let stored = base;
      const unsaved = readUnsaved(storage, uid);
      if (unsaved?.state) {
        stored = { ...base, courses: { ...(base.courses || {}) } };
        for (const id of unsaved.removed || []) {
          delete stored.courses[id];
          removals.add(id);
          unsavedRemovals.add(id);
        }
        stored = mergeAll(unsaved.state, stored);
      }
      // The first copy's settings (Fun mode, what's equipped) win: the
      // account's, unless it has no saved copy yet — a brand-new account
      // keeps the settings of the work being carried into it.
      const next = touched ? (data || unsaved ? mergeAll(stored, cur) : mergeAll(cur, stored)) : stored;
      loadedFor = uid;
      emit({ state: next, epoch: snap.epoch + 1, status: "idle" });
      // The signed-out copy now lives in the account.
      if (carry) clearLocal(storage);
      if (touched || unsaved) queueSave(next, 0);
    } catch (err) {
      console.warn("[SCA Learn] progress load failed", err);
      if (gen === session.gen) emit({ status: "error" });
    } finally {
      if (loading === gen) loading = null;
    }
  }

  async function save(p) {
    if (p.gen !== session.gen) return; // made for someone who has since left
    if (p.uid === null || !remote) {
      writeLocal(storage, p.next);
      emit({ status: "saved" });
      return;
    }
    // Never write an account before its saved copy has loaded — the
    // in-memory state is missing everything stored. The load merges what's
    // in memory and saves the result; if it failed, try it again.
    if (loadedFor !== p.uid) {
      if (loading !== p.gen) load(p.uid, p.gen, false);
      return;
    }
    // One save at a time: wait for the one on the wire, then send. A save
    // already waiting just takes this newer state instead of queueing another.
    if (waiting) {
      waiting.p = p;
      return waiting.promise;
    }
    const entry = { p, promise: null };
    entry.promise = saving.then(() => {
      if (waiting === entry) waiting = null;
      return saveRemote(entry.p);
    });
    waiting = entry;
    saving = entry.promise.catch(() => {});
    return entry.promise;
  }

  async function saveRemote(p) {
    if (p.gen !== session.gen) return;
    const removed = [...removals];
    removals = new Set();
    try {
      const written = await remote.update(p.uid, (stored) => {
        const { updatedAt, ...rest } = stored || {};
        const base = { ...emptyAll(), ...rest, courses: { ...(rest.courses || {}) } };
        for (const id of removed) delete base.courses[id];
        // This tab's state first: its settings (Fun mode, what's equipped)
        // are the latest thing the student did.
        return mergeAll(p.next, base);
      });
      if (p.gen !== session.gen) return;
      for (const id of removed) unsavedRemovals.delete(id);
      // Nothing newer than this save? Then the account has everything.
      if (snap.state === p.next) clearUnsaved(storage, p.uid);
      // Pick up anything another tab or device saved meanwhile — unless the
      // student has changed something here since, which the next save merges.
      if (snap.state === p.next && JSON.stringify(written) !== JSON.stringify(p.next)) {
        emit({ state: written, status: "saved", epoch: snap.epoch + 1 });
      } else emit({ status: "saved" });
    } catch (err) {
      console.warn("[SCA Learn] progress save failed", err);
      if (p.gen !== session.gen) return;
      // Still in memory; the next change retries with the whole state.
      for (const id of removed) removals.add(id);
      emit({ status: "error" });
    }
  }

  function queueSave(next, delay = saveDelay) {
    cancelPending();
    const p = { next, uid: session.uid, gen: session.gen, timer: null };
    p.timer = setTimeout(() => {
      if (pending === p) pending = null;
      save(p);
    }, delay);
    pending = p;
    emit({ status: "saving" });
  }

  return {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSnapshot: () => snap,
    getState: () => snap.state,

    /* Decide whether the next sign-in carries the work done so far into the
       account (true) or starts from the account's own copy (false). */
    setCarry(on) {
      carryNext = Boolean(on);
    },

    /* Call with the signed-in user (or null) whenever it might have changed. */
    setIdentity(user) {
      const uid = user?.uid ?? null;
      const anon = !user || Boolean(user.isAnonymous);
      if (uid === session.uid) {
        // Same account (a profile update, or a guest linked to an account
        // keeping its uid) — nothing to reload.
        session = { ...session, anon };
        return;
      }
      const carry = session.anon && uid !== null && carryNext;
      if (uid !== null) carryNext = true;
      cancelPending();
      // The leaving account's unsaved copy goes too: on a shared computer the
      // next person must not find it in localStorage.
      if (session.uid !== null) clearUnsaved(storage, session.uid);
      unsavedRemovals = new Set();
      session = { uid, anon, gen: session.gen + 1 };
      loadedFor = null;
      removals = new Set();
      waiting = null;
      if (!carry) {
        // Signing out, or one account replacing another: start clean.
        clearLocal(storage);
        emit({ state: emptyAll(), status: "idle", epoch: snap.epoch + 1 });
      }
      if (uid !== null && remote) {
        // Pages wait on this (see RequireAccount), so a student never sees an
        // empty account — 0 Sparks, nothing done — while theirs is loading.
        emit({ status: "loading" });
        load(uid, session.gen, carry);
      }
    },

    /* `soon` skips the debounce; `removeCourse` deletes that course from the
       stored copy as well (a course reset). */
    mutate(fn, { soon = false, removeCourse = null } = {}) {
      const next = snapshot(fn(structuredClone(snap.state)));
      if (removeCourse) {
        removals.add(removeCourse);
        unsavedRemovals.add(removeCourse);
      }
      if (session.uid !== null && remote) {
        // Until the account has loaded, the backup from last time hasn't been
        // read yet (load() merges it) — add to it rather than overwrite it.
        // Otherwise the first thing a page does (noting the lesson visited)
        // would wipe the unsaved work it exists to protect.
        let keep = next;
        let removed = [...unsavedRemovals];
        if (loadedFor !== session.uid) {
          const prev = readUnsaved(storage, session.uid);
          if (prev?.state) {
            keep = mergeAll(next, prev.state);
            removed = [...new Set([...removed, ...(prev.removed || [])])];
          }
        }
        writeUnsaved(storage, session.uid, keep, removed);
      }
      emit({ state: next });
      queueSave(next, soon ? 0 : saveDelay);
    },

    /* Save now rather than at the end of the debounce — the page is going
       away, or the student is about to sign out. */
    flush() {
      if (!pending) return Promise.resolve();
      const p = pending;
      cancelPending();
      return save(p);
    },
  };
}
