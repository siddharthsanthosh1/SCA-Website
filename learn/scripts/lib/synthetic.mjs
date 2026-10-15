/* Made-up progress documents for the checks: a brand-new student, and one who
   has finished everything. Built from the real course data so they can't drift. */

import { courses, allLessons } from "../../src/data/courses.js";

export const emptyState = () => ({ courses: {}, streak: { count: 0, lastDay: null } });

export function doneCourse(state, course, { days = 0 } = {}) {
  const c = (state.courses[course.id] = { xp: 0, completedLessons: {}, answers: {}, lastLessonId: null });
  for (const l of allLessons(course)) c.completedLessons[l.id] = 1;
  for (const q of course.questions) c.answers[q.id] = { correct: true, attempts: 1, at: 1 };
  for (const g of course.games || []) c.answers[g.id] = { correct: true, attempts: 1, at: 1 };
  if (days) {
    state.game ||= { days: {} };
    state.game.days ||= {};
    for (let i = 1; i <= days; i++) state.game.days[`2026-01-${String(i).padStart(2, "0")}`] = 1;
  }
  return state;
}

export function fullState({ days = 5 } = {}) {
  const s = emptyState();
  for (const c of courses) if (c.status === "live") doneCourse(s, c);
  s.game = { days: {} };
  for (let i = 1; i <= days; i++) s.game.days[`2026-01-${String(i).padStart(2, "0")}`] = 1;
  return s;
}
