import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useProgress } from "../lib/progress";
import { Flame } from "./Icons";
import { Bolt, SparkFloat } from "./joy/Spark";

const initials = (u) => {
  const n = (u?.displayName || u?.email || "").trim();
  if (!n) return "?";
  const bits = n.split(/[\s@._]+/).filter(Boolean);
  return ((bits[0]?.[0] || "") + (bits[1]?.[0] || "")).toUpperCase() || n[0].toUpperCase();
};

/* The Sparks counter. When Sparks are earned it ticks up and a tiny "+5"
   floats off it — that's the whole animation. A change caused by loading an
   account (progress.epoch moved) just updates the number quietly. It doubles
   as the way into the Workshop, which matters on phones where the nav is
   hidden. */
function SparkCounter() {
  const { sparks, epoch } = useProgress();
  const [shown, setShown] = useState(sparks);
  const [gain, setGain] = useState(null);
  const [bump, setBump] = useState(0);
  const prev = useRef({ sparks, epoch });

  useEffect(() => {
    const p = prev.current;
    prev.current = { sparks, epoch };
    if (epoch !== p.epoch || sparks <= p.sparks) {
      setShown(sparks);
      return;
    }
    const from = p.sparks;
    const diff = sparks - from;
    setGain({ amount: diff, id: Date.now() });
    setBump((b) => b + 1);
    // Count up over ~0.4s. Text, not layout — and instant under reduced motion.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return setShown(sparks);
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / 400);
      setShown(Math.round(from + diff * k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sparks, epoch]);

  return (
    <Link
      to="/workshop"
      className="sparks"
      aria-label={`${sparks} Sparks. Open the Workshop.`}
      title="Your Sparks — spend them in the Workshop"
    >
      <span key={bump} className={"sparks__in" + (bump ? " is-bump" : "")} aria-hidden="true">
        <Bolt size={16} />
        {shown}
      </span>
      {gain && <SparkFloat amount={gain.amount} id={gain.id} />}
      <span className="sr-only" aria-live="polite">
        {gain ? `You earned ${gain.amount} Sparks.` : ""}
      </span>
    </Link>
  );
}

export default function Header() {
  const { user, enabled, signOut } = useAuth();
  const { streak, fun, flushBeforeSignOut } = useProgress();
  const { pathname } = useLocation();
  const leave = async () => {
    await flushBeforeSignOut();
    signOut();
  };
  // Every page needs an account, so a signed-out visitor only ever sees the
  // sign-in page: no links into the site, no Sparks, no streak. (Local mode,
  // with no Firebase, has no accounts and shows everything.)
  const signedIn = !enabled || Boolean(user && !user.isAnonymous);

  return (
    <>
      {!enabled && (
        <div className="banner">
          <div className="shell banner__inner">
            <strong>Local mode.</strong>
            <span>
              No Firebase config found, so progress saves to this browser only. Add your keys to
              <code> .env.local</code> to turn on accounts.
            </span>
          </div>
        </div>
      )}

      <header className={"hdr" + (signedIn ? " hdr--in" : "")}>
        <div className="shell hdr__inner">
          <Link to="/" className="brand" aria-label="Student Code Alliance Learn — all courses">
            <span className="brand__badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
              </svg>
            </span>
            <span>
              Student Code Alliance <span className="brand__sub">Learn</span>
            </span>
          </Link>

          {signedIn && (
            <nav className="hdr__nav">
              <NavLink to="/" end className={({ isActive }) => "hdr__link" + (isActive ? " active" : "")}>
                Courses
              </NavLink>
              <NavLink to="/me" className={({ isActive }) => "hdr__link" + (isActive ? " active" : "")}>
                My progress
              </NavLink>
              {fun && (
                <>
                  <NavLink to="/workshop" className={({ isActive }) => "hdr__link" + (isActive ? " active" : "")}>
                    Workshop
                  </NavLink>
                  <NavLink to="/byteville" className={({ isActive }) => "hdr__link" + (isActive ? " active" : "")}>
                    Byteville
                  </NavLink>
                </>
              )}
              {/* On phones the nav is its own row and "Main site" moves into it. */}
              <a className="hdr__link hdr__home-nav" href="../">
                Main site
              </a>
            </nav>
          )}

          <div className="row" style={{ gap: 12 }}>
            {/* Learn lives at /learn/ inside the Student Code Alliance site;
                "../" is the main site wherever that is hosted. */}
            <a className="hdr__link hdr__home" href="../">
              Main site
            </a>
            {signedIn && fun && <SparkCounter />}
            {signedIn && streak.count > 0 && (
              <span className="chip chip--amber" title="Days in a row you've practised">
                <Flame size={13} /> {streak.count}
              </span>
            )}
            {enabled && user && !user.isAnonymous && (
              <>
                <span className="avatar" title={`Signed in as ${user.displayName || user.email}`} aria-hidden="true">
                  {initials(user)}
                </span>
                <button className="btn btn--quiet btn--sm" onClick={leave} aria-label={`Sign out ${user.displayName || user.email || ""}`.trim()}>
                  Sign out
                </button>
              </>
            )}
            {enabled && !signedIn && pathname !== "/signin" && (
              <Link className="btn btn--sm" to="/signin">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
