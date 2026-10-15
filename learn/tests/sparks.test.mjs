/* Run with: npm test
   The Sparks rules that matter most: nothing pays twice, and nothing can be
   bought with Sparks that aren't there. These use the same reducers the
   progress store calls, so they test the real code path. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { courses, allLessons } from "../src/data/courses.js";
import { applyAnswer, applyCompleteLesson, applyBuy, applyEquip, balanceOf, earnedOf, isEquipped, PAY } from "../src/lib/sparks.js";
import { emptyState, doneCourse } from "../scripts/lib/synthetic.mjs";

const python = courses.find((c) => c.id === "python");
const java = courses.find((c) => c.id === "java");
const DAY = { day: "2026-10-05" };

test("answering the same question five times moves the balance once", () => {
  const s = emptyState();
  const qid = python.questions[0].id;
  const balances = [balanceOf(s)];
  for (let i = 0; i < 5; i++) {
    applyAnswer(s, "python", qid, true, 5, DAY);
    balances.push(balanceOf(s));
  }
  const moves = balances.slice(1).filter((b, i) => b !== balances[i]).length;
  assert.equal(moves, 1, `balance history ${balances.join(" → ")}`);
  // 5 for the question + 5 for the first activity of the day.
  assert.equal(balances.at(-1), PAY.question + PAY.day);
});

test("a wrong answer then a right one pays once; right then wrong takes nothing back", () => {
  const s = emptyState();
  const qid = python.questions[1].id;
  applyAnswer(s, "python", qid, false, 5, DAY);
  assert.equal(balanceOf(s), PAY.day);
  applyAnswer(s, "python", qid, true, 5, DAY);
  applyAnswer(s, "python", qid, false, 5, DAY);
  applyAnswer(s, "python", qid, true, 5, DAY);
  assert.equal(balanceOf(s), PAY.day + PAY.question);
});

test("the first activity of a day pays once per day", () => {
  const s = emptyState();
  applyAnswer(s, "python", python.questions[0].id, false, 5, { day: "2026-10-05" });
  applyAnswer(s, "python", python.questions[0].id, false, 5, { day: "2026-10-05" });
  assert.equal(balanceOf(s), PAY.day);
  applyAnswer(s, "python", python.questions[0].id, false, 5, { day: "2026-10-06" });
  assert.equal(balanceOf(s), 2 * PAY.day);
});

test("a game pays once for being solved, however often it's replayed", () => {
  const s = emptyState();
  const gid = java.games.find((g) => g.kind !== "blitz").id;
  applyAnswer(s, "java", gid, false, 10, DAY); // finished with "Show me", say
  assert.equal(balanceOf(s), PAY.day, "a puzzle the student didn't solve pays nothing");
  applyAnswer(s, "java", gid, true, 10, DAY);
  const after = balanceOf(s);
  assert.equal(after, PAY.game + PAY.day);
  for (let i = 0; i < 4; i++) applyAnswer(s, "java", gid, i % 2 === 0, 10, DAY);
  assert.equal(balanceOf(s), after);
});

test("a blitz round pays for being played to the end, whatever the score", () => {
  const s = emptyState();
  const gid = java.games.find((g) => g.kind === "blitz").id;
  applyAnswer(s, "java", gid, false, 10, DAY);
  assert.equal(balanceOf(s), PAY.game + PAY.day);
});

test("a lesson can't be completed until its questions are solved", () => {
  const s = emptyState();
  const lesson = python.topics[0].lessons[0];
  assert.equal(applyCompleteLesson(s, "python", lesson.id, 10, DAY).unsolved, true);
  assert.equal(balanceOf(s), 0, "clicking Finish pays nothing");
  for (const id of lesson.questions) applyAnswer(s, "python", id, true, 5, DAY);
  assert.equal(applyCompleteLesson(s, "python", lesson.id, 10, DAY).first, true);
});

test("lessons, topics and courses each pay once", () => {
  const solveAll = (s, lessons) => {
    for (const l of lessons) for (const id of l.questions) applyAnswer(s, "python", id, true, 5, DAY);
  };
  const qs = (lessons) => lessons.reduce((n, l) => n + l.questions.length, 0) * PAY.question;
  const s = emptyState();
  const t1 = python.topics[0];
  solveAll(s, t1.lessons);
  for (const l of t1.lessons) applyCompleteLesson(s, "python", l.id, 10, DAY);
  assert.equal(balanceOf(s), qs(t1.lessons) + 3 * PAY.lesson + PAY.topic + PAY.day);
  for (const l of t1.lessons) applyCompleteLesson(s, "python", l.id, 10, DAY);
  assert.equal(balanceOf(s), qs(t1.lessons) + 3 * PAY.lesson + PAY.topic + PAY.day);

  const full = emptyState();
  const all = allLessons(python);
  solveAll(full, all);
  for (const l of all) applyCompleteLesson(full, "python", l.id, 10, DAY);
  assert.equal(balanceOf(full), qs(all) + 18 * PAY.lesson + 6 * PAY.topic + PAY.course + PAY.day);
});

test("can't buy what you can't afford, and buying twice charges once", () => {
  const s = emptyState();
  assert.equal(applyBuy(s, "hat-cap").ok, false);
  assert.equal(balanceOf(s), 0);

  doneCourse(s, python);
  const before = balanceOf(s);
  assert.equal(applyBuy(s, "hat-cap").ok, true);
  assert.equal(applyBuy(s, "hat-cap").ok, false);
  assert.equal(balanceOf(s), before - 60);
});

test("locked items unlock with progress, not with Sparks", () => {
  const s = emptyState();
  doneCourse(s, java); // plenty of Sparks, but no Python
  assert.ok(balanceOf(s) >= 400);
  assert.equal(applyBuy(s, "hat-astronaut").reason, "locked");
  doneCourse(s, python);
  assert.equal(applyBuy(s, "hat-astronaut").ok, true);
});

test("equip swaps within a slot and needs the item to be owned", () => {
  const s = emptyState();
  doneCourse(s, python);
  assert.equal(applyEquip(s, "hat-cap").ok, false);
  applyBuy(s, "hat-cap");
  applyBuy(s, "hat-beanie");
  applyEquip(s, "hat-cap");
  assert.ok(isEquipped(s, "hat-cap"));
  applyEquip(s, "hat-beanie");
  assert.ok(isEquipped(s, "hat-beanie") && !isEquipped(s, "hat-cap"));
  applyEquip(s, "hat-beanie");
  assert.equal(s.game.equipped.hat, null);
});

test("a hand-edited Sparks snapshot changes nothing", () => {
  const s = emptyState();
  doneCourse(s, python);
  const real = earnedOf(s);
  s.game = { ...(s.game || {}), sparks: { earned: 999999, spent: 0, balance: 999999 } };
  assert.equal(earnedOf(s), real);
  assert.equal(applyBuy(s, "town-clock").ok, false); // locked, and unaffordable anyway
});
