import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../../lib/motion";

/* CSS-only confetti: 24 pieces in three shapes (rectangle, dot, thin strip),
   each with its own position, start time, speed, spin, tumble and colour,
   falling once. No library, under 30 elements. Gone after ~3s, and never
   rendered under reduced motion. */

const COLOURS = ["var(--joy-grape)", "var(--joy-sky)", "var(--joy-mint)", "var(--joy-sun)", "var(--joy-coral)"];

const SHAPES = ["", " confetti__p--dot", " confetti__p--strip"];

export default function Confetti({ count = 24, id }) {
  const reduced = useReducedMotion();
  const [alive, setAlive] = useState(true);
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        // Staggered: a first burst, then stragglers over the next ~0.7s.
        delay: Math.random() < 0.5 ? Math.random() * 0.15 : 0.15 + Math.random() * 0.55,
        dur: 1.4 + Math.random() * 0.9,
        spin: (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 420),
        flip: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720),
        drift: (Math.random() - 0.5) * 120,
        colour: COLOURS[i % COLOURS.length],
        shape: SHAPES[i % SHAPES.length],
      })),
    [count, id] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(() => {
    setAlive(true);
    const t = setTimeout(() => setAlive(false), 3100);
    return () => clearTimeout(t);
  }, [id]);

  if (reduced || !alive) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          className={"confetti__p" + p.shape}
          style={{
            left: `${p.left}%`,
            background: p.colour,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            "--spin": `${p.spin}deg`,
            "--flip": `${p.flip}deg`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
