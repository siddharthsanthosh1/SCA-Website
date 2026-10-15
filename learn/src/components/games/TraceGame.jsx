import { useEffect, useRef, useState } from "react";
import Inline from "../Inline";
import Verdict from "../Verdict";
import { matchesFill } from "../../lib/checks";
import Line from "./Line";

/* Walk the program one line at a time, predicting as you go.

   This is how the courses without a compiler earn their depth: the student
   does the computer's job. Nothing about a step is shown until it has been
   predicted — the variable table and the output panel show the state *before*
   the current line until the student has answered, otherwise the answer would
   be sitting on screen next to the question. */

export default function TraceGame({ game, onResult, onReplay }) {
  const { steps, code } = game;
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState({}); // step → { ok, revealed, misses }
  const [draft, setDraft] = useState("");
  const [miss, setMiss] = useState(false);
  const [finished, setFinished] = useState(false);
  const input = useRef(null);
  const nextBtn = useRef(null);
  const reported = useRef(false);

  const step = steps[at];
  const resolved = (i) => !steps[i].ask || answers[i]?.ok || answers[i]?.revealed;
  const here = resolved(at);

  const shownState = here ? step.state || {} : at > 0 ? steps[at - 1].state || {} : {};
  const before = at > 0 ? steps[at - 1].state || {} : {};
  const output = steps
    .slice(0, here ? at + 1 : at)
    .filter((s) => s.output !== undefined && s.output !== null)
    .map((s) => s.output);

  const lastAt = useRef(at);
  useEffect(() => {
    // Don't grab focus when the game first appears on the page — only once the
    // student is actually stepping through it.
    if (lastAt.current === at) return;
    lastAt.current = at;
    setDraft("");
    setMiss(false);
    if (resolved(at)) nextBtn.current?.focus();
    else input.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    if (matchesFill(draft, step.ask.accept)) {
      setAnswers((a) => ({ ...a, [at]: { ...a[at], ok: true } }));
      setMiss(false);
      setTimeout(() => nextBtn.current?.focus(), 0);
    } else {
      setAnswers((a) => ({ ...a, [at]: { ...a[at], misses: (a[at]?.misses || 0) + 1 } }));
      setMiss(true);
    }
  };

  const reveal = () => {
    setAnswers((a) => ({ ...a, [at]: { ...a[at], revealed: true } }));
    setMiss(false);
    setTimeout(() => nextBtn.current?.focus(), 0);
  };

  const next = () => {
    if (at < steps.length - 1) setAt(at + 1);
    else {
      setFinished(true);
      if (!reported.current) {
        reported.current = true;
        // Counts as solved only if every prediction was the student's own.
        onResult(!Object.values(answers).some((a) => a.revealed));
      }
    }
  };

  const keys = Object.keys(shownState);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="trace">
        <ol className="trace__code" aria-label="Program">
          {code.map((line, i) => (
            <li key={i} className={i === step.line && !finished ? "is-current" : ""} aria-current={i === step.line && !finished ? "step" : undefined}>
              <span className="trace__num" aria-hidden="true">{i + 1}</span>
              <Line line={line} />
            </li>
          ))}
        </ol>

        <div className="trace__side">
          <div className="trace__panel">
            <span className="eyebrow">Variables</span>
            {keys.length === 0 ? (
              <p className="small muted">None yet.</p>
            ) : (
              <table className="trace__vars">
                <tbody>
                  {keys.map((k) => (
                    <tr key={k} className={here && JSON.stringify(before[k]) !== JSON.stringify(shownState[k]) ? "is-changed" : ""}>
                      <th scope="row"><code>{k}</code></th>
                      <td><code>{formatValue(shownState[k])}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="trace__panel">
            <span className="eyebrow">Output</span>
            <pre className="trace__out" aria-live="polite">{output.length ? output.join("\n") : " "}</pre>
          </div>
        </div>
      </div>

      {!finished && (
        <div className="trace__step stack" style={{ gap: 10 }}>
          <span className="small muted">Step {at + 1} of {steps.length} · line {step.line + 1}</span>

          {step.ask && !here && (
            <form className="stack" style={{ gap: 8 }} onSubmit={submit}>
              <label htmlFor={`${game.id}-ask`} className="q__prompt">
                <Inline text={step.ask.prompt} />
              </label>
              <div className="row">
                <input
                  id={`${game.id}-ask`}
                  ref={input}
                  className="fill-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Your prediction"
                />
                <button className="btn btn--sm" type="submit" disabled={!draft.trim()}>Check</button>
                {answers[at]?.misses > 0 && (
                  <button type="button" className="btn btn--quiet btn--sm" onClick={reveal}>Show me</button>
                )}
              </div>
            </form>
          )}

          <div aria-live="polite">
            {miss && !here && (
              <Verdict ok={false} title="Not quite">
                Look at the highlighted line and the variables as they are right now, then try again.
              </Verdict>
            )}
            {step.ask && here && (
              <Verdict ok={!answers[at]?.revealed} title={answers[at]?.revealed ? `The answer is ${step.ask.accept[0]}` : "Right"}>
                {step.note ? <Inline text={step.note} /> : null}
              </Verdict>
            )}
            {!step.ask && step.note && (
              <p className="small" style={{ color: "var(--text-2)" }}><Inline text={step.note} /></p>
            )}
          </div>

          <div className="row">
            <button className="btn btn--ghost btn--sm" onClick={() => setAt(at - 1)} disabled={at === 0}>Back</button>
            <button ref={nextBtn} className="btn btn--sm" onClick={next} disabled={!here}>
              {at < steps.length - 1 ? "Next line" : "Finish"}
            </button>
          </div>
        </div>
      )}

      {finished && (
        <>
          <Verdict ok title="Program finished">
            <Inline text={game.explain} />
          </Verdict>
          <div className="row">
            <button className="btn btn--ghost btn--sm" onClick={onReplay}>Trace it again</button>
          </div>
        </>
      )}
    </div>
  );
}

function formatValue(v) {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return "{" + v.map(formatValue).join(", ") + "}";
  return String(v);
}
