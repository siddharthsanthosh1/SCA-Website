import { lazy, Suspense, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getCourse, allLessons, courseStats } from "../data/courses";
import { useProgress } from "../lib/progress";
import { Check, Arrow } from "../components/Icons";
import { pipLine } from "../data/pip-lines";

const PipSays = lazy(() => import("../components/pip/PipSays"));

export default function Course() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const progress = useProgress();
  const tip = useMemo(() => pipLine("tip"), [courseId]);

  if (!course) return <Navigate to="/" replace />;
  if (course.status !== "live")
    return (
      <main className="shell" style={{ paddingBlock: 60 }}>
        <div className="empty card">
          <h2 className="h2">{course.title} isn't ready yet</h2>
          <p className="muted">We're writing it now. Python is finished and waiting for you.</p>
          <Link className="btn" to="/course/python">Go to Python <Arrow size={14} /></Link>
        </div>
      </main>
    );

  const s = courseStats(course, progress);
  const lessons = allLessons(course);
  const lastId = progress.course(course.id).lastLessonId;
  const resume = lessons.find((l) => l.id === lastId) || lessons.find((l) => !progress.isLessonDone(course.id, l.id)) || lessons[0];

  return (
    <main className="shell" style={{ paddingBlock: "clamp(24px, 5vw, 48px) 72px" }}>
      <Link to="/" className="small muted">← All courses</Link>

      <div className="spread" style={{ alignItems: "flex-end", marginTop: 14 }}>
        <header className="stack" style={{ gap: 12, maxWidth: "62ch" }}>
          <span className="eyebrow">{course.subtitle}</span>
          <h1 className="h1">{course.title}</h1>
          <p style={{ fontSize: "1.03rem" }}>{course.blurb}</p>
        </header>
        {progress.fun && !course.older && (
          <Suspense fallback={null}>
            <div className="course-pip">
              <PipSays mood="waving" line={tip} size={64} />
            </div>
          </Suspense>
        )}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="spread">
          <div className="stack" style={{ gap: 4 }}>
            <strong style={{ color: "var(--text)" }}>
              {s.lessonsDone === 0 ? "Not started yet" : `${s.lessonsDone} of ${s.lessons} lessons done`}
            </strong>
            <span className="small muted">
              {s.questionsRight} of {s.questions} practice questions solved · {s.xp} XP
            </span>
          </div>
          <Link className="btn" to={`/course/${course.id}/lesson/${resume.id}`}>
            {s.lessonsDone === 0 ? "Start lesson 1" : "Continue"} <Arrow size={14} />
          </Link>
        </div>
        <div className="bar" style={{ marginTop: 14 }}>
          <div className="bar__fill" style={{ width: `${s.percent}%` }} />
        </div>
      </div>

      <div className="stack" style={{ gap: 26, marginTop: 34 }}>
        {course.topics.map((topic, ti) => {
          const done = topic.lessons.filter((l) => progress.isLessonDone(course.id, l.id)).length;
          return (
            <section key={topic.id}>
              <div className="spread" style={{ marginBottom: 10 }}>
                <div className="stack" style={{ gap: 2 }}>
                  <span className="eyebrow">Topic {ti + 1}</span>
                  <h2 className="h3">{topic.title}</h2>
                </div>
                <span className="chip chip--grey">{done}/{topic.lessons.length}</span>
              </div>
              <p className="small muted" style={{ marginBottom: 12 }}>{topic.blurb}</p>

              <div className="stack" style={{ gap: 8 }}>
                {topic.lessons.map((l) => {
                  const isDone = progress.isLessonDone(course.id, l.id);
                  return (
                    <Link
                      key={l.id}
                      to={`/course/${course.id}/lesson/${l.id}`}
                      className="card card--link"
                      style={{ padding: "14px 18px", display: "block" }}
                    >
                      <div className="spread">
                        <div className="row" style={{ gap: 12, flex: 1, minWidth: 0 }}>
                          <span className={"toc__dot" + (isDone ? " done" : "")}>
                            {isDone && <Check size={10} bold />}
                          </span>
                          <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                            <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                              {l.id} · {l.title}
                            </strong>
                            <span className="small muted">{l.blurb}</span>
                          </div>
                        </div>
                        <span className="small muted" style={{ whiteSpace: "nowrap" }}>
                          {l.minutes} min · {l.questions.length} q{l.games?.length ? ` · ${l.games.length} game${l.games.length === 1 ? "" : "s"}` : ""}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
