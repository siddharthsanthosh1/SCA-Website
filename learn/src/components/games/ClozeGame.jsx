import { Fragment, useMemo, useState } from "react";
import Inline from "../Inline";
import Verdict from "../Verdict";
import { shuffle } from "./util";

/* Drag the tokens into the gaps. The tray always holds decoys — a tray where
   every token fits exactly one gap is a matching exercise, not a code one.

   Works three ways: drag a token onto a gap; tap a token then a gap (or a gap
   then a token); or Tab to them and press Enter. Tapping a filled gap sends
   its token back to the tray. */

export default function ClozeGame({ game, onResult, onReplay }) {
  const parts = useMemo(() => String(game.code).split("___"), [game.code]);
  const gaps = parts.length - 1;
  const tray = useMemo(() => shuffle(game.tray.map((text, id) => ({ text, id }))), [game.tray]);
  const [filled, setFilled] = useState(() => Array(gaps).fill(null)); // tray id per gap
  const [token, setToken] = useState(null); // tray id selected, waiting for a gap
  const [gap, setGap] = useState(null); // gap selected, waiting for a token
  const [result, setResult] = useState(null); // { ok, wrong: Set<gap> }
  const [revealed, setRevealed] = useState(false);
  const [announce, setAnnounce] = useState("");

  const done = result?.ok || revealed;
  const textOf = (id) => game.tray[id];
  const used = new Set(filled.filter((x) => x !== null));

  const place = (g, id) => {
    const next = filled.map((x) => (x === id ? null : x));
    next[g] = id;
    setFilled(next);
    setToken(null);
    setGap(null);
    setResult(null);
    setAnnounce(`Put “${textOf(id)}” in gap ${g + 1}.`);
  };

  const tapToken = (id) => {
    if (done) return;
    if (gap !== null) return place(gap, id);
    setToken(token === id ? null : id);
    setAnnounce(token === id ? "" : `Picked “${textOf(id)}”. Now choose a gap.`);
  };

  const tapGap = (g) => {
    if (done) return;
    if (token !== null) return place(g, token);
    if (filled[g] !== null) {
      const next = filled.slice();
      setAnnounce(`Took “${textOf(next[g])}” out of gap ${g + 1}.`);
      next[g] = null;
      setFilled(next);
      setResult(null);
      return;
    }
    setGap(gap === g ? null : g);
    setAnnounce(gap === g ? "" : `Gap ${g + 1} chosen. Now choose a token.`);
  };

  const check = () => {
    const wrong = new Set();
    filled.forEach((id, g) => {
      if (id === null || textOf(id) !== game.blanks[g]) wrong.add(g);
    });
    const ok = wrong.size === 0;
    setResult({ ok, wrong });
    setAnnounce(ok ? "Correct." : `${gaps - wrong.size} of ${gaps} gaps are right.`);
    // Only a finished game is recorded; a wrong check is just another try.
    if (ok) onResult(true);
  };

  const reveal = () => {
    // Fill each gap with a matching tray token, using each token once.
    const free = game.tray.map((t, id) => ({ t, id }));
    const answer = game.blanks.map((b) => {
      const k = free.findIndex((x) => x.t === b);
      return k >= 0 ? free.splice(k, 1)[0].id : null;
    });
    setFilled(answer);
    setRevealed(true);
    setResult(null);
  };

  const onDragStart = (id) => (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const onDrop = (g) => (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(id) && !done) place(g, id);
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <pre className="codeblock cloze__code">
        {parts.map((part, g) => (
          <Fragment key={g}>
            {part}
            {g < gaps && (
              <button
                type="button"
                className={
                  "gap" +
                  (filled[g] !== null ? " is-filled" : "") +
                  (gap === g ? " is-picked" : "") +
                  (result && !result.ok ? (result.wrong.has(g) ? " is-wrong" : " is-right") : "")
                }
                onClick={() => tapGap(g)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop(g)}
                disabled={done}
                aria-label={`Gap ${g + 1}: ${filled[g] !== null ? textOf(filled[g]) : "empty"}`}
              >
                {filled[g] !== null ? textOf(filled[g]) : "    "}
              </button>
            )}
          </Fragment>
        ))}
      </pre>

      <div className="tray" role="group" aria-label="Tokens">
        {tray.map(({ text, id }) => (
          <button
            key={id}
            type="button"
            className={"token" + (token === id ? " is-picked" : "")}
            draggable={!done && !used.has(id)}
            onDragStart={onDragStart(id)}
            onClick={() => tapToken(id)}
            disabled={done || used.has(id)}
            aria-pressed={token === id}
          >
            {text}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">{announce}</p>

      {!done && (
        <div className="row">
          <button className="btn btn--sm" onClick={check} disabled={filled.some((x) => x === null)}>Check</button>
          {result && !result.ok && (
            <button className="btn btn--quiet btn--sm" onClick={reveal}>Show me the answer</button>
          )}
          <span className="small muted">Drag a token into a gap, or tap one then the other.</span>
        </div>
      )}

      {result && !result.ok && (
        <Verdict ok={false} title={`${gaps - result.wrong.size} of ${gaps} gaps are right`}>
          The gaps outlined in red need a different token. Tap one to send its token back.
        </Verdict>
      )}

      {done && (
        <>
          <Verdict ok={!revealed} title={revealed ? "Here's the finished code" : "Every gap is right"}>
            <Inline text={game.explain} />
          </Verdict>
          <div className="row">
            <button className="btn btn--ghost btn--sm" onClick={onReplay}>Play again</button>
          </div>
        </>
      )}
    </div>
  );
}
