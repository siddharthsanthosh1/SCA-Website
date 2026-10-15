import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getCourse, allLessons, questionsFor, gamesFor, adjacentLessons } from "../data/courses";
import { useProgress } from "../lib/progress";
import Blocks from "../components/Blocks";
import Question from "../components/Question";
import GameHost from "../components/games/GameHost";
import { Check, Arrow, Back } from "../components/Icons";

// The finish card pulls in Byteville's buildings and the badges, so it loads
// on demand (and is prefetched once practice starts) instead of slowing down
// the lesson's first paint.
const loadComplete = () => import("../components/moments/LessonComplete");
const LessonComplete = lazy(loadComplete);

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const course = getCourse(courseId);
  const progress = useProgress();
  const navigate = useNavigate();
  const practiceRef = useRef(null);

  const lessons = useMemo(() => allLessons(course), [course]);
  const lesson = lessons.find((l) => l.id === lessonId);
  const questions = useMemo(() => questionsFor(course, lessonId), [course, lessonId]);
  const games = useMemo(() => gamesFor(course, lessonId), [course, lessonId]);
  const { prev, next } = adjacentLessons(course, lessonId);

  const [stage, setStage] = useState("read"); // read | practice
  const [finished, setFinished] = useState(null); // { before } while the finish card is open
  const finishBtn = useRef(null);

  // Offer plain mode exactly once: at the bottom of the first lesson a
  // student ever opens. Decided on mount so it stays put for this lesson.
  const [offerPlain] = useState(() => progress.fun && !progress.funOffered);
  const [plainChosen, setPlainChosen] = useState(false);
  useEffect(() => {
    if (offerPlain) progress.markFunOffered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === "practice") loadComplete();
  }, [stage]);

  useEffect(() => {
    setStage("read");
    setFinished(null);
    window.scrollTo({ top: 0 });
    if (course && lesson) progress.visitLesson(course.id, lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  if (!course || course.status !== "live") return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={`/course/${courseId}`} replace />;

  const solvedCount = questions.filter((q) => progress.answerOf(course.id, q.id)?.correct).length;
  const allSolved = solvedCount === questions.length;
  const isDone = progress.isLessonDone(course.id, lesson.id);

  const goNext = () => {
    if (next) navigate(`/course/${course.id}/lesson/${next.id}`);
    else navigate(`/course/${course.id}`);
  };

  const finish = () => {
    // A lesson that's already done just moves on — celebrations happen once.
    // One with questions still unsolved isn't completed: "Skip for now" moves
    // on without paying anything or building anything.
    if (isDone || !allSolved) return goNext();
    const before = progress.state;
    progress.completeLesson(course.id, lesson.id);
    setFinished({ before });
  };

  const closeFinished = () => {
    setFinished(null);
    setTimeout(() => finishBtn.current?.focus(), 0);
  };

  const joy = progress.fun;
  const pipOn = progress.fun && !course.older;

  return (
    <main className="shell" style={{ paddingBlock: "clamp(20px, 4vw, 36px) 72px" }}>
      <div className="lesson">
        {/* ---------------------------------------------------------- aside */}
        <aside className="lesson__aside">
          <Link to={`/course/${course.id}`} className="small muted row" style={{ gap: 6 }}>
            <Back size={13} /> {course.title}
          </Link>
          <details className="toc-wrap">
            <summary>
              <span>All lessons</span>
              <span className="small muted">{course.topics.reduce((n, t) => n + t.lessons.length, 0)} total</span>
            </summary>
            <nav className="toc" aria-label="Lessons">
            {course.topics.map((topic) => (
              <div key={topic.id}>
                <p className="toc__topic">{topic.title}</p>
                {topic.lessons.map((l) => {
                  const done = progress.isLessonDone(course.id, l.id);
                  return (
                    <Link
                      key={l.id}
                      to={`/course/${course.id}/lesson/${l.id}`}
                      className={"toc__item" + (l.id === lesson.id ? " active" : "")}
                    >
                      <span className={"toc__dot" + (done ? " done" : "")}>
                        {done && <Check size={9} bold />}
                      </span>
                      <span>{l.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            </nav>
          </details>
        </aside>

        {/* ----------------------------------------------------------- body */}
        <div className="stack" style={{ gap: 22, minWidth: 0 }}>
          <header className="stack" style={{ gap: 8 }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="chip chip--blue">Lesson {lesson.id}</span>
              <span className="chip chip--grey">{lesson.minutes} min</span>
              {isDone && <span className="chip chip--green"><Check size={11} bold /> Complete</span>}
            </div>
            <h1 className="h1" style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.4rem)" }}>{lesson.title}</h1>
          </header>

          {stage === "read" ? (
            <>
              <Blocks blocks={lesson.blocks} lang={course.id} />
              <div className="row" style={{ marginTop: 6 }}>
                <button
                  className="btn btn--lg"
                  onClick={() => {
                    setStage("practice");
                    setTimeout(() => practiceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
                  }}
                >
                  Practice this ({questions.length} question{questions.length === 1 ? "" : "s"}
                  {games.length > 0 && `, ${games.length} game${games.length === 1 ? "" : "s"}`}) <Arrow />
                </button>
              </div>
            </>
          ) : (
            <div ref={practiceRef} className="stack" style={{ gap: 18 }}>
              <div className="spread">
                <button className="btn btn--quiet btn--sm" onClick={() => setStage("read")}>
                  <Back size={13} /> Back to the lesson
                </button>
                <span className="small muted">{solvedCount} of {questions.length} solved</span>
              </div>

              {questions.map((q, i) => (
                <Question
                  key={q.id}
                  question={q}
                  runner={course.runner}
                  caseSensitive={Boolean(course.caseSensitive)}
                  index={i}
                  total={questions.length}
                  previous={progress.answerOf(course.id, q.id)}
                  onAnswered={(ok) => progress.recordAnswer(course.id, q.id, ok)}
                  joy={joy}
                  pip={pipOn}
                />
              ))}

              {/* Games never gate the lesson: finishing works the same whether
                  or not they've been played. */}
              {games.length > 0 && (
                <section className="stack" style={{ gap: 18 }} aria-labelledby="play-heading">
                  <h2 id="play-heading" className="h2" style={{ marginTop: 8 }}>Play</h2>
                  {games.map((g) => (
                    <GameHost key={g.id} game={g} courseId={course.id} />
                  ))}
                </section>
              )}

              <div className="card" style={{ background: allSolved ? "var(--green-tint)" : "var(--surface-2)", borderColor: allSolved ? "#cfe9c9" : "var(--line)" }}>
                <div className="spread">
                  <div className="stack" style={{ gap: 3 }}>
                    <strong style={{ color: "var(--text)" }}>
                      {allSolved ? "All questions solved" : `${solvedCount} of ${questions.length} solved`}
                    </strong>
                    <span className="small muted">
                      {isDone
                        ? "You've finished this lesson."
                        : allSolved
                          ? "Mark the lesson done and move on."
                          : "Solve every question to finish the lesson. You can skip ahead and come back to it."}
                    </span>
                  </div>
                  <button ref={finishBtn} className={"btn btn--kid" + (!isDone && !allSolved ? " btn--ghost" : "")} onClick={finish}>
                    {isDone
                      ? next ? "Continue" : "Back to the course"
                      : !allSolved
                        ? next ? "Skip for now" : "Back to the course"
                        : next ? "Finish and continue" : "Finish lesson"}{" "}
                    <Arrow size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {finished && (
            <Suspense fallback={null}>
              <LessonComplete
                course={course}
                lesson={lesson}
                next={next}
                before={finished.before}
                onClose={closeFinished}
                onNext={goNext}
              />
            </Suspense>
          )}

          <hr className="divider" />

          <nav className="spread">
            {prev ? (
              <Link className="btn btn--ghost btn--sm" to={`/course/${course.id}/lesson/${prev.id}`}>
                <Back size={13} /> {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link className="btn btn--ghost btn--sm" to={`/course/${course.id}/lesson/${next.id}`}>
                {next.title} <Arrow size={13} />
              </Link>
            ) : <span />}
          </nav>

          {offerPlain && (
            <p className="funline">
              {plainChosen ? (
                "Fun mode is off. You can switch it back on in My progress."
              ) : (
                <>
                  Prefer it plain?{" "}
                  <button onClick={() => (progress.setFun(false), setPlainChosen(true))}>You can switch off Fun mode.</button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
