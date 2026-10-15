/* Run with: npm test
   The progress store on a shared computer: one student's work must never end
   up in the next student's account. These drive the real store
   (src/lib/progressStore.js) with a fake Firestore and fake timers. */

import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/data/courses.js";
import { applyAnswer, applyCompleteLesson, earnedOf } from "../src/lib/sparks.js";
import { createProgressStore, LS_KEY, SAVE_DELAY } from "../src/lib/progressStore.js";

const python = courses.find((c) => c.id === "python");
const java = courses.find((c) => c.id === "java");
const [qA, qB] = python.questions;
const lessonA = python.topics[0].lessons[0];

const clone = (v) => JSON.parse(JSON.stringify(v));

/* A lesson can only be completed once its questions are solved. */
function solveLesson(s, courseId, lesson) {
  for (const id of lesson.questions || []) applyAnswer(s, courseId, id, true, 5, DAY);
  applyCompleteLesson(s, courseId, lesson.id, 10, DAY);
  return s;
}

/* Like runTransaction: read the stored copy, let the store decide what to
   write, write that whole document. */
function fakeFirestore() {
  const docs = {};
  const writes = [];
  return {
    docs,
    writes,
    async load(uid) {
      await null;
      return docs[uid] ? clone(docs[uid]) : null;
    },
    async update(uid, merge) {
      await null;
      writes.push(uid);
      const next = merge(docs[uid] ? clone(docs[uid]) : null);
      docs[uid] = clone(next);
      return clone(next);
    },
  };
}

function fakeStorage() {
  const m = new Map();
  return { m, get: (k) => m.get(k) ?? null, set: (k, v) => m.set(k, v), remove: (k) => m.delete(k) };
}

const settle = async () => {
  for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r));
};

const A = { uid: "student-a", isAnonymous: false };
const B = { uid: "student-b", isAnonymous: false };
const DAY = { day: "2026-10-06" };

beforeEach(() => mock.timers.enable({ apis: ["setTimeout"] }));
afterEach(() => mock.timers.reset());

test("A signs out mid-debounce, B signs in: B's document has nothing of A's", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });

  store.setIdentity(A);
  await settle();
  store.mutate((s) => (applyAnswer(s, "java", java.questions[0].id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY);
  await settle();
  assert.ok(fs.docs[A.uid].courses.java, "A's first answer saved to A");

  // A's last answer is still on the debounce when they sign out.
  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY / 2);
  store.setIdentity(null);
  assert.equal(storage.m.has(LS_KEY), false, "sign-out leaves nothing in localStorage");
  assert.deepEqual(store.getState().courses, {}, "sign-out empties the in-memory state");

  store.setIdentity(B);
  mock.timers.tick(SAVE_DELAY * 5); // let A's old timer come due, if it still exists
  await settle();
  store.mutate((s) => (applyAnswer(s, "python", qB.id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY);
  await settle();

  const b = fs.docs[B.uid];
  assert.ok(b, "B's document was written");
  assert.equal(b.courses.java, undefined, "nothing from A's saved work");
  assert.equal(b.courses.python.answers[qA.id], undefined, "nothing from A's pending answer");
  assert.ok(b.courses.python.answers[qB.id].correct, "B's own answer is there");
  assert.equal(b.game.sparks.earned, earnedOf(b), "B's Sparks are only B's");
  assert.equal(fs.docs[A.uid].courses.python, undefined, "A's dropped write didn't land late either");
  assert.equal(storage.m.has(LS_KEY), false, "B's progress isn't left in localStorage");
});

test("switching straight from A to B (no sign-out) carries nothing across", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });

  store.setIdentity(A);
  await settle();
  store.mutate((s) => solveLesson(s, "python", lessonA));
  store.setIdentity(B); // before A's debounce fires
  // B acts while B's account is still loading.
  store.mutate((s) => (applyAnswer(s, "java", java.questions[0].id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY * 5);
  await settle(); // B's account loads and merges what B did meanwhile...
  mock.timers.tick(0);
  await settle(); // ...and saves it

  const b = fs.docs[B.uid];
  assert.equal(b.courses.python, undefined);
  assert.ok(b.courses.java.answers[java.questions[0].id].correct);
  assert.equal(fs.writes.includes(A.uid), false, "A's pending write was dropped, not sent to anyone");
  assert.equal(storage.m.has(LS_KEY), false);
});

test("a save that fails while signed in doesn't park the work in localStorage", async () => {
  const fs = fakeFirestore();
  fs.update = async () => {
    throw new Error("permission-denied");
  };
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY);
  await settle();
  assert.equal(store.getSnapshot().status, "error");
  assert.equal(storage.m.has(LS_KEY), false);
});

test("signed-out work is still merged into the account it signs in to", async () => {
  const fs = fakeFirestore();
  fs.docs[A.uid] = { courses: { java: { xp: 5, completedLessons: {}, answers: { [java.questions[0].id]: { correct: true, attempts: 1, at: 1 } } } } };
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });

  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY);
  assert.ok(storage.m.has(LS_KEY), "signed-out work is kept locally");

  store.setIdentity(A);
  await settle();
  mock.timers.tick(0);
  await settle();
  const a = fs.docs[A.uid];
  assert.ok(a.courses.python.answers[qA.id].correct, "local work merged into the account");
  assert.ok(a.courses.java, "account's own work kept");
  assert.equal(storage.m.has(LS_KEY), false, "local copy cleared once absorbed");
});

test("a guest who creates an account keeps their work", async () => {
  const fs = fakeFirestore();
  const store = createProgressStore({ remote: fs, storage: fakeStorage() });
  const guest = { uid: "guest-1", isAnonymous: true };
  store.setIdentity(guest);
  await settle();
  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s));
  store.setIdentity(A); // signUp replaces the guest with a new account
  await settle();
  mock.timers.tick(0);
  await settle();
  assert.ok(fs.docs[A.uid].courses.python.answers[qA.id].correct);
});

test("a reset course stays reset after a reload, Sparks included", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  let store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  store.mutate((s) => {
    solveLesson(s, "python", lessonA);
    applyAnswer(s, "java", java.questions[0].id, true, 5, DAY);
    return s;
  });
  mock.timers.tick(SAVE_DELAY);
  await settle();
  const before = earnedOf(fs.docs[A.uid]);

  store.mutate((s) => (delete s.courses.python, s), { soon: true, removeCourse: "python" });
  mock.timers.tick(0);
  await settle();
  // Something else changes before the next load — an ordinary merge-write.
  store.mutate((s) => (applyAnswer(s, "java", java.questions[1].id, false, 5, DAY), s));
  mock.timers.tick(SAVE_DELAY);
  await settle();

  // Reload: a fresh store reading the same account.
  store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  const s = store.getState();
  assert.equal(s.courses.python, undefined, "python is still reset");
  assert.ok(s.courses.java, "other courses untouched");
  assert.equal(earnedOf(s), before - 10 - 5 * lessonA.questions.length, "the lesson's and its questions' Sparks went with it");
  assert.equal(fs.docs[A.uid].game.sparks.earned, earnedOf(s), "stored snapshot agrees");
});

test("a save already in flight when A signs out can't fall back into the next student's hands", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  let reject;
  fs.update = () => new Promise((_, r) => (reject = r));
  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s), { soon: true });
  mock.timers.tick(0);
  await settle(); // A's write is now on the wire
  store.setIdentity(null);
  reject(new Error("permission-denied")); // rules reject it: A is no longer signed in
  await settle();
  assert.equal(storage.m.has(LS_KEY), false, "A's rejected write wasn't kept locally");
  assert.equal(store.getSnapshot().status, "idle", "and doesn't show as B's error");
});

test("a stale tab saving can't undo what another tab saved", async () => {
  const fs = fakeFirestore();
  const tab1 = createProgressStore({ remote: fs, storage: fakeStorage() });
  const tab2 = createProgressStore({ remote: fs, storage: fakeStorage() });
  tab1.setIdentity(A);
  tab2.setIdentity(A);
  await settle();
  // Tab 2 gets a question wrong; tab 1 then solves it and finishes a lesson.
  tab2.mutate((s) => (applyAnswer(s, "python", qA.id, false, 5, DAY), s), { soon: true });
  mock.timers.tick(0);
  await settle();
  tab1.mutate((s) => solveLesson(s, "python", lessonA), { soon: true });
  mock.timers.tick(0);
  await settle();
  // Tab 2, still holding the old state, changes something else.
  tab2.mutate((s) => (applyAnswer(s, "java", java.questions[0].id, true, 5, DAY), s), { soon: true });
  mock.timers.tick(0);
  await settle();
  const doc = fs.docs[A.uid];
  assert.equal(doc.courses.python.answers[qA.id].correct, true, "tab 1's right answer survived");
  assert.ok(doc.courses.python.completedLessons[lessonA.id], "and its finished lesson");
  assert.equal(doc.courses.java.answers[java.questions[0].id].correct, true, "tab 2's change is there too");
  assert.equal(tab2.getState().courses.python.answers[qA.id].correct, true, "tab 2 picked up tab 1's work");
});

test("resetting a course from a stale tab removes only that course", async () => {
  const fs = fakeFirestore();
  const tab1 = createProgressStore({ remote: fs, storage: fakeStorage() });
  const tab2 = createProgressStore({ remote: fs, storage: fakeStorage() });
  tab1.setIdentity(A);
  tab2.setIdentity(A);
  await settle();
  tab1.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), applyAnswer(s, "java", java.questions[0].id, true, 5, DAY), s), { soon: true });
  mock.timers.tick(0);
  await settle();
  tab2.mutate((s) => (delete s.courses.python, s), { soon: true, removeCourse: "python" });
  mock.timers.tick(0);
  await settle();
  assert.equal(fs.docs[A.uid].courses.python, undefined, "python is reset");
  assert.equal(fs.docs[A.uid].courses.java.answers[java.questions[0].id].correct, true, "java, saved by the other tab, is untouched");
});

test("signing in can leave the work on this computer behind", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });
  store.mutate((s) => (applyAnswer(s, "python", qA.id, true, 5, DAY), s)); // someone else, signed out
  store.setCarry(false);
  store.setIdentity(A);
  await settle();
  mock.timers.tick(SAVE_DELAY * 5);
  await settle();
  assert.equal(store.getState().courses.python, undefined, "A's account didn't get it");
  assert.equal(fs.docs[A.uid], undefined, "and nothing was written to A");
  assert.equal(storage.m.has(LS_KEY), false, "the leftover work is cleared from this computer");
});

test("a guest's settings survive moving into a brand-new account", async () => {
  const fs = fakeFirestore();
  const store = createProgressStore({ remote: fs, storage: fakeStorage() });
  store.mutate((s) => {
    s.game = { ...(s.game || {}), fun: false, funOffered: true };
    return s;
  });
  store.setIdentity(A);
  await settle();
  assert.equal(store.getState().game.fun, false, "Fun mode stays off");
});

test("closing the tab mid-save loses nothing: the same account gets it back next load", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  let store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  const realUpdate = fs.update;
  fs.update = () => new Promise(() => {}); // the save never arrives: the tab closed
  store.mutate((s) => solveLesson(s, "python", lessonA), { soon: true });
  mock.timers.tick(0);
  await settle();
  // Reload: a fresh page, the account as it was before the lost save.
  fs.update = realUpdate;
  store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  assert.ok(store.getState().courses.python?.completedLessons?.[lessonA.id], "the finished lesson came back");
  mock.timers.tick(0);
  await settle();
  assert.ok(fs.docs[A.uid].courses.python.completedLessons[lessonA.id], "and reached the account");
  assert.equal([...storage.m.keys()].some((k) => k.includes(":unsaved:")), false, "the backup is gone once saved");
});

test("the unsaved backup never reaches the next student", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  const store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  fs.update = () => new Promise(() => {});
  store.mutate((s) => solveLesson(s, "python", lessonA), { soon: true });
  mock.timers.tick(0);
  await settle();
  store.setIdentity(null); // A signs out
  assert.equal([...storage.m.keys()].some((k) => k.includes(":unsaved:")), false, "A's backup is deleted on sign-out");
});

test("the backup survives a change made before the account has loaded", async () => {
  const fs = fakeFirestore();
  const storage = fakeStorage();
  let store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  await settle();
  const realUpdate = fs.update;
  fs.update = () => new Promise(() => {});
  store.mutate((s) => solveLesson(s, "python", lessonA), { soon: true });
  mock.timers.tick(0);
  await settle();
  // Reload. The new page notes the lesson visited before A's account loads.
  fs.update = realUpdate;
  const realLoad = fs.load;
  let release;
  fs.load = (uid) => new Promise((r) => (release = () => r(realLoad(uid))));
  store = createProgressStore({ remote: fs, storage });
  store.setIdentity(A);
  store.mutate((s) => ((s.courses.java ||= { xp: 0, completedLessons: {}, answers: {}, lastLessonId: null }).lastLessonId = "1.1", s));
  release();
  await settle();
  assert.ok(store.getState().courses.python?.completedLessons?.[lessonA.id], "the unsaved lesson is still recovered");
  assert.equal(store.getState().courses.java.lastLessonId, "1.1", "and the new change is kept too");
});

test("saves don't pile up behind a slow one: the next save carries the latest state", async () => {
  const fs = fakeFirestore();
  const store = createProgressStore({ remote: fs, storage: fakeStorage() });
  store.setIdentity(A);
  await settle();
  const realUpdate = fs.update;
  let release;
  const calls = [];
  fs.update = (uid, merge) => {
    calls.push(uid);
    if (calls.length === 1) return new Promise((r) => (release = () => r(realUpdate(uid, merge))));
    return realUpdate(uid, merge);
  };
  const qs = python.questions.slice(0, 4);
  for (const q of qs) {
    store.mutate((s) => (applyAnswer(s, "python", q.id, true, 5, DAY), s), { soon: true });
    mock.timers.tick(0);
    await settle();
  }
  release();
  await settle();
  assert.equal(calls.length, 2, "one slow save, then one save with everything else");
  for (const q of qs) assert.equal(fs.docs[A.uid].courses.python.answers[q.id].correct, true);
});
