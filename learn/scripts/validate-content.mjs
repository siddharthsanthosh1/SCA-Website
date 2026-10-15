/* Content sanity check. Run with: npm run check:content
   Catches the mistakes that are invisible until a student hits them. */

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { courses, allLessons } from "../src/data/courses.js";
import { runChecks } from "../src/lib/checks.js";
import { SHAPE_TAGS } from "../src/data/art.js";
import { shopItems, SLOTS, DEFAULT_EQUIPPED } from "../src/data/shop.js";
import { badges, earnedBadgeIds } from "../src/data/badges.js";
import { buildings, TOWN_SPOTS, SCENE } from "../src/data/byteville.js";
import { pipLines } from "../src/data/pip-lines.js";
import { emptyState, fullState } from "./lib/synthetic.mjs";

let errors = 0;
let warnings = 0;
const fail = (m) => { console.error("  ✗ " + m); errors++; };
const warn = (m) => { console.warn("  ! " + m); warnings++; };

const ID_PREFIX = { python: "py-", javascript: "web-", java: "java-", cpp: "cpp-", scratch: "scr-" };
const GAME_PREFIX = { python: "py-g-", javascript: "web-g-", java: "java-g-", cpp: "cpp-g-", scratch: "scratch-g-" };
const PANES = ["html", "css", "js"];
const SCRATCH_CATS = ["motion", "looks", "sound", "events", "control", "sensing", "operators", "variables", "pen", "myblocks"];
const BLOCK_TYPES = ["p", "list", "code", "callout", "scratch"];
const DOM_ASSERTIONS = ["exists", "count", "text", "attr", "style", "layout"];
// Words that mean a draft was never finished.
// Case-sensitive on purpose: a to-do list example is fine, a "TODO" isn't.
const PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX)\b|[Ll]orem ipsum/;

/* ---------- dom check engine self-test ----------
   Node has no DOMParser, so this runs the real runChecks() against a tiny fake
   document. It proves the pass/fail logic and that every failure message is a
   sentence a student can act on, not "assertion failed". */
function fakeDoc(tree) {
  const els = tree.map(([sel, text, attrs = {}]) => ({ sel, textContent: text, getAttribute: (k) => (k in attrs ? attrs[k] : null) }));
  return { querySelectorAll: (s) => els.filter((e) => e.sel === s) };
}
function selfTest() {
  const doc = fakeDoc([["h1", " My Site "], ["ul li", "a"], ["ul li", "b"], ["img", "", { alt: "A cat" }], ["img", "", {}]]);
  const cases = [
    [{ type: "dom", selector: "h1", exists: true }, true],
    [{ type: "dom", selector: "h2", exists: true }, false, /needs an `<h2>` heading/],
    [{ type: "dom", selector: "h1", text: "my site" }, true],
    [{ type: "dom", selector: "h1", text: "Home" }, false, /should say "Home"/],
    [{ type: "dom", selector: "ul li", count: 2 }, true],
    [{ type: "dom", selector: "ul li", count: 3 }, false, /should have 3 .* It has 2/],
    [{ type: "dom", selector: "img", attr: "alt", present: true }, false, /Every `<img>` image on your page needs an `alt` attribute/],
    [{ type: "dom", selector: "marquee", exists: false }, true],
    [{ type: "dom", selector: ".card", style: "display", equals: "flex" }, false, /didn't answer/],
  ];
  for (const [check, shouldPass, msg] of cases) {
    const r = runChecks([check], { source: "", output: "", doc, live: new Map() });
    if (r.pass !== shouldPass) fail(`dom self-test: ${JSON.stringify(check)} should ${shouldPass ? "pass" : "fail"}`);
    if (!shouldPass && msg && !msg.test(r.message || "")) fail(`dom self-test: unexpected message "${r.message}"`);
  }
  // Computed-style checks read the probe the web runner collects from the frame.
  const style = { type: "dom", selector: ".card", style: "display", equals: "flex" };
  const ok = runChecks([style], { doc, live: new Map([[style, { count: 1, actual: "flex", matches: true }]]) });
  const no = runChecks([style], { doc, live: new Map([[style, { count: 1, actual: "block", matches: false }]]) });
  if (!ok.pass || no.pass || !/Right now it's `block`/.test(no.message)) fail("dom self-test: style probe handling is wrong");
  // Layout checks read where the elements ended up, at a given screen width.
  const col = { type: "dom", selector: ".card", layout: "column", viewport: 400 };
  const stacked = runChecks([col], { doc, live: new Map([[col, { count: 3, arrangement: "column" }]]) });
  const sideBy = runChecks([col], { doc, live: new Map([[col, { count: 3, arrangement: "row" }]]) });
  if (!stacked.pass || sideBy.pass || !/On a screen 400px wide, .* stacked in a column\. Right now they're side by side/.test(sideBy.message))
    fail(`dom self-test: layout probe handling is wrong (${sideBy.message})`);
  // minWords counts words in an attribute, however it was quoted.
  const words = { type: "dom", selector: "img", attr: "alt", minWords: 2 };
  const altDoc = (a, b) => fakeDoc([["img", "", { alt: a }], ["img", "", { alt: b }]]);
  if (!runChecks([words], { doc: altDoc("A cat", "Two dogs") }).pass) fail("dom self-test: minWords rejects a good alt");
  if (runChecks([words], { doc: altDoc("A cat", "photo") }).pass) fail("dom self-test: minWords accepts a one-word alt");
  // The old check types still behave exactly as before.
  if (!runChecks([{ type: "stdout", equals: "hi" }], { source: "", output: "hi\n" }).pass) fail("stdout self-test broke");
  if (runChecks([{ type: "source", contains: "for" }], { source: "while", output: "" }).pass) fail("source self-test broke");
}
console.log("Check engine self-test");
selfTest();

/* ---------- helpers ---------- */

const textOf = (x) => JSON.stringify(x);
function scanText(where, value) {
  const s = textOf(value);
  if (PLACEHOLDER.test(s)) fail(`${where}: looks like placeholder text survived (${s.match(PLACEHOLDER)[0]})`);
  for (const m of s.matchAll(/\{\{(\w+):/g))
    if (!SCRATCH_CATS.includes(m[1])) fail(`${where}: unknown Scratch block category "${m[1]}"`);
}

function checkDomCheck(qid, c) {
  if (typeof c.selector !== "string" || !c.selector.trim()) return fail(`${qid}: dom check has no selector`);
  const asserts = DOM_ASSERTIONS.filter((k) => c[k] !== undefined);
  if (asserts.length !== 1) return fail(`${qid}: dom check on "${c.selector}" needs exactly one of ${DOM_ASSERTIONS.join(", ")}`);
  if (c.attr !== undefined && c.present === undefined && c.equals === undefined && c.minWords === undefined)
    fail(`${qid}: dom attr check on "${c.selector}" needs present, equals or minWords`);
  if (c.style !== undefined && c.equals === undefined) fail(`${qid}: dom style check on "${c.selector}" needs equals`);
  if (c.count !== undefined && !Number.isInteger(c.count)) fail(`${qid}: dom count must be a whole number`);
  if (c.layout !== undefined && !["column", "row"].includes(c.layout)) fail(`${qid}: dom layout must be "column" or "row"`);
  if (c.viewport !== undefined && (!Number.isInteger(c.viewport) || c.viewport < 200 || c.viewport > 2000))
    fail(`${qid}: dom viewport must be a width in px between 200 and 2000`);
  if (c.viewport !== undefined && c.style === undefined && c.layout === undefined)
    fail(`${qid}: dom viewport only applies to style and layout checks`);
  if (c.minWords !== undefined && (c.attr === undefined || !Number.isInteger(c.minWords)))
    fail(`${qid}: dom minWords needs attr and a whole number`);
}

function checkWebCodeQuestion(q) {
  const panes = q.panes;
  if (!Array.isArray(panes) || !panes.length || panes.some((p) => !PANES.includes(p)))
    return fail(`${q.id}: web question needs panes drawn from ${PANES.join(", ")}`);
  const jsOnly = panes.length === 1 && panes[0] === "js";
  if (jsOnly) {
    if (typeof q.solution !== "string") fail(`${q.id}: a js-only question's solution should be a string`);
    if (q.checks.some((c) => c.type === "dom")) fail(`${q.id}: a js-only question has no page, so it can't use dom checks`);
  } else {
    for (const field of ["starter", "solution"]) {
      const v = q[field];
      if (!v || typeof v !== "object") { fail(`${q.id}: ${field} should be an object keyed by pane`); continue; }
      for (const k of Object.keys(v)) if (!panes.includes(k)) fail(`${q.id}: ${field} has a "${k}" pane the question doesn't show`);
    }
    if (!q.checks.some((c) => c.type === "dom")) warn(`${q.id}: page question with no dom checks`);
  }
  for (const a of q.actions || []) {
    if (!["click", "input", "submit"].includes(a.do) || !a.selector) fail(`${q.id}: action needs do (click|input|submit) and selector`);
  }
}

function checkGame(g, lessons) {
  const where = g.id;
  if (!g.title) fail(`${where}: no title`);
  if (g.kind !== "blitz" && !g.explain) fail(`${where}: no explain`);
  for (const line of Array.isArray(g.code) ? g.code : [])
    if (typeof line !== "string" && !(line?.text && SCRATCH_CATS.includes(line.cat))) fail(`${where}: a code line must be a string or { text, cat }`);
  switch (g.kind) {
    case "sort":
      if (!Array.isArray(g.lines) || g.lines.length < 3) fail(`${where}: sort needs at least 3 lines`);
      for (const l of g.lines || []) {
        if (!l.text) fail(`${where}: sort line with no text`);
        if (l.cat && !SCRATCH_CATS.includes(l.cat)) fail(`${where}: unknown Scratch category ${l.cat}`);
      }
      if (g.lines && new Set(g.lines.map((l) => `${l.indent || 0}|${l.text}`)).size < 3)
        fail(`${where}: sort needs at least 3 distinct lines or there's nothing to order`);
      break;
    case "bug": {
      const n = g.code?.length || 0;
      if (n < 2) fail(`${where}: bug needs at least 2 lines of code`);
      if (!Number.isInteger(g.buggyLine) || g.buggyLine < 0 || g.buggyLine >= n) fail(`${where}: buggyLine ${g.buggyLine} out of range`);
      for (let i = 0; i < n; i++) {
        if (i === g.buggyLine) continue;
        if (!g.wrongLineHints?.[i]) fail(`${where}: no wrongLineHints entry for line ${i}`);
      }
      if (g.wrongLineHints?.[g.buggyLine]) fail(`${where}: the buggy line shouldn't have a wrong-line hint`);
      break;
    }
    case "trace": {
      const n = g.code?.length || 0;
      if (!g.steps?.length) fail(`${where}: trace has no steps`);
      for (const [i, s] of (g.steps || []).entries()) {
        if (!Number.isInteger(s.line) || s.line < 0 || s.line >= n) fail(`${where}: step ${i} points at line ${s.line}, which doesn't exist`);
        if (s.ask && (!s.ask.prompt || !Array.isArray(s.ask.accept) || !s.ask.accept.length))
          fail(`${where}: step ${i} asks a question with no prompt or accepted answers`);
        if (s.state && typeof s.state !== "object") fail(`${where}: step ${i} state must be an object`);
      }
      if (!(g.steps || []).some((s) => s.ask)) fail(`${where}: trace never asks the student anything`);
      break;
    }
    case "cloze": {
      const gaps = (String(g.code).match(/___/g) || []).length;
      if (!gaps) fail(`${where}: cloze has no ___ gaps`);
      if (g.blanks?.length !== gaps) fail(`${where}: ${gaps} gaps but ${g.blanks?.length} blanks`);
      const pool = [...(g.tray || [])];
      for (const b of g.blanks || []) {
        const k = pool.indexOf(b);
        if (k < 0) fail(`${where}: tray is missing "${b}" (or doesn't have enough copies of it)`);
        else pool.splice(k, 1);
      }
      if (!pool.length) fail(`${where}: tray has no distractors — every token fits exactly one gap`);
      break;
    }
    case "blitz":
      if (!Array.isArray(g.items) || g.items.length < 12) fail(`${where}: blitz needs at least 12 items (has ${g.items?.length || 0})`);
      for (const [i, it] of (g.items || []).entries()) {
        if (typeof it.answer !== "boolean") fail(`${where}: item ${i} answer must be true or false`);
        if (!it.prompt || !it.explain) fail(`${where}: item ${i} needs a prompt and an explain`);
      }
      if (g.items && new Set(g.items.map((it) => it.prompt)).size !== g.items.length) fail(`${where}: duplicate blitz prompts`);
      break;
    default:
      fail(`${where}: unknown game kind "${g.kind}"`);
  }
  if (!g.lesson || !lessons.some((l) => l.id === g.lesson)) fail(`${where}: points at unknown lesson ${g.lesson}`);
  scanText(where, g);
}

/* ---------- per course ---------- */

for (const course of courses) {
  if (course.status !== "live") continue;
  console.log(`\n${course.title} (${course.id})`);

  const lessons = allLessons(course);
  const prefix = ID_PREFIX[course.id];
  const qById = new Map();
  for (const q of course.questions) {
    if (qById.has(q.id)) fail(`duplicate question id: ${q.id}`);
    if (prefix && !q.id.startsWith(prefix)) fail(`${q.id}: question ids in this course start with "${prefix}"`);
    qById.set(q.id, q);
  }
  const gById = new Map();
  for (const g of course.games || []) {
    if (gById.has(g.id) || qById.has(g.id)) fail(`duplicate game id: ${g.id}`);
    if (GAME_PREFIX[course.id] && !g.id.startsWith(GAME_PREFIX[course.id]))
      fail(`${g.id}: game ids in this course start with "${GAME_PREFIX[course.id]}"`);
    gById.set(g.id, g);
  }

  const lessonIds = new Set();
  const referenced = new Set();
  const gamesReferenced = new Map();
  for (const l of lessons) {
    if (lessonIds.has(l.id)) fail(`duplicate lesson id ${l.id}`);
    lessonIds.add(l.id);
    if (!l.blocks?.length) fail(`lesson ${l.id} has no content blocks`);
    else if (l.blocks.length < 4 || l.blocks.length > 8) warn(`lesson ${l.id} has ${l.blocks.length} blocks — aim for 4 to 8`);
    if (!l.title || !l.blurb || !l.minutes) fail(`lesson ${l.id} needs a title, blurb and minutes`);
    for (const b of l.blocks || []) {
      if (!BLOCK_TYPES.includes(b.t)) fail(`lesson ${l.id} has an unknown block type "${b.t}"`);
      if (b.t === "scratch")
        for (const sb of b.blocks || []) if (!SCRATCH_CATS.includes(sb.cat)) fail(`lesson ${l.id}: unknown Scratch category ${sb.cat}`);
    }
    scanText(`lesson ${l.id}`, l);
    if (!l.questions?.length) warn(`lesson ${l.id} has no questions`);
    for (const qid of l.questions || []) {
      if (!qById.has(qid)) fail(`lesson ${l.id} references missing question ${qid}`);
      if (referenced.has(qid)) fail(`question ${qid} is used by more than one lesson`);
      if (qById.get(qid)?.lesson && qById.get(qid).lesson !== l.id) fail(`question ${qid} is tagged ${qById.get(qid).lesson} but shown in ${l.id}`);
      referenced.add(qid);
    }
    for (const gid of l.games || []) {
      if (!gById.has(gid)) fail(`lesson ${l.id} references missing game ${gid}`);
      if (gamesReferenced.has(gid)) fail(`game ${gid} is used by lessons ${gamesReferenced.get(gid)} and ${l.id}`);
      if (gById.get(gid)?.lesson && gById.get(gid).lesson !== l.id) fail(`game ${gid} is tagged ${gById.get(gid).lesson} but shown in ${l.id}`);
      gamesReferenced.set(gid, l.id);
    }
  }

  for (const q of course.questions) {
    if (!referenced.has(q.id)) warn(`question ${q.id} is never shown in a lesson`);
    if (!q.lesson) fail(`question ${q.id} has no lesson tag`);
    if (q.lesson && !lessons.some((l) => l.id === q.lesson))
      fail(`question ${q.id} points at unknown lesson ${q.lesson}`);
    scanText(q.id, q);

    for (const sb of q.script || []) if (!SCRATCH_CATS.includes(sb.cat)) fail(`${q.id}: unknown Scratch category ${sb.cat}`);

    if (q.kind === "mcq") {
      if (!Array.isArray(q.options) || q.options.length < 2) fail(`${q.id}: needs at least 2 options`);
      if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= (q.options?.length ?? 0))
        fail(`${q.id}: answer index ${q.answer} is out of range`);
      if (new Set(q.options).size !== q.options.length) fail(`${q.id}: has duplicate options`);
      if (!q.explain) warn(`${q.id}: no explanation`);
    } else if (q.kind === "fill") {
      if (!q.code?.includes("___")) fail(`${q.id}: fill question has no ___ blank`);
      if ((q.code.match(/___/g) || []).length > 1) fail(`${q.id}: fill questions can only have one blank`);
      if (!q.accept?.length) fail(`${q.id}: no accepted answers`);
    } else if (q.kind === "code") {
      if (course.runner === "quiz") fail(`${q.id}: a quiz course has nothing to run code questions with`);
      if (!q.checks?.length) fail(`${q.id}: no checks, so it can never be marked`);
      if (!q.solution) fail(`${q.id}: no reference solution`);
      if (!q.hint) warn(`${q.id}: no hint`);
      for (const c of q.checks || []) {
        if (!["stdout", "source", "dom"].includes(c.type)) fail(`${q.id}: unknown check type "${c.type}"`);
        if (c.type === "dom") checkDomCheck(q.id, c);
      }
      if (course.runner === "web") checkWebCodeQuestion(q);
      else if (q.checks?.some((c) => c.type === "dom")) fail(`${q.id}: dom checks only work in the web runner`);
    } else {
      fail(`${q.id}: unknown kind "${q.kind}"`);
    }
  }

  for (const g of course.games || []) {
    checkGame(g, lessons);
    if (!gamesReferenced.has(g.id)) fail(`game ${g.id} is never shown in a lesson`);
  }

  // Every lesson should have practice spread across it, not piled into a few.
  const perLesson = lessons.map((l) => (l.questions || []).length);
  const thin = lessons.filter((l, i) => perLesson[i] < 2).map((l) => l.id);
  if (thin.length && course.id !== "python") warn(`lessons with fewer than 2 questions: ${thin.join(", ")}`);

  const games = course.games || [];
  console.log(`  ${lessons.length} lessons, ${course.questions.length} questions, ${games.length} games`);
  const kinds = course.questions.reduce((a, q) => ((a[q.kind] = (a[q.kind] || 0) + 1), a), {});
  console.log(`  ${Object.entries(kinds).map(([k, v]) => `${v} ${k}`).join(", ")}`);
  if (games.length) {
    const gk = games.reduce((a, g) => ((a[g.kind] = (a[g.kind] || 0) + 1), a), {});
    console.log(`  games: ${Object.entries(gk).map(([k, v]) => `${v} ${k}`).join(", ")}`);
  }
  if (course.questions.length < 50) warn(`only ${course.questions.length} questions — target is 50+`);
}


/* ---------- the game layer ---------- */

// A shape list must be non-empty and made only of plain SVG shapes.
function checkShapes(where, list, depth = 0) {
  if (!Array.isArray(list) || (depth === 0 && !list.length)) return fail(`${where}: draws nothing`);
  for (const sh of list) {
    if (!Array.isArray(sh) || !SHAPE_TAGS.includes(sh[0]) || typeof sh[1] !== "object")
      return fail(`${where}: "${JSON.stringify(sh).slice(0, 60)}" isn't an SVG shape (${SHAPE_TAGS.join(", ")})`);
    if (/href|url\(|data:/i.test(JSON.stringify(sh[1]).replace(/url\(#[\w-]+\)/g, ""))) fail(`${where}: shapes may not load anything external`);
    if (Array.isArray(sh[2])) checkShapes(where, sh[2], depth + 1);
  }
}
const drawn = (where, fn, ...args) => {
  if (typeof fn !== "function") return fail(`${where}: has no draw function`);
  try { checkShapes(where, fn(...args)); } catch (e) { fail(`${where}: draw threw ${e.message}`); }
};

console.log("\nWorkshop");
{
  const slots = new Set(SLOTS.map((s) => s.id));
  const ids = new Set();
  for (const it of shopItems) {
    const where = `shop ${it.id}`;
    if (!it.id || ids.has(it.id)) fail(`${where}: missing or duplicate id`);
    ids.add(it.id);
    if (!slots.has(it.slot)) fail(`${where}: unknown slot "${it.slot}"`);
    if (!it.name) fail(`${where}: no name`);
    if (!Number.isInteger(it.price) || it.price < 0) fail(`${where}: price must be a whole number of Sparks, 0 or more`);
    drawn(where, it.draw, {});
    if (it.slot === "pack") { drawn(`${where} (back)`, () => [...it.draw({ layer: "back" }), ...it.draw({ layer: "front" })]); }
    if (it.slot === "eyes" && !it.overlay) drawn(`${where} (eye)`, it.draw, { cx: 49, cy: 50 });
    if (it.smallVariant !== undefined) {
      drawn(`${where} (small)`, it.smallVariant, {});
      if (it.slot === "pack") drawn(`${where} (small, back)`, () => [...it.smallVariant({ layer: "back" }), ...it.smallVariant({ layer: "front" })]);
      if (it.slot === "eyes" && !it.overlay) drawn(`${where} (small eye)`, it.smallVariant, { cx: 49, cy: 50 });
    }
    if (it.slot === "body" && !(it.colors?.body && it.colors?.dark)) fail(`${where}: a body colour needs colors.body and colors.dark`);
    if (it.slot === "town") {
      if (!(it.w > 0 && it.h > 0)) fail(`${where}: town items need a w and h frame`);
      if (!TOWN_SPOTS[it.id]) fail(`${where}: no spot for it in Byteville (TOWN_SPOTS in data/byteville.js)`);
    }
    if (it.lock) {
      const c = courses.find((x) => x.id === it.lock.courseId);
      if (it.lock.anyCourses) { if (!(it.lock.anyCourses >= 1)) fail(`${where}: lock.anyCourses must be 1 or more`); }
      else if (!c) fail(`${where}: lock points at unknown course ${it.lock.courseId}`);
      else if (it.lock.topicId && !c.topics.some((t) => t.id === it.lock.topicId)) fail(`${where}: lock points at unknown topic ${it.lock.topicId}`);
    }
    scanText(where, { name: it.name });
  }
  for (const [slot, id] of Object.entries(DEFAULT_EQUIPPED)) {
    if (id && !Array.isArray(id) && shopItems.find((i) => i.id === id)?.price !== 0) fail(`default ${slot} "${id}" must exist and be free`);
  }
  if (shopItems.length < 30) fail(`only ${shopItems.length} shop items — need at least 30`);
  const locked = shopItems.filter((i) => i.lock).length;
  if (locked < 3 || locked > 4) warn(`${locked} locked items — aim for 3 or 4`);
  console.log(`  ${shopItems.length} items, ${locked} unlocked by progress`);
}

console.log("\nBadges");
{
  const ids = new Set();
  for (const b of badges) {
    if (!b.id || ids.has(b.id)) fail(`badge ${b.id}: missing or duplicate id`);
    ids.add(b.id);
    if (!b.name || !b.how) fail(`badge ${b.id}: needs a name and a "how to earn" line`);
    if (typeof b.earn !== "function") fail(`badge ${b.id}: no earn rule`);
    drawn(`badge ${b.id}`, b.draw);
  }
  if (badges.length < 12) fail(`only ${badges.length} badges — need at least 12`);
  const atStart = earnedBadgeIds(emptyState());
  if (atStart.length) fail(`badges earned by a brand-new student: ${atStart.join(", ")}`);
  const atEnd = new Set(earnedBadgeIds(fullState()));
  const never = badges.filter((b) => !atEnd.has(b.id)).map((b) => b.id);
  if (never.length) fail(`badges no one can earn, even finishing everything: ${never.join(", ")}`);
  console.log(`  ${badges.length} badges, all earnable`);
}

console.log("\nByteville");
{
  const seen = new Map();
  for (const b of buildings) {
    const where = `building ${b.name}`;
    const c = courses.find((x) => x.id === b.courseId);
    if (!c) { fail(`${where}: unknown course ${b.courseId}`); continue; }
    if (!c.topics.some((t) => t.id === b.topicId)) fail(`${where}: ${b.courseId} has no topic ${b.topicId}`);
    const k = `${b.courseId}/${b.topicId}`;
    if (seen.has(k)) fail(`${where}: shares ${k} with ${seen.get(k)}`);
    seen.set(k, b.name);
    if (!(b.x >= 0 && b.x + 64 <= SCENE.w && b.y > 0 && b.y <= SCENE.h)) fail(`${where}: placed outside the scene`);
    drawn(where, b.draw, { lit: false });
    drawn(`${where} (lit)`, b.draw, { lit: true });
  }
  for (const c of courses.filter((x) => x.status === "live"))
    for (const t of c.topics) if (!seen.has(`${c.id}/${t.id}`)) fail(`no building for ${c.id} topic ${t.id} (${t.title})`);
  console.log(`  ${buildings.length} buildings for ${seen.size} topics`);
}

console.log("\nPip");
{
  for (const [situation, lines] of Object.entries(pipLines)) {
    if (lines.length < 8) fail(`Pip has only ${lines.length} lines for "${situation}" — needs 8`);
    for (const l of lines) {
      const words = l.trim().split(/\s+/).length;
      if (words >= 12) fail(`Pip line too long (${words} words): "${l}"`);
      if (/!{2,}|AMAZING|SUPERSTAR|wrong!/i.test(l)) fail(`Pip line breaks the voice rules: "${l}"`);
    }
  }
  console.log(`  ${Object.keys(pipLines).length} situations, ${Object.values(pipLines).flat().length} lines`);
}

console.log("\nNo image files");
{
  // Every visual is drawn in code. No bitmaps, no icon fonts, no CDN art.
  const RASTER = /\.(png|jpe?g|gif|webp|avif|bmp|ico|tiff?|woff2?|ttf|otf|eot)$/i;
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const root = new URL("..", import.meta.url).pathname;
  const files = [...walk(join(root, "src")), ...walk(join(root, "public"))];
  for (const f of files) if (RASTER.test(f)) fail(`image or font file not allowed: ${f.slice(root.length)}`);
  console.log(`  ${files.length} files checked`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
