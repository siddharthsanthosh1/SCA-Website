import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, friendlyAuthError } from "../lib/auth";
import { useProgress } from "../lib/progress";
import { Arrow } from "../components/Icons";

/* Remembered on this browser so a returning student lands on "Sign in" and a
   new one on "Create your account". Holds no personal data. */
const SEEN_KEY = "sca-learn:has-account";
const seenBefore = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};
const rememberSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage blocked */
  }
};

/* Every page needs an account (see RequireAccount in App.jsx), so this is
   the front door: anyone not signed in is sent here, then back to the page
   they asked for. */
export default function SignIn() {
  const { user, enabled, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && location.state.from !== "/signin" ? location.state.from : "/";
  const { carryable, setCarry } = useProgress();
  const [mode, setMode] = useState(() => (seenBefore() ? "in" : "up")); // in | up
  // On a shared computer the work already on screen may be someone else's.
  // Creating an account usually means "save what I just did"; signing in to
  // an existing one usually doesn't — so that one is unticked by default.
  const [carryChoice, setCarryChoice] = useState(null); // null = the default for the mode
  const carry = carryChoice ?? mode === "up";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  // Firebase reports the new account before sign-up has finished saving the
  // profile, and the redirect below takes the student on straight away. By
  // the time sign-up returns they may be several pages further on — so only
  // navigate if this page is still showing.
  const mounted = useRef(true);
  useEffect(() => () => void (mounted.current = false), []);

  if (!enabled)
    return (
      <main className="shell" style={{ paddingBlock: 60, maxWidth: 560 }}>
        <div className="card stack" style={{ gap: 12 }}>
          <h1 className="h2">Accounts aren't switched on yet</h1>
          <p className="muted">
            This copy has no Firebase config, so there is nothing to sign in to. Your progress is being
            saved in this browser and will still be here next time.
          </p>
          <Link className="btn" to="/">Back to courses <Arrow size={14} /></Link>
        </div>
      </main>
    );

  if (user && !user.isAnonymous) return <Navigate to={from} replace />;

  const attempt = async (fn) => {
    setError("");
    setNotice("");
    setBusy(true);
    setCarry(!carryable || carry);
    try {
      await fn();
      rememberSeen();
      if (mounted.current) navigate(from, { replace: true });
    } catch (err) {
      if (mounted.current) setError(friendlyAuthError(err));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (mode === "in") attempt(() => signIn(email, password));
    else attempt(() => signUp(name, email, password, { keepGuest: carry }));
  };

  const forgot = async () => {
    setError("");
    setNotice("");
    if (!email.trim()) return setError("Type your email address above first, then choose “Forgot your password?” again.");
    setBusy(true);
    try {
      await resetPassword(email);
      setNotice(`If there's an account for ${email.trim()}, we've emailed it a link to choose a new password. Check the inbox (and spam).`);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "in" ? "up" : "in");
    setError("");
    setNotice("");
  };

  return (
    <main className="shell" style={{ paddingBlock: "clamp(28px, 6vw, 60px) 72px", maxWidth: 480 }}>
      <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
        <span className="eyebrow">Student Code Alliance</span>
        <h1 className="h1" style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)" }}>
          {mode === "in" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="muted">
          {mode === "in"
            ? "Sign in to pick up where you left off."
            : "You need a free account to use SCA Learn. It keeps your progress safe on every device you use."}
        </p>
      </div>

      <div className="card stack" style={{ gap: 14 }}>
        {carryable && (
          <label className="row small" style={{ gap: 8, alignItems: "flex-start" }}>
            <input type="checkbox" checked={carry} onChange={(e) => setCarryChoice(e.target.checked)} style={{ marginTop: 3 }} />
            <span>
              Add the work already done on this computer to my account ({carryable.lessons} lesson
              {carryable.lessons === 1 ? "" : "s"}, {carryable.answers} answer{carryable.answers === 1 ? "" : "s"}).{" "}
              <span className="muted">Leave this unticked if it isn't yours.</span>
            </span>
          </label>
        )}

        <form onSubmit={submit} className="stack" style={{ gap: 11 }}>
          {mode === "up" && (
            <Field label="Your first name" value={name} onChange={setName} autoComplete="given-name" placeholder="Ada" />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" required />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            placeholder={mode === "up" ? "At least 6 characters" : ""}
            required
          />
          {error && <p className="verdict verdict--no" role="alert" style={{ margin: 0 }}>{error}</p>}
          {notice && <p className="verdict verdict--ok" role="status" style={{ margin: 0 }}>{notice}</p>}
          <button className="btn btn--block" type="submit" disabled={busy}>
            {busy ? "One moment…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
          {mode === "in" && (
            <button type="button" className="btn btn--quiet btn--sm" style={{ alignSelf: "center" }} onClick={forgot} disabled={busy}>
              Forgot your password?
            </button>
          )}
        </form>

        <p className="small muted" style={{ textAlign: "center" }}>
          {mode === "in" ? "New here? " : "Already have an account? "}
          <button className="btn btn--quiet btn--sm" style={{ padding: "2px 6px", color: "var(--blue)" }} onClick={switchMode}>
            {mode === "in" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>

      <p className="small muted" style={{ marginTop: 18, textAlign: "center" }}>
        We only store your name, email and which lessons you finished.
      </p>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", ...rest }) {
  return (
    <label className="stack" style={{ gap: 5 }}>
      <span className="small" style={{ fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      <input
        className="fill-input"
        style={{ fontFamily: "inherit", width: "100%" }}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  );
}
