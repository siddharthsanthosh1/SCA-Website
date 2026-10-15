import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useProgress } from "../../lib/progress";
import { lessonSparks, isLessonDone, isTopicDone, isCourseDone, PAY } from "../../lib/sparks";
import { allLessons } from "../../data/courses";
import { buildingFor } from "../../data/byteville";
import { badges, earnedBadgeIds } from "../../data/badges";
import { pipLine } from "../../data/pip-lines";
import Pip from "../pip/Pip";
import Shapes, { Art } from "../art/Shapes";
import Confetti from "../joy/Confetti";
import { SparkAmount } from "../joy/Spark";
import { Check, Arrow } from "../Icons";
import Certificate from "./Certificate";

/* ---------------------------------------------------------------------------
   The card that opens when a lesson is finished.

   Lesson:  Pip cheering, the Sparks this lesson earned, a bar that fills.
   Topic:   plus a cutaway of the new building going up in Byteville.
   Course:  plus the certificate, with a Print button.

   Fun mode off: a tick and a line of text, the same buttons, the certificate.
   It never blocks: Esc, the × and the backdrop all close it, and focus stays
   inside while it's open.
   `before` is the progress state from just before the lesson was marked
   done, so the card can tell "this finished the topic" from "the topic was
   already done", and which badges are new.
   --------------------------------------------------------------------------- */

export default function LessonComplete({ course, lesson, next, before, onClose, onNext }) {
  const progress = useProgress();
  const { state, fun, equipped } = progress;
  const card = useRef(null);
  const [filled, setFilled] = useState(false);

  const topic = course.topics.find((t) => t.lessons.some((l) => l.id === lesson.id));
  const topicJustDone = topic && isTopicDone(state, course, topic) && !isTopicDone(before, course, topic);
  const courseJustDone = isCourseDone(state, course) && !isCourseDone(before, course);
  const building = topicJustDone ? buildingFor(course.id, topic.id) : null;

  const total = allLessons(course).length;
  const doneNow = allLessons(course).filter((l) => isLessonDone(state, course.id, l.id)).length;
  const doneBefore = allLessons(course).filter((l) => isLessonDone(before, course.id, l.id)).length;
  const earned = lessonSparks(state, course, lesson) + (topicJustDone ? PAY.topic : 0) + (courseJustDone ? PAY.course : 0);
  const newBadges = useMemo(() => {
    const had = new Set(earnedBadgeIds(before));
    return earnedBadgeIds(state).filter((id) => !had.has(id)).map((id) => badges.find((b) => b.id === id));
  }, [state, before]);
  const situation = courseJustDone ? "courseDone" : topicJustDone ? "topicDone" : "lessonDone";
  const line = useMemo(() => pipLine(situation), [situation]);

  // Record what's been celebrated so it isn't celebrated twice.
  useEffect(() => {
    progress.markSeen(newBadges.map((b) => `badge:${b.id}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kept in a ref so the effect below runs once: `onClose` is a new function
  // on every render of the lesson, and re-running would pull focus back to
  // the first button each time progress saves.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setFilled(true));
    card.current?.querySelector("[data-autofocus]")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab" || !card.current) return;
      const els = [...card.current.querySelectorAll("a[href], button:not(:disabled), input")];
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const from = doneBefore / total;
  const to = doneNow / total;
  const title = courseJustDone ? "Course complete" : topicJustDone ? "Topic complete" : "Lesson complete";

  return createPortal(
    <div className="moment" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {fun && (topicJustDone || courseJustDone) && <Confetti id={lesson.id} />}
      <div
        ref={card}
        className={"moment__card" + (courseJustDone ? " moment__card--wide" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="moment-title"
      >
        <button className="moment__close no-print" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>

        {fun ? (
          <>
            {!building && <Pip mood="cheering" size={courseJustDone ? 96 : 120} equipped={equipped} />}
            {building && (
              <div className="cutaway">
                <svg viewBox="-40 0 144 112" role="img" aria-label={`New in Byteville: ${building.name}`}>
                  <title>{`New in Byteville: ${building.name}`}</title>
                  <rect x="-40" y="100" width="144" height="12" fill="#c6ecb2" />
                  <ellipse cx="32" cy="100" rx="40" ry="5" fill="#b4e09c" />
                  <g className="town__grow" style={{ animationDelay: "0.25s" }}>
                    <Shapes list={building.draw({ lit: courseJustDone })} />
                  </g>
                  <g transform="translate(67 58) scale(0.29)">
                    <Pip mood="cheering" size={120} equipped={equipped} />
                  </g>
                </svg>
              </div>
            )}
            <h2 id="moment-title" className="moment__title">{title}</h2>
            <p style={{ color: "var(--text)" }}>{line}</p>
            {building && (
              <p className="small muted">
                New in Byteville: <strong style={{ color: "var(--text)" }}>{building.name}</strong>, for finishing “{topic.title}”.{" "}
                <Link to="/byteville" style={{ color: "var(--blue)", textDecoration: "underline", display: "inline-block", padding: "10px 2px", margin: "-10px 0" }}>See it in Byteville</Link>
              </p>
            )}
            {earned > 0 && (
              <span className="moment__earned">+<SparkAmount n={earned} size={18} /></span>
            )}
          </>
        ) : (
          <>
            <h2 id="moment-title" className="moment__plain">
              <span className="tick"><Check size={18} bold /></span> {title}.
            </h2>
            {topicJustDone && <p className="small muted">You finished “{topic.title}”.</p>}
          </>
        )}

        <div className="stack" style={{ gap: 6, width: "100%" }}>
          <div className="moment__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={doneNow} aria-label={`${course.title} progress`}>
            <div className="moment__bar-fill" style={{ transform: `scaleX(${filled ? to : from})` }} />
          </div>
          <span className="small muted">{doneNow} of {total} lessons in {course.title}</span>
        </div>

        {newBadges.length > 0 && (
          <div className="stack" style={{ gap: 8 }}>
            <strong style={{ color: "var(--text)" }}>New badge{newBadges.length > 1 ? "s" : ""}</strong>
            <div className="newbadges">
              {newBadges.map((b) => (
                <figure key={b.id}>
                  <Art shapes={b.draw()} viewBox="0 0 80 92" width={58} height={67} title={b.name} />
                  <figcaption>{b.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {courseJustDone && <Certificate course={course} />}

        <div className="moment__actions no-print">
          {next ? (
            <button className="btn btn--kid" onClick={onNext} data-autofocus>
              Next lesson <Arrow size={15} />
            </button>
          ) : (
            <Link className="btn btn--kid" to={`/course/${course.id}`} data-autofocus>
              Back to {course.title} <Arrow size={15} />
            </Link>
          )}
          {fun && (
            <Link className="btn btn--ghost btn--kid" to="/workshop">Go to Workshop</Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
