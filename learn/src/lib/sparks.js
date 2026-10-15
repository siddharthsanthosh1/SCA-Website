/* ---------------------------------------------------------------------------
   Sparks — the game layer's arithmetic, as pure functions.

   The balance is never a counter that gets incremented. It is worked out from
   what the student has actually done, every time:

     earned = 5  × questions whose `correct` flag is set
            + 15 × games solved (a blitz round: finished, at any score)
            + 10 × lessons completed
            + 50 × topics with every lesson completed
            + 200 × courses with every lesson completed
            + 5  × distinct days with any activity
     spent  = the catalogue price of every item owned
     balance = earned − spent

   So redoing a solved question pays nothing (its flag is already true), and a
   desynced or hand-edited number can't hand out free Sparks. A snapshot
   { earned, spent, balance } is written into the progress document so anyone
   reading it in the Firebase console can see it, but the app never trusts it.

   No React and no Firebase in here: progress.jsx uses these reducers, and the
   tests and scripts/check-economy.mjs import them straight into Node.
   --------------------------------------------------------------------------- */

import { courses as ALL_COURSES } from "../data/courses.js";
import { shopItems, SHOP_BY_ID, DEFAULT_EQUIPPED } from "../data/shop.js";

export const PAY = { question: 5, game: 15, lesson: 10, topic: 50, course: 200, day: 5 };

/* The student's own calendar day, not UTC — "first activity of a day" should
   roll over at their midnight. */
export function localDay(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const emptyGame = () => ({
  fun: true,
  funOffered: false,
  owned: {},
  equipped: { ...DEFAULT_EQUIPPED, town: [] },
  days: {},
  seen: {},
  sparks: { earned: 0, spent: 0, balance: 0 },
});

/* Read the game slice with every default filled in. Old progress documents
   have no `game` at all, and Firestore merges can leave partial maps. */
export function gameOf(state) {
  const g = state?.game || {};
  const base = emptyGame();
  return {
    ...base,
    ...g,
    fun: g.fun !== false,
    owned: { ...(g.owned || {}) },
    equipped: { ...base.equipped, ...(g.equipped || {}), town: Array.isArray(g.equipped?.town) ? [...g.equipped.town] : [] },
    days: { ...(g.days || {}) },
    seen: { ...(g.seen || {}) },
  };
}

/* For reducers: make sure s.game exists and is complete, then hand it back. */
export function ensureGame(s) {
  s.game = gameOf(s);
  return s.game;
}

/* ---------------------------------------------------------- progress facts */

const courseState = (state, id) => state?.courses?.[id] || { completedLessons: {}, answers: {} };

export const isLessonDone = (state, courseId, lessonId) => Boolean(courseState(state, courseId).completedLessons?.[lessonId]);

export const isTopicDone = (state, course, topic) =>
  topic.lessons.length > 0 && topic.lessons.every((l) => isLessonDone(state, course.id, l.id));

export const isCourseDone = (state, course) =>
  course.topics.length > 0 && course.topics.every((t) => isTopicDone(state, course, t));

export const coursesDone = (state, list = ALL_COURSES) => list.filter((c) => c.status === "live" && isCourseDone(state, c));

/* A game is only recorded once it ends (see GameHost). Puzzles pay when the
   student solved them — not on a wrong click, and not for "Show me the
   answer". A blitz round pays for being played to the end, whatever the score. */
export const gamePaid = (game, answer) => Boolean(answer) && (Boolean(answer.correct) || game?.kind === "blitz");

/* Sparks earned inside one lesson — what the lesson-complete card shows. */
export function lessonSparks(state, course, lesson) {
  const answers = courseState(state, course.id).answers || {};
  const q = (lesson.questions || []).filter((id) => answers[id]?.correct).length;
  const byId = new Map((course.games || []).map((g) => [g.id, g]));
  const gm = (lesson.games || []).filter((id) => gamePaid(byId.get(id), answers[id])).length;
  return q * PAY.question + gm * PAY.game + (isLessonDone(state, course.id, lesson.id) ? PAY.lesson : 0);
}

/* ------------------------------------------------------------------ totals */

export function earnedBreakdown(state, list = ALL_COURSES) {
  const out = { questions: 0, games: 0, lessons: 0, topics: 0, courses: 0, days: 0 };
  for (const course of list) {
    if (course.status !== "live") continue;
    const c = courseState(state, course.id);
    const answers = c.answers || {};
    out.questions += course.questions.filter((q) => answers[q.id]?.correct).length;
    out.games += (course.games || []).filter((gm) => gamePaid(gm, answers[gm.id])).length;
    for (const t of course.topics) {
      out.lessons += t.lessons.filter((l) => c.completedLessons?.[l.id]).length;
      if (isTopicDone(state, course, t)) out.topics += 1;
    }
    if (isCourseDone(state, course)) out.courses += 1;
  }
  out.days = Object.keys(state?.game?.days || {}).length;
  const sparks = {
    questions: out.questions * PAY.question,
    games: out.games * PAY.game,
    lessons: out.lessons * PAY.lesson,
    topics: out.topics * PAY.topic,
    courses: out.courses * PAY.course,
    days: out.days * PAY.day,
  };
  return { counts: out, sparks, total: Object.values(sparks).reduce((a, b) => a + b, 0) };
}

export const earnedOf = (state, list) => earnedBreakdown(state, list).total;

export function spentOf(state) {
  return Object.keys(state?.game?.owned || {}).reduce((sum, id) => sum + (SHOP_BY_ID[id]?.price || 0), 0);
}

export const balanceOf = (state, list) => earnedOf(state, list) - spentOf(state);

/* ---------------------------------------------------------------- the shop */

export const isOwned = (state, item) =>
  Boolean(item) && (Boolean(state?.game?.owned?.[item.id]) || (item.price === 0 && !item.lock));

export function isUnlocked(state, item, list = ALL_COURSES) {
  const lock = item?.lock;
  if (!lock) return true;
  if (lock.anyCourses) return coursesDone(state, list).length >= lock.anyCourses;
  const course = list.find((c) => c.id === lock.courseId);
  if (!course) return false;
  if (!lock.topicId) return isCourseDone(state, course);
  const topic = course.topics.find((t) => t.id === lock.topicId);
  return Boolean(topic) && isTopicDone(state, course, topic);
}

export function lockText(item, list = ALL_COURSES) {
  const lock = item?.lock;
  if (!lock) return "";
  if (lock.anyCourses) return `Finish any ${lock.anyCourses === 2 ? "two" : lock.anyCourses} courses to unlock`;
  const course = list.find((c) => c.id === lock.courseId);
  const topic = course?.topics.find((t) => t.id === lock.topicId);
  return topic ? `Finish “${topic.title}” in ${course.title} to unlock` : `Finish ${course?.title || "a course"} to unlock`;
}

/* --------------------------------------------------------------- reducers
   Each takes a draft state (already cloned by the store), changes it in place
   and returns a small result. They never pay anything directly — payment is
   always re-derived — so the only thing that matters is what gets recorded. */

export function touchDay(s, day = localDay()) {
  ensureGame(s).days[day] = 1;
}

export function applyAnswer(s, courseId, qid, correct, xp = 5, { now = Date.now(), day = localDay() } = {}) {
  s.courses ||= {};
  const c = (s.courses[courseId] ||= { xp: 0, completedLessons: {}, answers: {}, lastLessonId: null });
  c.answers ||= {};
  const prev = c.answers[qid] || { correct: false, attempts: 0 };
  const firstTimeRight = Boolean(correct) && !prev.correct;
  c.answers[qid] = { correct: prev.correct || Boolean(correct), attempts: prev.attempts + 1, at: now };
  if (firstTimeRight) c.xp = (c.xp || 0) + xp;
  touchDay(s, day);
  return { firstTimeRight };
}

/* Every question in the lesson has been answered correctly. A lesson can only
   be completed once it has — otherwise clicking "Finish" through a course
   would pay its lesson, topic and course Sparks, build its town and print its
   certificate without a single answer. */
const LESSONS = new Map(
  ALL_COURSES.flatMap((c) => (c.topics || []).flatMap((t) => t.lessons.map((l) => [`${c.id}/${l.id}`, l])))
);

export function lessonSolved(state, courseId, lessonId) {
  const lesson = LESSONS.get(`${courseId}/${lessonId}`);
  if (!lesson) return false;
  const answers = courseState(state, courseId).answers || {};
  return (lesson.questions || []).every((id) => answers[id]?.correct);
}

export function applyCompleteLesson(s, courseId, lessonId, xp = 10, { now = Date.now(), day = localDay() } = {}) {
  if (!lessonSolved(s, courseId, lessonId)) return { first: false, unsolved: true };
  s.courses ||= {};
  const c = (s.courses[courseId] ||= { xp: 0, completedLessons: {}, answers: {}, lastLessonId: null });
  c.completedLessons ||= {};
  const first = !c.completedLessons[lessonId];
  if (first) {
    c.completedLessons[lessonId] = now;
    c.xp = (c.xp || 0) + xp;
  }
  c.lastLessonId = lessonId;
  touchDay(s, day);
  return { first };
}

export function canBuy(state, itemId) {
  const item = SHOP_BY_ID[itemId];
  if (!item) return { ok: false, reason: "missing" };
  if (isOwned(state, item)) return { ok: false, reason: "owned" };
  if (!isUnlocked(state, item)) return { ok: false, reason: "locked" };
  const short = item.price - balanceOf(state);
  if (short > 0) return { ok: false, reason: "short", short };
  return { ok: true };
}

export function applyBuy(s, itemId, { now = Date.now() } = {}) {
  const check = canBuy(s, itemId);
  if (check.ok) ensureGame(s).owned[itemId] = now;
  return check;
}

/* Equip toggles. Pip's slots hold one item each (taking off a colour or eyes
   goes back to the free default); town decorations are a list, and equipping
   one places it in Byteville. Keys are set to null rather than deleted —
   Firestore merge-writes never remove a key. */
export function applyEquip(s, itemId) {
  const item = SHOP_BY_ID[itemId];
  if (!item || !isOwned(s, item)) return { ok: false };
  const game = ensureGame(s);
  if (item.slot === "town") {
    const placed = game.equipped.town;
    game.equipped.town = placed.includes(itemId) ? placed.filter((x) => x !== itemId) : [...placed, itemId];
  } else if (game.equipped[item.slot] === itemId) {
    game.equipped[item.slot] = DEFAULT_EQUIPPED[item.slot] ?? null;
  } else {
    game.equipped[item.slot] = itemId;
  }
  return { ok: true };
}

export function isEquipped(state, itemId) {
  const item = SHOP_BY_ID[itemId];
  if (!item) return false;
  const eq = gameOf(state).equipped;
  return item.slot === "town" ? eq.town.includes(itemId) : eq[item.slot] === itemId;
}

/* Only items that are owned and still exist get worn. */
export function wornItems(state) {
  const eq = gameOf(state).equipped;
  const ok = (id) => (id && isOwned(state, SHOP_BY_ID[id]) ? id : null);
  return {
    body: ok(eq.body) || DEFAULT_EQUIPPED.body,
    eyes: ok(eq.eyes) || DEFAULT_EQUIPPED.eyes,
    hat: ok(eq.hat),
    pack: ok(eq.pack),
    trail: ok(eq.trail),
    town: eq.town.filter((id) => ok(id)),
  };
}

export function snapshot(s) {
  const earned = earnedOf(s);
  const spent = spentOf(s);
  ensureGame(s).sparks = { earned, spent, balance: earned - spent };
  return s;
}

/* Two copies of the game slice — signed-out work meeting an account. Keep
   everything owned and every day learned; the account's settings win. */
export function mergeGame(a, b) {
  const x = gameOf({ game: a });
  const y = gameOf({ game: b });
  return {
    ...y,
    ...x,
    owned: { ...y.owned, ...x.owned },
    days: { ...y.days, ...x.days },
    seen: { ...y.seen, ...x.seen },
    funOffered: x.funOffered || y.funOffered,
    equipped: a ? x.equipped : y.equipped,
  };
}

export const SHOP = shopItems;
