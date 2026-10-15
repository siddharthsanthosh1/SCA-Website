/* ---------------------------------------------------------------------------
   Badges — for things worth earning.

   Every badge is worked out from recorded progress (never stored as a flag),
   so a badge can't be earned by accident or lost by a sync hiccup. None are
   for buying things or for logging in; none compare one student to another.

   Badge shape:
     { id, name, how, earn(facts) → boolean, draw() → shapes }
   `facts` comes from badgeFacts() below. `how` is the plain-words rule shown
   under a badge the student hasn't earned yet.

   npm run check:content checks ids are unique, every badge has a rule and a
   drawing, nothing is earned on an empty account, and everything is earned
   when every course is finished.
   --------------------------------------------------------------------------- */

import { courses as ALL_COURSES } from "./courses.js";
import { isTopicDone, isCourseDone } from "../lib/sparks.js";
import { INK, circle, path, text, ocircle, opath, orect, line, rect, starPath } from "./art.js";

export const GAME_KINDS = ["sort", "bug", "trace", "cloze", "blitz"];

export function badgeFacts(state, list = ALL_COURSES) {
  const f = { right: 0, codeRight: 0, bugsFound: 0, kinds: new Set(), lessons: 0, topics: 0, flawlessTopic: false, courses: new Set(), days: 0 };
  for (const course of list) {
    if (course.status !== "live") continue;
    const c = state?.courses?.[course.id] || {};
    const answers = c.answers || {};
    const byId = new Map(course.questions.map((q) => [q.id, q]));
    for (const q of course.questions) {
      if (!answers[q.id]?.correct) continue;
      f.right += 1;
      if (q.kind === "code") f.codeRight += 1;
    }
    for (const gm of course.games || []) {
      if (!answers[gm.id]) continue;
      f.kinds.add(gm.kind);
      if (gm.kind === "bug" && answers[gm.id].correct) f.bugsFound += 1;
    }
    for (const t of course.topics) {
      f.lessons += t.lessons.filter((l) => c.completedLessons?.[l.id]).length;
      if (!isTopicDone(state, course, t)) continue;
      f.topics += 1;
      // Every question in the topic right on the first try.
      const qs = t.lessons.flatMap((l) => l.questions || []).filter((id) => byId.has(id));
      if (qs.length && qs.every((id) => answers[id]?.correct && answers[id].attempts === 1)) f.flawlessTopic = true;
    }
    if (isCourseDone(state, course)) f.courses.add(course.id);
  }
  f.days = Object.keys(state?.game?.days || {}).length;
  return f;
}

/* A round medal on two ribbons, with a picture in the middle. */
const medal = (colour, inner) => [
  opath("M26 52 L18 86 L28 80 L34 90 L40 58 Z", colour, 1.8),
  opath("M54 52 L62 86 L52 80 L46 90 L40 58 Z", colour, 1.8),
  ocircle(40, 38, 29, colour, 2.4),
  circle(40, 38, 22, "#ffffff", { opacity: 0.92 }),
  ...inner,
];
const glyph = (value, size = 15, fill = INK) => text(40, 38 + size * 0.36, value, { fontSize: size, fill });

const courseBadge = (id, name, colour, mark, size) => ({
  id: `course-${id}`, name, how: `Finish every lesson in ${ALL_COURSES.find((c) => c.id === id)?.title || id}.`,
  earn: (f) => f.courses.has(id),
  draw: () => medal(colour, [glyph(mark, size)]),
});

export const badges = [
  {
    id: "first-steps", name: "First Steps", how: "Finish your first lesson.",
    earn: (f) => f.lessons >= 1,
    draw: () => medal("var(--joy-sky)", [
      path("M31 44 q-5 -3 -3 -11 q3 -6 7 0 q2 6 -1 11 Z", INK), circle(31, 49, 2.6, INK),
      path("M49 36 q5 -3 3 -11 q-3 -6 -7 0 q-2 6 1 11 Z", INK), circle(49, 41, 2.6, INK),
    ]),
  },
  {
    id: "first-program", name: "It Runs!", how: "Write your first program that works.",
    earn: (f) => f.codeRight >= 1,
    draw: () => medal("var(--joy-mint)", [orect(25, 27, 30, 22, "#22324a", 3, 1.6), path("M30 34 L35 38 L30 42", "none", { stroke: "#8ae57c", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }), line(37, 43, 45, 43, "#8ae57c", 2)]),
  },
  {
    id: "ten-right", name: "Ten Right", how: "Answer 10 questions correctly.",
    earn: (f) => f.right >= 10,
    draw: () => medal("var(--joy-sun)", [glyph("10", 17)]),
  },
  {
    id: "fifty-right", name: "Fifty Right", how: "Answer 50 questions correctly.",
    earn: (f) => f.right >= 50,
    draw: () => medal("var(--joy-coral)", [glyph("50", 17)]),
  },
  {
    id: "clean-sweep", name: "Clean Sweep", how: "Finish a topic with every question right first time.",
    earn: (f) => f.flawlessTopic,
    draw: () => medal("var(--joy-grape)", [path("M28 39 L36 47 L53 29", "none", { stroke: "var(--joy-grape)", strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" })]),
  },
  {
    id: "builder", name: "Builder", how: "Finish a whole topic and put up your first building.",
    earn: (f) => f.topics >= 1,
    draw: () => medal("var(--joy-sky)", [opath("M27 37 L40 26 L53 37 Z", "var(--joy-coral)", 1.6), orect(30, 37, 20, 14, "#fff4e0", 1, 1.6), rect(37, 42, 6, 9, "#a8743f")]),
  },
  {
    id: "game-explorer", name: "Game Explorer", how: "Play all five kinds of game: sort, bug, trace, gaps and blitz.",
    earn: (f) => GAME_KINDS.every((k) => f.kinds.has(k)),
    draw: () => medal("var(--joy-mint)", [orect(24, 30, 32, 17, "#5b6573", 8.5, 1.6), path("M31 35 V43 M27 39 H35", "none", { stroke: "#fff", strokeWidth: 2.2, strokeLinecap: "round" }), circle(46, 36, 2.2, "var(--joy-coral)"), circle(50, 41, 2.2, "var(--joy-sun)")]),
  },
  {
    id: "bug-hunter", name: "Bug Hunter", how: "Find the bug in 5 different programs.",
    earn: (f) => f.bugsFound >= 5,
    draw: () => medal("var(--joy-coral)", [
      path("M30 30 L26 26 M50 30 L54 26 M29 38 H23 M51 38 H57 M30 45 L25 49 M50 45 L55 49", "none", { stroke: INK, strokeWidth: 2, strokeLinecap: "round" }),
      ["ellipse", { cx: 40, cy: 39, rx: 10, ry: 12, fill: "var(--joy-coral)", stroke: INK, strokeWidth: 2 }],
      line(40, 28, 40, 51, INK, 1.6), ocircle(40, 27, 5, INK, 1),
    ]),
  },
  {
    id: "five-days", name: "Five Days", how: "Learn on five different days. Any five — they don't need to be in a row.",
    earn: (f) => f.days >= 5,
    draw: () => medal("var(--joy-sun)", [orect(27, 27, 26, 23, "#ffffff", 3, 1.8), rect(27, 27, 26, 7, "var(--joy-coral)", { stroke: INK, strokeWidth: 1.8 }), text(40, 47.5, "5", { fontSize: 13, fill: INK })]),
  },
  {
    id: "star-learner", name: "Star Learner", how: "Finish 50 lessons across any courses.",
    earn: (f) => f.lessons >= 50,
    draw: () => medal("var(--joy-grape)", [path(starPath(40, 38, 15, 6.5), "var(--joy-sun)", { stroke: INK, strokeWidth: 1.8, strokeLinejoin: "round" })]),
  },
  courseBadge("python", "Pythonista", "var(--joy-sky)", "Py", 16),
  courseBadge("javascript", "Web Builder", "var(--joy-coral)", "</>", 14),
  courseBadge("java", "Java Graduate", "var(--joy-grape)", "Java", 12),
  courseBadge("cpp", "C++ Graduate", "var(--joy-mint)", "C++", 14),
  courseBadge("scratch", "Scratch Star", "var(--joy-sun)", "Go!", 13),
];

export function earnedBadgeIds(state, list) {
  const f = badgeFacts(state, list);
  return badges.filter((b) => b.earn(f)).map((b) => b.id);
}
