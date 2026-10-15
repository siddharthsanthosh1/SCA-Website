import { lazy, Suspense, useCallback, useState } from "react";
import Inline from "./Inline";
import Editor from "./Editor";
import Console from "./Console";
import Verdict from "./Verdict";
import WebTask from "./WebTask";
import { ScratchScript } from "./Scratch";
import { Check, Cross, Play, Bulb } from "./Icons";
import { runPython } from "../lib/runPython";
import { runJavascript } from "../lib/runJavascript";
import { runChecks, matchesFill, stripComments } from "../lib/checks";

// Pip only appears after an answer, so the lesson's first paint doesn't wait for him.
const PipReact = lazy(() => import("./pip/PipReact"));

const KEYS = ["A", "B", "C", "D", "E"];

/* The web runner has two shapes of question. One with an HTML or CSS pane
   gets a live page preview; a JavaScript-only one (`panes: ["js"]`) is a
   console exercise and runs in the same sandboxed worker as the "js" runner. */
const isPageTask = (q) => Array.isArray(q.panes) && q.panes.some((p) => p !== "js");

/* `joy`  — Fun mode is on: answers pulse or shake. The "+5 ⚡" floats off
            the header counter, not the card — one float, where the number is.
   `pip`  — Pip reacts too. Off in the high-school courses even in Fun mode. */
export default function Question({ question: q, runner, caseSensitive = false, index, total, onAnswered, previous, joy = false, pip = false }) {
  const solved = Boolean(previous?.correct);
  const [react, setReact] = useState(null); // { kind, n }

  const onReact = useCallback((kind) => setReact((r) => (kind ? { kind, n: (r?.n || 0) + 1 } : null)), []);

  const answered = (ok) => onAnswered(ok);

  return (
    <article className={"card q" + (joy ? " joy" : "")}>
      <div className="spread">
        <span className="eyebrow">
          Question {index + 1} of {total}
        </span>
        {solved && (
          <span className="chip chip--green">
            <Check size={12} bold /> Solved
          </span>
        )}
      </div>

      <p className="q__prompt" style={{ whiteSpace: "pre-line" }}>
        <Inline text={q.prompt} />
      </p>

      {q.kind === "mcq" && <Mcq q={q} onAnswered={answered} onReact={onReact} />}
      {q.kind === "fill" && <Fill q={q} caseSensitive={q.caseSensitive ?? caseSensitive} onAnswered={answered} onReact={onReact} />}
      {q.kind === "code" &&
        (runner === "web" && isPageTask(q) ? (
          <WebTask q={q} onAnswered={(ok) => (answered(ok), onReact(ok ? "right" : "wrong"))} />
        ) : (
          <CodeTask q={q} runner={runner === "web" ? "js" : runner} onAnswered={answered} onReact={onReact} />
        ))}

      {pip && react && (
        <Suspense fallback={null}>
          <PipReact react={react} />
        </Suspense>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ MCQ */

function Mcq({ q, onAnswered, onReact }) {
  // A wrong pick rules that option out but doesn't give the answer away —
  // otherwise every question could be "solved" by guessing, reading the
  // highlighted answer and trying again.
  const [wrong, setWrong] = useState([]); // options tried, in order
  const [right, setRight] = useState(false);

  const choose = (i) => {
    if (right || wrong.includes(i)) return;
    const ok = i === q.answer;
    if (ok) setRight(true);
    else setWrong((w) => [...w, i]);
    onAnswered(ok);
    onReact(ok ? "right" : "wrong");
  };

  const last = wrong[wrong.length - 1];

  return (
    <>
      {q.code && <pre className="codeblock">{q.code}</pre>}
      {q.script && <ScratchScript blocks={q.script} />}
      <div className="stack" style={{ gap: 9 }}>
        {q.options.map((opt, i) => {
          const cls = right && i === q.answer ? " correct" : wrong.includes(i) ? " wrong" : "";
          return (
            <button key={i} className={"opt" + cls} onClick={() => choose(i)} disabled={right || wrong.includes(i)}>
              <span className="opt__key">{KEYS[i]}</span>
              <span><Inline text={opt} /></span>
              {/* Colour is never the only signal: an icon and a word too. */}
              {cls === " correct" && <span className="opt__mark"><Check size={13} bold /> Correct</span>}
              {cls === " wrong" && <span className="opt__mark"><Cross size={12} /> Not this one</span>}
            </button>
          );
        })}
      </div>
      {right && (
        <Verdict ok title="Correct">
          <Inline text={q.explain} />
        </Verdict>
      )}
      {!right && last !== undefined && (
        <Verdict ok={false} title="Not yet — try another answer">
          Read the question again and think about what each option would really do.
        </Verdict>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ Fill */

function Fill({ q, caseSensitive, onAnswered, onReact }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim() || result?.ok) return;
    const ok = matchesFill(value, q.accept, { caseSensitive });
    setResult({ ok, n: (result?.n || 0) + 1 });
    onAnswered(ok);
    onReact(ok ? "right" : "wrong");
  };

  const [before, after] = String(q.code).split("___");

  return (
    <form onSubmit={submit} className="stack" style={{ gap: 12 }}>
      <pre className="codeblock">
        {before}
        <span style={{ color: "#8ae57c" }}>{value || "___"}</span>
        {after}
      </pre>
      <div className="row">
        <input
          key={result && !result.ok ? result.n : "in"}
          className={"fill-input" + (result && !result.ok ? " fill-shake" : "")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type what goes in the blank"
          aria-label="Your answer"
          disabled={result?.ok}
          spellCheck="false"
          autoComplete="off"
        />
        <button className="btn" type="submit" disabled={!value.trim() || result?.ok}>
          Check
        </button>
      </div>
      {result && (
        <Verdict ok={result.ok} title={result.ok ? "Correct" : "Not yet — try again"}>
          {result.ok ? <Inline text={q.explain} /> : "Look closely at the line above and what it needs."}
        </Verdict>
      )}
    </form>
  );
}

/* ------------------------------------------------------------- Code task */

function CodeTask({ q, runner, onAnswered, onReact }) {
  const [code, setCode] = useState(q.starter || "");
  const [out, setOut] = useState({ output: "", error: null });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const execute = async () => {
    setBusy(true);
    setVerdict(null);
    setOut({ output: "", error: null });
    const fn = runner === "js" ? runJavascript : runPython;
    const res = await fn(code, { stdin: q.stdin || [], onStatus: setStatus });
    setStatus("");
    setOut({ output: res.warnings ? `${res.output}${res.output && !res.output.endsWith("\n") ? "\n" : ""}${res.warnings}` : res.output, error: res.error });
    setBusy(false);
    return res;
  };

  const run = async () => {
    onReact("thinking");
    await execute();
    onReact(null);
  };

  const check = async () => {
    onReact("thinking");
    const res = await execute();
    if (!res.ok) {
      setVerdict({ ok: false, message: "Your code hit an error before it finished. Read the message above — it usually names the line." });
      onAnswered(false);
      onReact("wrong");
      return;
    }
    const outcome = runChecks(q.checks, { source: stripComments(code, runner === "js" ? "js" : "python"), output: res.output });
    setVerdict({ ok: outcome.pass, message: outcome.message });
    onAnswered(outcome.pass);
    onReact(outcome.pass ? "right" : "wrong");
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <Editor value={code} onChange={setCode} language={runner === "js" ? "javascript" : "python"} />

      <div className="row">
        <button className="btn btn--ghost btn--sm" onClick={run} disabled={busy}>
          <Play size={13} /> Run
        </button>
        <button className="btn btn--sm" onClick={check} disabled={busy || !code.trim()}>
          <Check size={14} bold /> Check my answer
        </button>
        <button className="btn btn--quiet btn--sm" onClick={() => setShowHint((v) => !v)}>
          <Bulb size={14} /> {showHint ? "Hide hint" : "Hint"}
        </button>
        {busy && <span className="small muted">Running…</span>}
      </div>

      {showHint && (
        <div className="callout callout--tip">
          <div>
            <b>Hint</b>
            <Inline text={q.hint} />
          </div>
        </div>
      )}

      <Console output={out.output} error={out.error} status={status} />

      {verdict && (
        <Verdict ok={verdict.ok} title={verdict.ok ? "That works" : "Not there yet"}>
          <span style={{ whiteSpace: "pre-line" }}>
            {verdict.ok ? q.explain || "Nice — that is exactly what the exercise asked for." : verdict.message}
          </span>
        </Verdict>
      )}

      {verdict && !verdict.ok && (
        <div>
          <button className="btn btn--quiet btn--sm" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Hide one solution" : "Show one solution"}
          </button>
          {showSolution && (
            <div className="stack" style={{ gap: 6, marginTop: 8 }}>
              <pre className="codeblock">{q.solution}</pre>
              <p className="small muted">
                There is usually more than one right answer. If yours is different but produces the same
                output, it is just as correct.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
