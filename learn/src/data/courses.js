/* ---------------------------------------------------------------------------
   Course registry.

   Python is complete. The other four are the languages Student Code Alliance
   already teaches; they are listed as coming soon so the shape of the platform
   is visible. To add one, create data/<lang>-lessons.js and
   data/<lang>-questions.js in the same shape as the Python files, import them
   below, and change `status` to "live".

   `runner` decides how practice works:
     "python" — real code, executed in the browser by Pyodide
     "js"     — real code, executed in a sandboxed Web Worker
     "web"    — HTML/CSS/JS rendered in a sandboxed iframe with a live preview
                and graded with `dom` checks; a question with `panes: ["js"]`
                is a console exercise and runs through the "js" worker instead
     "quiz"   — multiple choice, predict-the-output and fill-in-the-blank only

   `older: true` marks the high-school courses. Pip stays out of their
   questions and only turns up for lesson-complete and course-complete — a
   cartoon robot cheering a sixteen-year-old through pointers is insulting.

   Every course can also have `games` (data/<lang>-games.js), attached to a
   lesson by id the same way questions are. Games need no code execution,
   which is what gives the quiz courses their hands-on practice.

   Why Java, C++ and Scratch are "quiz" — a decision, not an oversight:
   there is no free, fast way to compile and run Java or C++ in a browser.
     - CheerpJ (a JVM in WebAssembly) handles Java 8/11/17, but it's a
       commercial product and the runtime is large.
     - In-browser clang toolchains exist but ship 20 MB+ of WebAssembly to
       every student.
     - Hosted execution APIs (Judge0, Piston) work, but mean a paid plan or
       leaning on someone else's rate-limited free instance — fragile for a
       nonprofit serving whole classrooms at once.
   Scratch is drag-and-drop blocks, so typed code doesn't apply at all.
   Those courses get their depth from trace, bug and sort games instead.

   Upgrade path if live Java/C++ is ever funded: add `runner: "api"`, a
   lib/runApi.js that posts source to a hosted executor (Judge0 or a
   self-hosted Piston) and returns { ok, output, error } like runPython does,
   and route "api" to it in components/Question.jsx. The `stdout` and
   `source` checks then work unchanged.
   --------------------------------------------------------------------------- */

import { pythonTopics } from "./python-lessons.js";
import { pythonQuestions } from "./python-questions.js";
import { javascriptTopics } from "./javascript-lessons.js";
import { javascriptQuestions } from "./javascript-questions.js";
import { javascriptGames } from "./javascript-games.js";
import { javaTopics } from "./java-lessons.js";
import { javaQuestions } from "./java-questions.js";
import { javaGames } from "./java-games.js";
import { cppTopics } from "./cpp-lessons.js";
import { cppQuestions } from "./cpp-questions.js";
import { cppGames } from "./cpp-games.js";
import { scratchTopics } from "./scratch-lessons.js";
import { scratchQuestions } from "./scratch-questions.js";
import { scratchGames } from "./scratch-games.js";

export const courses = [
  {
    id: "python",
    title: "Intro to Python",
    subtitle: "Intro to Python for Kids",
    level: "Beginner",
    audience: "Ages 9–14",
    weeks: 10,
    status: "live",
    runner: "python",
    caseSensitive: true, // fill-in-the-blank answers must match capitals, as the language does
    accent: "blue",
    blurb:
      "Start from nothing and finish able to write a program that asks questions, makes decisions and repeats itself.",
    topics: pythonTopics,
    questions: pythonQuestions,
    games: [],
  },
  {
    id: "javascript",
    older: true,
    title: "Web Development",
    subtitle: "HTML, CSS and JavaScript",
    level: "Beginner",
    audience: "High school",
    weeks: 10,
    status: "live",
    runner: "web",
    accent: "amber",
    blurb:
      "Build a real website that runs in any browser, then make it do something with JavaScript.",
    topics: javascriptTopics,
    questions: javascriptQuestions,
    games: javascriptGames,
  },
  {
    id: "java",
    older: true,
    title: "Java",
    subtitle: "Pre-AP Computer Science",
    level: "Intermediate",
    audience: "High school",
    weeks: 10,
    status: "live",
    runner: "quiz",
    caseSensitive: true, // fill-in-the-blank answers must match capitals, as the language does
    accent: "blue",
    blurb:
      "Loops, arrays and recursion — the ground covered before AP Computer Science A.",
    topics: javaTopics,
    questions: javaQuestions,
    games: javaGames,
  },
  {
    id: "cpp",
    older: true,
    title: "C++",
    subtitle: "Object-oriented programming",
    level: "Intermediate",
    audience: "Middle & high school",
    weeks: 10,
    status: "live",
    runner: "quiz",
    caseSensitive: true, // fill-in-the-blank answers must match capitals, as the language does
    accent: "blue",
    blurb:
      "Memory, arrays and functions, taught through the lens of object-oriented design.",
    topics: cppTopics,
    questions: cppQuestions,
    games: cppGames,
  },
  {
    id: "scratch",
    title: "Scratch",
    subtitle: "Block-based coding",
    level: "Beginner",
    audience: "Ages 7–11",
    weeks: 10,
    status: "live",
    runner: "quiz",
    accent: "green",
    blurb:
      "Snap blocks together to tell a story, then build a game — no typing required.",
    topics: scratchTopics,
    questions: scratchQuestions,
    games: scratchGames,
  },
];

export const getCourse = (id) => courses.find((c) => c.id === id) || null;

export const allLessons = (course) =>
  (course?.topics || []).flatMap((t) => t.lessons.map((l) => ({ ...l, topicId: t.id, topicTitle: t.title })));

export const lessonCount = (course) => allLessons(course).length;

export function questionsFor(course, lessonId) {
  const lesson = allLessons(course).find((l) => l.id === lessonId);
  if (!lesson) return [];
  const byId = new Map(course.questions.map((q) => [q.id, q]));
  return lesson.questions.map((qid) => byId.get(qid)).filter(Boolean);
}

export function gamesFor(course, lessonId) {
  const lesson = allLessons(course).find((l) => l.id === lessonId);
  if (!lesson) return [];
  const byId = new Map((course.games || []).map((g) => [g.id, g]));
  return (lesson.games || []).map((gid) => byId.get(gid)).filter(Boolean);
}

export function adjacentLessons(course, lessonId) {
  const list = allLessons(course);
  const i = list.findIndex((l) => l.id === lessonId);
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
}

export function courseStats(course, progress) {
  const list = allLessons(course);
  const done = list.filter((l) => progress.isLessonDone(course.id, l.id)).length;
  const answered = course.questions.filter((q) => progress.answerOf(course.id, q.id)?.correct).length;
  return {
    lessons: list.length,
    lessonsDone: done,
    questions: course.questions.length,
    questionsRight: answered,
    percent: list.length ? Math.round((done / list.length) * 100) : 0,
    xp: progress.course(course.id).xp || 0,
  };
}
