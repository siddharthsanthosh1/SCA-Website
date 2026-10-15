import { Link } from "react-router-dom";
import { courses, courseStats, lessonCount } from "../data/courses";
import { useProgress } from "../lib/progress";
import { useAuth } from "../lib/auth";
import Ring from "../components/Ring";
import { Arrow, Lock, Spark } from "../components/Icons";

export default function Home() {
  const progress = useProgress();
  const { user, enabled } = useAuth();
  const live = courses.filter((c) => c.status === "live");
  const soon = courses.filter((c) => c.status !== "live");

  const name = user?.displayName?.split(" ")[0];

  return (
    <main className="shell" style={{ paddingBlock: "clamp(28px, 6vw, 56px) 72px" }}>
      <section className="stack" style={{ gap: 14, maxWidth: "62ch" }}>
        <span className="eyebrow">Student Code Alliance</span>
        <h1 className="h1">{name ? `Welcome back, ${name}.` : "Learn to code, for free."}</h1>
        <p style={{ fontSize: "1.05rem" }}>
          Short lessons, then real practice. Write Python and build web pages right in your browser —
          nothing to install, and your progress is saved as you go.
        </p>
        {enabled && !user && (
          <div className="row" style={{ marginTop: 6 }}>
            <Link className="btn btn--lg" to="/signin">
              Create a free account <Arrow />
            </Link>
            <Link className="btn btn--ghost btn--lg" to={`/course/${live[0]?.id}`}>
              Start without one
            </Link>
          </div>
        )}
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 className="h2" style={{ marginBottom: 16 }}>Courses</h2>
        <div className="grid grid--2" style={{ maxWidth: live.length === 1 ? 640 : "none" }}>
          {live.map((c) => {
            const s = courseStats(c, progress);
            const started = s.lessonsDone > 0;
            return (
              <Link key={c.id} to={`/course/${c.id}`} className="card card--link" style={{ display: "block" }}>
                <div className="spread" style={{ alignItems: "flex-start" }}>
                  <div className="stack" style={{ gap: 6 }}>
                    <div className="row" style={{ gap: 7 }}>
                      <span className="chip chip--blue">{c.level}</span>
                      <span className="chip chip--grey">{c.audience}</span>
                    </div>
                    <h3 className="h3" style={{ marginTop: 4 }}>{c.title}</h3>
                  </div>
                  {started && <Ring percent={s.percent} />}
                </div>
                <p className="muted" style={{ marginTop: 10 }}>{c.blurb}</p>
                <div className="row small muted" style={{ marginTop: 14, gap: 14 }}>
                  <span>{s.lessons} lessons</span>
                  <span>{s.questions} practice questions</span>
                  <span>{c.weeks} weeks</span>
                </div>
                <div className="row" style={{ marginTop: 16 }}>
                  <span className="btn btn--sm">
                    {started ? "Keep going" : "Start course"} <Arrow size={14} />
                  </span>
                  {started && (
                    <span className="small muted">
                      {s.lessonsDone} of {s.lessons} done · {s.xp} XP
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {soon.length > 0 && (
        <section style={{ marginTop: 44 }}>
          <div className="spread" style={{ marginBottom: 16 }}>
            <h2 className="h2">Coming soon</h2>
            <span className="small muted">The rest of what we teach, being written now</span>
          </div>
          <div className="grid grid--3">
            {soon.map((c) => (
              <div key={c.id} className="card" style={{ opacity: 0.78 }}>
                <div className="row" style={{ gap: 7 }}>
                  <span className="chip chip--grey"><Lock size={11} /> Soon</span>
                  <span className="chip chip--grey">{c.audience}</span>
                </div>
                <h3 className="h3" style={{ marginTop: 10 }}>{c.title}</h3>
                <p className="muted small" style={{ marginTop: 6 }}>{c.blurb}</p>
                {c.runner === "quiz" && (
                  <p className="small muted" style={{ marginTop: 10 }}>
                    Practice here will be quizzes and predict-the-output rather than a live editor.
                  </p>
              )}
            </div>
          ))}
        </div>
      </section>
      )}

      <section className="card" style={{ marginTop: 44, background: "var(--surface-2)" }}>
        <div className="row" style={{ gap: 10, color: "var(--blue)" }}>
          <Spark size={18} />
          <strong style={{ color: "var(--text)" }}>How the practice works</strong>
        </div>
        <p className="muted" style={{ marginTop: 8, maxWidth: "70ch" }}>
          Python and web pages run entirely inside your browser, so there is nothing to install and your
          code never leaves your computer. Press <strong>Run</strong> to see what your program does, or{" "}
          <strong>Check my answer</strong> to have the exercise marked. Java, C++ and Scratch are practised
          through games instead — trace a program line by line, find the bug, put the code in order.
          Getting it wrong costs you nothing — try as many times as you like.
        </p>
      </section>
    </main>
  );
}
