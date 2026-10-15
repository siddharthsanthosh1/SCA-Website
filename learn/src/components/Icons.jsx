const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const Check = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} strokeWidth={p.bold ? 2.6 : 2.2} aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);
export const Play = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);
export const Arrow = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Back = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Bulb = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.3.2.5.6.5 1V16h6v-1.1c0-.4.2-.8.5-1A6 6 0 0 0 12 3Z" />
  </svg>
);
export const Flame = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <path d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-1.7.8-3 1.6-4 .2 1 .8 1.8 1.7 2 0-2.6.7-5.3 1.7-7Z" />
  </svg>
);
export const Spark = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);
export const Lock = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} aria-hidden="true">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
  </svg>
);
export const Cross = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} strokeWidth={2.6} aria-hidden="true">
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </svg>
);
export const Retry = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} strokeWidth={2.2} aria-hidden="true">
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4" />
  </svg>
);
