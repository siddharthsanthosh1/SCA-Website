import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.(QUERY).matches);

/* CSS already switches every animation off under reduced motion. This hook is
   for the few things decided in JavaScript: whether to render confetti or a
   floating "+5" at all, and whether to wait for an animation before moving on. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}
