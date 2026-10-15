/* Renders `code spans`, **bold** and *italics* inside lesson text, plus
   {{events:when green flag clicked}} for a Scratch block chip.
   Deliberately tiny — a full markdown parser would be overkill here. */

import { ScratchChip } from "./Scratch";

const TOKEN = /(\{\{(?:motion|looks|sound|events|control|sensing|operators|variables|pen|myblocks):[^}]+\}\}|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export default function Inline({ text }) {
  if (!text) return null;
  const parts = String(text).split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("{{") && p.endsWith("}}")) {
          const [cat, ...rest] = p.slice(2, -2).split(":");
          return <ScratchChip key={i} cat={cat} text={rest.join(":").trim()} />;
        }
        if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
