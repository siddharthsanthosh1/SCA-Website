import { useRef, useState } from "react";
import Inline from "./Inline";
import Editor from "./Editor";
import WebPreview from "./WebPreview";
import Verdict from "./Verdict";
import { Check, Bulb } from "./Icons";
import { runChecks, stripComments } from "../lib/checks";
import { PANE_LABELS, needsLiveFrame, parseDocument } from "../lib/runWeb";

const EDITOR_LANG = { html: "html", css: "css", js: "javascript" };

/* A web exercise: up to three code panes and the live page under them.
   Graded against the parsed HTML for structure, and against the live frame for
   anything that needs CSS applied or JavaScript run first. `q.actions` lets a
   question click or type into the page before it is checked, which is how the
   event-handler lessons get marked. */
export default function WebTask({ q, onAnswered }) {
  const panes = q.panes;
  const blank = { html: "", css: "", js: "" };
  const [code, setCode] = useState(() => ({ ...blank, ...q.starter }));
  const [active, setActive] = useState(panes[0]);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const preview = useRef(null);

  const edit = (value) => setCode((c) => ({ ...c, [active]: value }));

  const check = async () => {
    setBusy(true);
    setVerdict(null);
    const finish = (ok, message) => {
      setVerdict({ ok, message });
      setBusy(false);
      onAnswered(ok);
    };

    const loaded = await preview.current.renderNow(code);
    if (!loaded) return finish(false, "Your page didn't finish loading. If your JavaScript has a loop, make sure it can end.");

    const query = ({ selector, style, equals, attr, layout }) => ({ selector, style, equals, attr, layout });
    const liveChecks = q.checks.filter(needsLiveFrame);
    const inFrame = liveChecks.filter((c) => c.viewport === undefined);
    const sized = liveChecks.filter((c) => c.viewport !== undefined);
    let live = null;
    if (inFrame.length || q.actions?.length) {
      const reply = await preview.current.probe(inFrame.map(query), q.actions || []);
      if (reply?.actionError) return finish(false, reply.actionError);
      live = new Map();
      if (reply) inFrame.forEach((c, i) => live.set(c, reply.results[i]));
    }
    // Checks about a particular screen width render the page offscreen at
    // that width, so they don't depend on how wide this student's screen is.
    for (const width of new Set(sized.map((c) => c.viewport))) {
      const group = sized.filter((c) => c.viewport === width);
      const reply = await preview.current.probeAt(code, width, group.map(query));
      live ||= new Map();
      if (reply) group.forEach((c, i) => live.set(c, reply.results[i]));
    }

    const error = preview.current.error();
    if (error && panes.includes("js"))
      return finish(false, "Your JavaScript hit an error. Read the red message under the preview — it usually names the line.");

    const source = panes.map((p) => stripComments(code[p], p)).join("\n");
    const outcome = runChecks(q.checks, { source, output: preview.current.output(), doc: parseDocument(code), live });
    finish(outcome.pass, outcome.message);
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      {panes.length > 1 && (
        <div className="panes" role="tablist" aria-label="Code panes">
          {panes.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={active === p}
              className={"panes__tab" + (active === p ? " active" : "")}
              onClick={() => setActive(p)}
            >
              {PANE_LABELS[p]}
            </button>
          ))}
        </div>
      )}

      <Editor
        key={active}
        value={code[active]}
        onChange={edit}
        language={EDITOR_LANG[active]}
        label={`Your ${PANE_LABELS[active]}`}
      />

      <div className="row">
        <button className="btn btn--sm" onClick={check} disabled={busy}>
          <Check size={14} bold /> Check my answer
        </button>
        <button className="btn btn--quiet btn--sm" onClick={() => setShowHint((v) => !v)}>
          <Bulb size={14} /> {showHint ? "Hide hint" : "Hint"}
        </button>
        <button
          className="btn btn--quiet btn--sm"
          onClick={() => {
            setCode({ ...blank, ...q.starter });
            setVerdict(null);
          }}
        >
          Start over
        </button>
        {busy && <span className="small muted">Checking…</span>}
      </div>

      {showHint && (
        <div className="callout callout--tip">
          <div>
            <b>Hint</b>
            <Inline text={q.hint} />
          </div>
        </div>
      )}

      <WebPreview ref={preview} code={code} />

      {verdict && (
        <Verdict ok={verdict.ok} title={verdict.ok ? "That works" : "Not there yet"}>
          {verdict.ok ? <Inline text={q.explain || "Nice — that is exactly what the exercise asked for."} /> : <Inline text={verdict.message} />}
        </Verdict>
      )}

      {verdict && !verdict.ok && (
        <div>
          <button className="btn btn--quiet btn--sm" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Hide one solution" : "Show one solution"}
          </button>
          {showSolution && (
            <div className="stack" style={{ gap: 8, marginTop: 8 }}>
              {panes.map((p) =>
                q.solution[p] ? (
                  <div key={p} className="stack" style={{ gap: 4 }}>
                    <span className="eyebrow">{PANE_LABELS[p]}</span>
                    <pre className="codeblock">{q.solution[p]}</pre>
                  </div>
                ) : null
              )}
              <p className="small muted">
                There is usually more than one right answer. If yours is different but the checks pass, it is
                just as correct.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
