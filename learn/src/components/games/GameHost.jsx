import { useCallback, useState } from "react";
import Inline from "../Inline";
import { Check } from "../Icons";
import { useProgress } from "../../lib/progress";
import SortGame from "./SortGame";
import BugGame from "./BugGame";
import TraceGame from "./TraceGame";
import ClozeGame from "./ClozeGame";
import BlitzGame from "./BlitzGame";

/* Picks the game component for a `kind` and connects it to progress.

   Games save through the same progress.recordAnswer() as questions — the game
   id is the answer id — so they work signed in or out, and need no new
   Firestore fields or rules. Only a solved/unsolved flag is stored, never what
   the student dragged or typed. */

const GAMES = { sort: SortGame, bug: BugGame, trace: TraceGame, cloze: ClozeGame, blitz: BlitzGame };

const LABELS = {
  sort: "Put it in order",
  bug: "Find the bug",
  trace: "Trace the program",
  cloze: "Fill the gaps",
  blitz: "Blitz round",
};

const GAME_XP = 10;

/* A blitz personal best is stored as a solved answer under `<id>:best:<n>`,
   one entry each time the record goes up. It needs no change to the progress
   store and stays tiny: a student only beats their record a handful of times. */
const BEST_PREFIX = (id) => `${id}:best:`;

export function bestScore(progress, courseId, gameId) {
  const prefix = BEST_PREFIX(gameId);
  return Object.keys(progress.course(courseId).answers || {})
    .filter((k) => k.startsWith(prefix))
    .reduce((m, k) => Math.max(m, Number(k.slice(prefix.length)) || 0), 0);
}

export default function GameHost({ game, courseId }) {
  const progress = useProgress();
  const [round, setRound] = useState(0);
  const Game = GAMES[game.kind];
  const solved = Boolean(progress.answerOf(courseId, game.id)?.correct);
  const best = game.kind === "blitz" ? bestScore(progress, courseId, game.id) : 0;

  // Finishing a game pays Sparks once, the first time, whatever the score.
  // The header counter shows it; the card doesn't float a second "+15".
  const onResult = useCallback(
    (correct) => {
      progress.recordAnswer(courseId, game.id, correct, GAME_XP);
    },
    [progress, courseId, game.id]
  );

  const saveBest = useCallback(
    (score) => {
      if (score > bestScore(progress, courseId, game.id)) progress.recordAnswer(courseId, BEST_PREFIX(game.id) + score, true, 0);
    },
    [progress, courseId, game.id]
  );

  if (!Game) return null;

  return (
    <article className="card game" aria-labelledby={`${game.id}-title`} style={{ position: "relative" }}>
      <div className="spread">
        <span className="eyebrow">{LABELS[game.kind]}</span>
        {solved && (
          <span className="chip chip--green">
            <Check size={12} bold /> Solved
          </span>
        )}
      </div>
      <h3 id={`${game.id}-title`} className="h3">{game.title}</h3>
      {game.brief && <p className="q__prompt"><Inline text={game.brief} /></p>}
      <Game
        key={round}
        game={game}
        onResult={onResult}
        onReplay={() => setRound((r) => r + 1)}
        best={best}
        saveBest={saveBest}
      />
    </article>
  );
}
