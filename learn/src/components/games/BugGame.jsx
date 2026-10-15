import { useState } from "react";
import Inline from "../Inline";
import Verdict from "../Verdict";
import Line, { lineText } from "./Line";

/* Find the broken line. Every wrong click gets its own hint — the point is
   that a student who picks a fine line learns why it's fine. */

export default function BugGame({ game, onResult, onReplay }) {
  const [tried, setTried] = useState([]); // wrong lines clicked, most recent last
  const [found, setFound] = useState(false);

  const pick = (i) => {
    if (found) return;
    if (i === game.buggyLine) {
      setFound(true);
      onResult(true);
    } else {
      // Not reported: the game is only recorded once it ends.
      setTried((t) => [...t.filter((x) => x !== i), i]);
    }
  };

  const last = tried[tried.length - 1];

  return (
    <div className="stack" style={{ gap: 12 }}>
      <ol className="buglist" aria-label="Click the line with the bug">
        {game.code.map((line, i) => {
          const state = found && i === game.buggyLine ? " is-bug" : tried.includes(i) ? " is-fine" : "";
          return (
            <li key={i}>
              <button
                type="button"
                className={"bugline" + state}
                onClick={() => pick(i)}
                disabled={found}
                aria-label={`Line ${i + 1}: ${lineText(line)}${state === " is-fine" ? " — not this one" : ""}`}
              >
                <span className="bugline__num" aria-hidden="true">{i + 1}</span>
                <Line line={line} />
              </button>
            </li>
          );
        })}
      </ol>

      <div aria-live="polite">
        {!found && last !== undefined && (
          <Verdict ok={false} title={`Line ${last + 1} is fine`}>
            <Inline text={game.wrongLineHints[last]} />
          </Verdict>
        )}
        {found && (
          <Verdict ok title={`Found it — line ${game.buggyLine + 1}`}>
            <Inline text={game.explain} />
          </Verdict>
        )}
      </div>

      {found && (
        <div className="row">
          <button className="btn btn--ghost btn--sm" onClick={onReplay}>Play again</button>
        </div>
      )}
    </div>
  );
}
