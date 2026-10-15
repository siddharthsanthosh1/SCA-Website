/* Scratch blocks drawn as coloured chips in the real category colours, so a
   kid can match what they read here to the palette in the Scratch editor.
   No screenshots: these stay sharp, scale with text size and are readable by
   screen readers. */

export const SCRATCH_CATS = ["motion", "looks", "sound", "events", "control", "sensing", "operators", "variables", "pen", "myblocks"];

const CAT_NAMES = {
  motion: "Motion", looks: "Looks", sound: "Sound", events: "Events", control: "Control",
  sensing: "Sensing", operators: "Operators", variables: "Variables", pen: "Pen", myblocks: "My Blocks",
};

export function ScratchChip({ cat, text }) {
  return (
    <span className={`sb sb--${cat}`} title={`${CAT_NAMES[cat] || ""} block`}>
      {text}
    </span>
  );
}

/* A whole script: one block per line, nesting shown by indent the way
   C-shaped blocks like `forever` wrap the blocks inside them. */
export function ScratchScript({ blocks, label }) {
  return (
    <ol className="sb-script" aria-label={label || "Scratch script"}>
      {blocks.map((b, i) => (
        <li key={i} style={{ "--indent": b.indent || 0 }}>
          <ScratchChip cat={b.cat} text={b.text} />
        </li>
      ))}
    </ol>
  );
}
