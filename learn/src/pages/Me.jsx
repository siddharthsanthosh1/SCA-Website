import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { courses, courseStats, allLessons } from "../data/courses";
import { useProgress } from "../lib/progress";
import { useAuth } from "../lib/auth";
import Ring from "../components/Ring";
import { Arrow, Flame, Check } from "../components/Icons";
import { isCourseDone, isTopicDone } from "../lib/sparks";
import { pipLine } from "../data/pip-lines";
import { SparkAmount } from "../components/joy/Spark";

const PipSays = lazy(() => import("../components/pip/PipSays"));
const BadgeShelf = lazy(() => import("../components/moments/BadgeShelf"));

function FunSwitch() {
  const progress = useProgress();
  return (
    <button className="switch" role="switch" aria-checked={progress.fun} onClick={() => progress.setFun(!progress.fun)}>
      <span className="switch__track"><span className="switch__thumb" /></span>
      <span>Fun mode is {progress.fun ? "on" : "off"}</span>
    </button>
  );
}

export default function Me() {
  const progress = useProgress();
  const { user, enabled } = useAuth();
  const live = courses.filter((c) => c.status === "live");

  const totals = live.reduce(
    (acc, c) => {
      const s = courseStats(c, progress);
      acc.xp += s.xp;
      acc.lessonsDone += s.lessonsDone;
      acc.lessons += s.lessons;
      acc.questionsRight += s.questionsRight;
      acc.questions += s.questions;
      return acc;
    },
    { xp: 0, lessonsDone: 0, lessons: 0, questionsRight: 0, questions: 0 }
  );

  const saving = progress.status;
  const fun = progress.fun;
  const finished = live.filter((c) => isCourseDone(progress.state, c));
  const built = live.reduce((n, c) => n + c.topics.filter((t) => isTopicDone(progress.state, c, t)).length, 0);
  const started = totals.lessonsDone > 0 || totals.questionsRight > 0;
  const sleepy = useMemo(() => pipLine("sleeping"), []);

  return (
    <main className="shell" style={{ paddingBlock: "clamp(24px, 5vw, 48px) 72px" }}>
      <header className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">My progress</span>
        <h1 className="h1">
          {user?.displayName ? user.displayName : user?.isAnonymous ? "Guest" : "Your learning"}
        </h1>
        <p className="muted">
          {enabled && !user && "You're not signed in, so this is saved in this browser only."}
          {enabled && user?.isAnonymous && "You're a guest. Create an account to keep this on any device."}
          {enabled && user && !user.isAnonymous && `Saved to your account${saving === "saving" ? " · saving…" : saving === "error" ? " · couldn't reach the server, kept locally" : ""}`}
          {!enabled && "Local mode — progress is saved in this browser."}
        </p>
      </header>

      <div className="grid grid--3" style={{ marginTop: 24 }}>
        <div className="card row" style={{ gap: 14 }}>
          <Ring percent={totals.lessons ? Math.round((totals.lessonsDone / totals.lessons) * 100) : 0} size={58} />
          <div className="stack" style={{ gap: 2 }}>
            <strong style={{ color: "var(--text)", fontSize: "1.1rem" }}>
              {totals.lessonsDone}/{totals.lessons}
            </strong>
            <span className="small muted">Lessons finished</span>
          </div>
        </div>
        <div className="card stack" style={{ gap: 2 }}>
          <div className="row" style={{ gap: 8, color: "var(--green)" }}>
            <Check size={16} bold />
            <strong style={{ color: "var(--text)", fontSize: "1.1rem" }}>
              {totals.questionsRight}/{totals.questions}
            </strong>
          </div>
          <span className="small muted">Practice questions solved</span>
        </div>
        <div className="card stack" style={{ gap: 2 }}>
          <div className="row" style={{ gap: 8, color: "var(--amber)" }}>
            <Flame size={16} />
            <strong style={{ color: "var(--text)", fontSize: "1.1rem" }}>
              {progress.streak.count} day{progress.streak.count === 1 ? "" : "s"}
            </strong>
          </div>
          <span className="small muted">Practice streak · {totals.xp} XP</span>
        </div>
      </div>

      {fun && (
        <div className="grid grid--2" style={{ marginTop: 18 }}>
          <div className="kid spread">
            <div className="stack" style={{ gap: 4 }}>
              <strong style={{ color: "var(--text)", fontSize: "1.2rem" }}><SparkAmount n={progress.sparks} size={18} /></strong>
              <span className="small muted">Sparks to spend · {progress.sparksEarned} earned, {progress.spent} spent</span>
            </div>
            <Link className="btn btn--kid" to="/workshop">Workshop <Arrow size={14} /></Link>
          </div>
          <div className="kid spread">
            <div className="stack" style={{ gap: 4 }}>
              <strong style={{ color: "var(--text)", fontSize: "1.2rem" }}>{built} of 30 buildings</strong>
              <span className="small muted">Every topic you finish builds something in Byteville</span>
            </div>
            <Link className="btn btn--ghost btn--kid" to="/byteville">Byteville <Arrow size={14} /></Link>
          </div>
        </div>
      )}

      {fun && !started && (
        <Suspense fallback={null}>
          <div style={{ marginTop: 24 }}>
            <PipSays mood="sleeping" line={sleepy} size={72} />
          </div>
        </Suspense>
      )}

      <section style={{ marginTop: 36 }} aria-labelledby="badges-h">
        <h2 id="badges-h" className="h2" style={{ marginBottom: 6 }}>Badges</h2>
        <Suspense fallback={<div className="skeleton" style={{ height: 160 }} />}>
          <BadgeShelf />
        </Suspense>
      </section>

      {finished.length > 0 && (
        <section style={{ marginTop: 36 }} aria-labelledby="certs-h">
          <h2 id="certs-h" className="h2" style={{ marginBottom: 14 }}>Certificates</h2>
          <div className="row">
            {finished.map((c) => (
              <Link key={c.id} className="btn btn--ghost btn--kid" to={`/certificate/${c.id}`}>
                {c.title} certificate
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 36 }}>
        <h2 className="h2" style={{ marginBottom: 14 }}>Courses</h2>
        <div className="stack" style={{ gap: 12 }}>
          {live.map((c) => {
            const s = courseStats(c, progress);
            const lessons = allLessons(c);
            const lastId = progress.course(c.id).lastLessonId;
            const resume = lessons.find((l) => l.id === lastId) || lessons.find((l) => !progress.isLessonDone(c.id, l.id)) || lessons[0];
            return (
              <div key={c.id} className="card">
                <div className="spread">
                  <div className="stack" style={{ gap: 3 }}>
                    <strong style={{ color: "var(--text)" }}>{c.title}</strong>
                    <span className="small muted">
                      {s.lessonsDone}/{s.lessons} lessons · {s.questionsRight}/{s.questions} questions · {s.xp} XP
                    </span>
                  </div>
                  <div className="row">
                    <Link className="btn btn--sm" to={`/course/${c.id}/lesson/${resume.id}`}>
                      {s.lessonsDone ? "Continue" : "Start"} <Arrow size={13} />
                    </Link>
                    {s.lessonsDone > 0 && (
                      <button
                        className="btn btn--quiet btn--sm"
                        onClick={() => {
                          if (confirm(`Reset all your progress in ${c.title}? This cannot be undone. The Sparks you earned in it go too, until you earn them again — anything you've bought stays yours.`))
                            progress.resetCourse(c.id);
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <div className="bar" style={{ marginTop: 12 }}>
                  <div className="bar__fill" style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="fun" style={{ marginTop: 36 }} aria-labelledby="fun-h">
        <h2 id="fun-h" className="h2" style={{ marginBottom: 8 }}>Fun mode</h2>
        <p className="muted" style={{ maxWidth: "62ch", marginBottom: 8 }}>
          Pip the robot, Byteville, the Workshop and celebrations. Switch it off for a plainer look — your Sparks
          keep counting either way, so nothing is lost if you switch it back on.
        </p>
        <FunSwitch />
      </section>
    </main>
  );
}
