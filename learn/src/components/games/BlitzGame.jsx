import { useCallback, useEffect, useRef, useState } from "react";
import Inline from "../Inline";
import Verdict from "../Verdict";
import { shuffle } from "./util";

/* Sixty-second true/false round. The score is the hook; the results card is
   the lesson — every miss is listed with its explanation.

   A countdown is a barrier for some students (WCAG 2.2.1), so there is an
   untimed mode. It still shows the review, but doesn't set a personal best. */

const TICK_MS = 200;

/* The T / F keys belong to the round started last, so two blitz games on one
   page never both answer. */
let activeRound = null;

export default function BlitzGame({ game, onResult, onReplay, best, saveBest }) {
  const total = game.seconds || 60;
  const [phase, setPhase] = useState("intro"); // intro | play | done
  const [untimed, setUntimed] = useState(false);
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [left, setLeft] = useState(total);
  const [flash, setFlash] = useState(null); // "right" | "wrong"
  const endsAt = useRef(0);
  const firstBtn = useRef(null);
  const finished = useRef(false);
  const bestBefore = useRef(best);

  const finish = useCallback(
    (finalScore, finalMissed, answered, wasUntimed) => {
      if (finished.current) return;
      finished.current = true;
      setPhase("done");
      const accuracy = answered ? finalScore / answered : 0;
      // A round counts when it shows real understanding, not just speed.
      onResult(finalScore >= Math.min(8, game.items.length) && accuracy >= 0.75);
      if (!wasUntimed) saveBest(finalScore);
    },
    [game.items.length, onResult, saveBest]
  );

  const roundId = useRef({});

  const start = () => {
    activeRound = roundId.current;
    finished.current = false;
    bestBefore.current = best;
    setItems(shuffle(game.items));
    setIdx(0);
    setScore(0);
    setMissed([]);
    setLeft(total);
    setFlash(null);
    endsAt.current = Date.now() + total * 1000;
    setPhase("play");
    setTimeout(() => firstBtn.current?.focus(), 0);
  };

  // The clock. Driven off a deadline rather than counting ticks, so a busy
  // tab that drops a few ticks doesn't hand out extra time.
  useEffect(() => {
    if (phase !== "play" || untimed) return;
    const t = setInterval(() => {
      const remaining = Math.max(0, (endsAt.current - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) clearInterval(t);
    }, TICK_MS);
    return () => clearInterval(t);
  }, [phase, untimed]);

  useEffect(() => {
    if (phase === "play" && !untimed && left <= 0) finish(score, missed, idx, false);
  }, [left, phase, untimed, score, missed, idx, finish]);

  const answer = useCallback(
    (value) => {
      if (phase !== "play" || finished.current) return;
      const item = items[idx];
      const right = value === item.answer;
      const nextScore = score + (right ? 1 : 0);
      const nextMissed = right ? missed : [...missed, item];
      setScore(nextScore);
      setMissed(nextMissed);
      setFlash(right ? "right" : "wrong");
      if (idx + 1 >= items.length) finish(nextScore, nextMissed, idx + 1, untimed);
      else setIdx(idx + 1);
    },
    [phase, items, idx, score, missed, untimed, finish]
  );

  // T / F shortcuts while a round is running.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e) => {
      // Holding a key down would otherwise answer item after item.
      if (e.repeat || activeRound !== roundId.current) return;
      if (e.target.closest?.("input, textarea, .cm-editor")) return;
      if (e.key === "t" || e.key === "T") answer(true);
      if (e.key === "f" || e.key === "F") answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answer]);

  if (phase === "intro")
    return (
      <div className="stack" style={{ gap: 12 }}>
        <p className="small muted">
          {game.items.length} statements. Decide if each one is true or false as fast as you can.
          {best > 0 ? ` Your best: ${best}.` : ""}
        </p>
        <label className="row small" style={{ gap: 8 }}>
          <input type="checkbox" checked={untimed} onChange={(e) => setUntimed(e.target.checked)} />
          No timer — go at my own pace
        </label>
        <div className="row">
          <button className="btn btn--sm" onClick={start}>Start{untimed ? "" : ` (${total} seconds)`}</button>
        </div>
      </div>
    );

  if (phase === "play") {
    const item = items[idx];
    return (
      <div className="stack" style={{ gap: 12 }}>
        <div className="spread">
          <span className="small" aria-live="polite">
            Score <strong>{score}</strong> · {idx + 1} of {items.length}
          </span>
          {!untimed && <span className="small muted">{Math.ceil(left)}s</span>}
        </div>
        {!untimed && (
          <div
            className="blitz__timer"
            role="progressbar"
            aria-label="Time left"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={Math.ceil(left)}
          >
            <div className="blitz__timer-fill" style={{ width: `${(left / total) * 100}%` }} />
          </div>
        )}
        <div className={"blitz__card" + (flash ? ` flash-${flash}` : "")} key={idx}>
          <p className="q__prompt"><Inline text={item.prompt} /></p>
        </div>
        <div className="blitz__answers">
          <button ref={firstBtn} className="btn btn--ghost" onClick={() => answer(true)}>
            True <kbd>T</kbd>
          </button>
          <button className="btn btn--ghost" onClick={() => answer(false)}>
            False <kbd>F</kbd>
          </button>
        </div>
      </div>
    );
  }

  const answered = score + missed.length;
  const newBest = !untimed && score > bestBefore.current;
  return (
    <div className="stack" style={{ gap: 12 }} aria-live="polite">
      <div className="blitz__result">
        <strong className="h2" style={{ color: "var(--text)" }}>{score}</strong>
        <span className="small muted">
          right out of {answered} answered{untimed ? " · untimed" : ""}
          {newBest ? " · new personal best" : best > 0 && !untimed ? ` · your best is ${best}` : ""}
        </span>
      </div>
      {missed.length === 0 ? (
        <Verdict ok title="No misses">Every answer you gave was right.</Verdict>
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">Worth another look</span>
          {missed.map((m, i) => (
            <div key={i} className="blitz__miss">
              <p><Inline text={m.prompt} /></p>
              <p className="small">
                <strong>{m.answer ? "True" : "False"}.</strong> <Inline text={m.explain} />
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="row">
        <button className="btn btn--ghost btn--sm" onClick={onReplay}>Play again</button>
      </div>
    </div>
  );
}
