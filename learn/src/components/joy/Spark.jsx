import { useEffect, useState } from "react";
import { useReducedMotion } from "../../lib/motion";

/* The Sparks bolt. Always --spark, always this shape. */
export function Bolt({ size = 14, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={"bolt " + className} aria-hidden="true" focusable="false">
      <path d="M13.5 2 4.5 13.5h6.2L9.8 22l9.7-12.2h-6.4L13.5 2Z" fill="var(--spark)" stroke="#b06f00" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/* "180 ⚡" — the bolt is a picture, so the number also says "Sparks" to a
   screen reader. */
export function SparkAmount({ n, size = 14, className = "" }) {
  return (
    <span className={"sparkamt " + className}>
      <span aria-hidden="true">{n}</span>
      <Bolt size={size} />
      <span className="sr-only">{n} Sparks</span>
    </span>
  );
}

/* A tiny "+5 ⚡" that floats up and fades. Purely decorative — the real
   number changes in the header and is announced there. Not rendered at all
   under reduced motion. */
export function SparkFloat({ amount, id, className = "" }) {
  const reduced = useReducedMotion();
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    setAlive(true);
    const t = setTimeout(() => setAlive(false), 1100);
    return () => clearTimeout(t);
  }, [id]);
  if (!amount || !alive || reduced) return null;
  return (
    <span key={id} className={"sparkfloat " + className} aria-hidden="true">
      +{amount} <Bolt size={12} />
    </span>
  );
}
