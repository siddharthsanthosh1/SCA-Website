import { ScratchChip } from "../Scratch";

/* A line of a game's program. Usually a string of code; for Scratch it can be
   { text, cat, indent } and is drawn as a coloured block. */

export const lineText = (line) => (typeof line === "string" ? line : line.text);

export default function Line({ line }) {
  if (typeof line === "string") return <code>{line || " "}</code>;
  return (
    <span style={{ paddingLeft: `${(line.indent || 0) * 1.6}em` }}>
      <ScratchChip cat={line.cat} text={line.text} />
    </span>
  );
}
