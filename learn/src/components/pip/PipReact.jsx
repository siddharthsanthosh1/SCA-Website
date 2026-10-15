import { useEffect, useMemo, useState } from "react";
import PipSays from "./PipSays";
import { pipLine } from "../../data/pip-lines";

/* Pip's reaction under a question. `react` is { kind, n }: kind is
   "thinking" | "right" | "wrong", and n changes on every new attempt so the
   same result twice still gets a fresh reaction and a fresh line.

   Cheering lasts ~1.2s then settles to happy; oops shakes once then settles.
   Nothing here ever blocks the student — it sits inline beside the answer. */

const SITUATION = { thinking: "thinking", right: "correct", wrong: "wrong" };
const SETTLE = { right: "happy", wrong: "idle", thinking: "thinking" };
const FIRST = { right: "cheering", wrong: "oops", thinking: "thinking" };

export default function PipReact({ react }) {
  const kind = react?.kind;
  const [mood, setMood] = useState(FIRST[kind] || "idle");
  const line = useMemo(() => (kind ? pipLine(SITUATION[kind]) : ""), [kind, react?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!kind) return;
    setMood(FIRST[kind]);
    if (kind === "thinking") return;
    const t = setTimeout(() => setMood(SETTLE[kind]), kind === "right" ? 1200 : 700);
    return () => clearTimeout(t);
  }, [kind, react?.n]);

  if (!kind) return null;
  return <PipSays key={react.n} mood={mood} line={line} size={52} className="pipsays--react" />;
}
