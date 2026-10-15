import { useEffect, useMemo, useRef, useState } from "react";
import Inline from "../Inline";
import Verdict from "../Verdict";
import { ScratchChip } from "../Scratch";
import { shuffleAway } from "./util";

/* Put the code in order.

   Three ways to move a line, because drag-and-drop alone shuts people out:
   - drag it (mouse, trackpad)
   - tap it, then tap where it should go (phones, where HTML5 drag is unreliable)
   - the ↑ ↓ buttons on every row (keyboard, switch access, Chromebooks)

   Lines are compared by text and indent, so two identical `}` lines are
   interchangeable and either order counts as right. */

const key = (l) => `${l.indent || 0}|${l.text}`;

export default function SortGame({ game, onResult, onReplay }) {
  const lines = game.lines;
  const answer = useMemo(() => lines.map(key), [lines]);
  const [order, setOrder] = useState(() =>
    shuffleAway(lines.map((_, i) => i), (a) => a.every((li, pos) => key(lines[li]) === answer[pos]))
  );
  const [picked, setPicked] = useState(null); // position chosen by tap, waiting for a destination
  const [dragFrom, setDragFrom] = useState(null);
  const [result, setResult] = useState(null); // { ok, right: Set<pos> } after Check
  const [revealed, setRevealed] = useState(false);
  const [announce, setAnnounce] = useState("");
  const focusAfter = useRef(null);
  const rows = useRef([]);

  useEffect(() => {
    if (!focusAfter.current) return;
    const { pos, part } = focusAfter.current;
    const row = rows.current[pos];
    // At the top or bottom the arrow just pressed is now disabled, and
    // focusing it would drop keyboard focus — use the other arrow instead.
    const btn = row?.querySelector(`[data-part="${part}"]`);
    (btn && !btn.disabled ? btn : row?.querySelector('[data-part="up"]:not(:disabled), [data-part="down"]:not(:disabled)'))?.focus();
    focusAfter.current = null;
  });

  const done = result?.ok || revealed;

  const move = (from, to, part = "line") => {
    if (to < 0 || to >= order.length || from === to) return;
    const next = order.slice();
    const [li] = next.splice(from, 1);
    next.splice(to, 0, li);
    setOrder(next);
    setResult(null);
    setPicked(null);
    focusAfter.current = { pos: to, part };
    setAnnounce(`Moved “${lines[li].text}” to line ${to + 1} of ${order.length}.`);
  };

  const tap = (pos) => {
    if (done) return;
    if (picked === null) {
      setPicked(pos);
      setAnnounce(`Picked up “${lines[order[pos]].text}”. Now choose the line whose place it should take, or choose it again to put it back.`);
    } else if (picked === pos) {
      setPicked(null);
      setAnnounce("Put it back.");
    } else move(picked, pos);
  };

  const check = () => {
    const right = new Set(order.map((li, pos) => (key(lines[li]) === answer[pos] ? pos : -1)).filter((p) => p >= 0));
    const ok = right.size === order.length;
    setResult({ ok, right });
    setPicked(null);
    setAnnounce(ok ? "Correct — every line is in place." : `${right.size} of ${order.length} lines are in the right place.`);
    // Only a finished game is recorded; a wrong check is just another try.
    if (ok) onResult(true);
  };

  const reveal = () => {
    setOrder(lines.map((_, i) => i));
    setRevealed(true);
    setResult(null);
    setAnnounce("Here is the working order.");
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <ol className="sortlist" aria-label="Lines to put in order">
        {order.map((li, pos) => {
          const line = lines[li];
          const state = result && !result.ok ? (result.right.has(pos) ? " is-right" : " is-wrong") : "";
          return (
            <li
              key={li}
              ref={(el) => (rows.current[pos] = el)}
              className={"sortrow" + state + (picked === pos ? " is-picked" : "") + (dragFrom === pos ? " is-dragging" : "")}
              draggable={!done}
              onDragStart={(e) => {
                setDragFrom(pos);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(pos));
              }}
              onDragEnd={() => setDragFrom(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragFrom !== null) move(dragFrom, pos);
                setDragFrom(null);
              }}
            >
              <span className="sortrow__num" aria-hidden="true">{pos + 1}</span>
              <button
                type="button"
                data-part="line"
                className="sortrow__line"
                style={{ "--indent": line.indent || 0 }}
                onClick={() => tap(pos)}
                disabled={done}
                aria-pressed={picked === pos}
                aria-label={`Line ${pos + 1}: ${line.text}${line.indent ? `, indented ${line.indent}` : ""}${state === " is-wrong" ? ", in the wrong place" : ""}`}
              >
                {line.cat ? <ScratchChip cat={line.cat} text={line.text} /> : <code>{line.text}</code>}
              </button>
              <span className="sortrow__moves">
                <button
                  type="button"
                  data-part="up"
                  className="iconbtn"
                  onClick={() => move(pos, pos - 1, "up")}
                  disabled={done || pos === 0}
                  aria-label={`Move “${line.text}” up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  data-part="down"
                  className="iconbtn"
                  onClick={() => move(pos, pos + 1, "down")}
                  disabled={done || pos === order.length - 1}
                  aria-label={`Move “${line.text}” down`}
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="sr-only" aria-live="polite">{announce}</p>

      {!done && (
        <div className="row">
          <button className="btn btn--sm" onClick={check}>Check the order</button>
          {result && !result.ok && (
            <button className="btn btn--quiet btn--sm" onClick={reveal}>Show me the answer</button>
          )}
          <span className="small muted">Drag a line, tap it then tap where it goes, or use the arrows.</span>
        </div>
      )}

      {result && !result.ok && (
        <Verdict ok={false} title={`${result.right.size} of ${order.length} lines are in the right place`}>
          The lines marked in red need to move. Think about what has to exist before each line can run.
        </Verdict>
      )}

      {done && (
        <>
          <Verdict ok={!revealed} title={revealed ? "Here's the working order" : "That's the right order"}>
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
