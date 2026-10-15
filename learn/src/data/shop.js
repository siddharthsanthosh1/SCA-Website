/* ---------------------------------------------------------------------------
   The Workshop catalogue.

   Sparks are earned by learning and never bought. Nothing in here costs money,
   nothing is random, and nothing is ever "limited" — a child always sees
   exactly what they get and exactly what it costs before they spend.

   Item shape:
     { id, slot, name, price, draw(opts) → shapes, lock?, ... }

   slot   "body" | "hat" | "eyes" | "pack" | "trail" | "town"
   price  Sparks. 0 means free and owned from the start.
   draw   returns a shape list (see data/art.js).
            hat / pack / eyes draw in Pip's own frame (viewBox 0 -16 120 156),
            so the same drawing is used on Pip and on the shop card.
            pack:  draw({ layer: "back" | "front" }) — no layer = everything
            eyes:  draw({ cx, cy }) once per eye; `overlay` items draw once
            trail: one particle centred on 0,0
            town:  a frame `w` × `h` with the ground at y = h
   smallVariant  optional; same arguments and frame as draw. Used instead of
            draw whenever Pip is drawn under 64px (walking in Byteville,
            reacting to an answer) — one bold silhouette that still reads
            at that size, rather than the detailed drawing shrunk to specks.
   lock   { courseId, topicId? } or { anyCourses: n } — the item only becomes
          buyable after that real progress. Locks are about learning, never
          about spending more.

   To add an item: append it below with a unique id, then run
   `npm run check:content` (checks ids, slots, prices and that it draws) and
   `npm run check:economy` (checks the shop is still affordable).
   --------------------------------------------------------------------------- */

import { INK, g, rect, circle, ellipse, path, line, ocircle, orect, opath, starPath } from "./art.js";

export const SLOTS = [
  { id: "body", title: "Pip's colour" },
  { id: "hat", title: "Hats" },
  { id: "eyes", title: "Eyes" },
  { id: "pack", title: "Backpacks" },
  { id: "trail", title: "Trails" },
  { id: "town", title: "Byteville decorations" },
];

export const PIP_EYE = "#e9f6ff";
export const PIP_SCREEN = "#22324a";

/* ------------------------------------------------------------ body colours */

const body = (id, name, fill, dark, price = 40) => ({
  id: `body-${id}`, slot: "body", name, price, colors: { body: fill, dark },
  draw: () => [ocircle(20, 20, 16, fill, 2), ellipse(15, 15, 4, 3, "rgba(255,255,255,0.45)")],
});

const bodies = [
  body("classic", "Classic Blue", "#5aa9ff", "#2a62b8", 0),
  body("mint", "Mint", "#5fdcbc", "#1f8f74"),
  body("grape", "Grape", "#a08bff", "#5a3fd1"),
  body("coral", "Coral", "#ff8f8f", "#c94848"),
  body("sunshine", "Sunshine", "#ffcb52", "#b07a00"),
  body("snow", "Snow", "#f4f6fa", "#8a96a8"),
  body("charcoal", "Charcoal", "#5b6573", "#262f3b"),
];

/* -------------------------------------------------------------------- hats */

const hats = [
  {
    id: "hat-cap", slot: "hat", name: "Cap", price: 60, hidesAntenna: true,
    draw: () => [
      opath("M58 30 Q90 24 106 32 Q92 38 58 35 Z", "#1f8fd0"),
      opath("M30 34 Q30 8 60 8 Q90 8 90 34 Z", "var(--joy-sky)"),
      circle(60, 9, 3, "#1f8fd0"),
    ],
  },
  {
    id: "hat-beanie", slot: "hat", name: "Beanie", price: 60, hidesAntenna: true,
    draw: () => [
      opath("M28 36 Q28 6 60 6 Q92 6 92 36 Z", "var(--joy-coral)"),
      orect(25, 27, 70, 11, "#e04f4f", 5.5),
      ocircle(60, 4, 6, "#fff4e0"),
    ],
  },
  {
    id: "hat-party", slot: "hat", name: "Party Hat", price: 90, hidesAntenna: true,
    draw: () => [
      opath("M38 31 L60 -16 L82 31 Z", "var(--joy-grape)"),
      path("M46 16 L69 3 M42 26 L77 9", "none", { stroke: "var(--joy-sun)", strokeWidth: 3.5, strokeLinecap: "round" }),
      ocircle(60, -17, 5.5, "var(--joy-sun)"),
    ],
  },
  {
    id: "hat-hard", slot: "hat", name: "Hard Hat", price: 90, hidesAntenna: true,
    draw: () => [
      opath("M32 30 Q32 6 60 6 Q88 6 88 30 Z", "var(--joy-sun)"),
      orect(55, 4, 10, 24, "#e69500", 5),
      orect(21, 27, 78, 8, "#e69500", 4),
    ],
  },
  {
    id: "hat-headphones", slot: "hat", name: "Headphones", price: 150,
    draw: () => [
      path("M22 54 Q22 12 60 12 Q98 12 98 54", "none", { stroke: INK, strokeWidth: 7, strokeLinecap: "round" }),
      path("M22 54 Q22 12 60 12 Q98 12 98 54", "none", { stroke: "#5b6573", strokeWidth: 3.5, strokeLinecap: "round" }),
      orect(13, 40, 14, 24, "var(--joy-coral)", 6),
      orect(93, 40, 14, 24, "var(--joy-coral)", 6),
    ],
  },
  {
    id: "hat-crown", slot: "hat", name: "Crown", price: 300, lock: { courseId: "python", topicId: "t6" },
    draw: () => [
      opath("M34 27 L33 5 L46 16 L60 -1 L74 16 L87 5 L86 27 Z", "var(--joy-sun)"),
      circle(46, 22, 3, "var(--joy-coral)"),
      circle(60, 21, 3.4, "var(--joy-sky)"),
      circle(74, 22, 3, "var(--joy-mint)"),
    ],
  },
  {
    id: "hat-astronaut", slot: "hat", name: "Astronaut Helmet", price: 400, lock: { courseId: "python" },
    draw: () => [
      circle(60, 51, 41, "rgba(214,236,255,0.32)", { stroke: "#b9c8da", strokeWidth: 5 }),
      circle(60, 51, 41, "none", { stroke: INK, strokeWidth: 1.5 }),
      path("M31 34 Q38 20 54 15", "none", { stroke: "#fff", strokeWidth: 4, strokeLinecap: "round", opacity: 0.9 }),
      orect(38, 86, 44, 8, "#b9c8da", 4),
    ],
  },
];

/* -------------------------------------------------------------------- eyes */

const eyes = [
  {
    id: "eyes-round", slot: "eyes", name: "Round", price: 0,
    draw: ({ cx = 20, cy = 20 } = {}) => [circle(cx, cy, 5.5, PIP_EYE)],
  },
  {
    id: "eyes-sleepy", slot: "eyes", name: "Sleepy", price: 50,
    // A heavy lid that droops in a downward curve, with the eye peeking out
    // underneath. (A flat lid line reads as annoyed, not sleepy.)
    draw: ({ cx = 20, cy = 20 } = {}) => [
      circle(cx, cy + 1.5, 4.8, PIP_EYE),
      path(`M${cx - 7.5} ${cy - 8} H${cx + 7.5} V${cy - 1.5} Q${cx} ${cy + 5} ${cx - 7.5} ${cy - 1.5} Z`, PIP_SCREEN),
      path(`M${cx - 6.8} ${cy - 1.5} Q${cx} ${cy + 4.6} ${cx + 6.8} ${cy - 1.5}`, "none", { stroke: PIP_EYE, strokeWidth: 1.9, strokeLinecap: "round" }),
    ],
    smallVariant: ({ cx = 20, cy = 20 } = {}) => [
      path(`M${cx - 6.5} ${cy - 1.5} Q${cx} ${cy + 6.5} ${cx + 6.5} ${cy - 1.5}`, "none", { stroke: PIP_EYE, strokeWidth: 3.8, strokeLinecap: "round" }),
    ],
  },
  {
    id: "eyes-star", slot: "eyes", name: "Star Eyes", price: 120,
    draw: ({ cx = 20, cy = 20 } = {}) => [path(starPath(cx, cy, 7.5, 3.4), "var(--joy-sun)")],
    smallVariant: ({ cx = 20, cy = 20 } = {}) => [path(starPath(cx, cy + 0.5, 9.5, 4.8), "var(--joy-sun)")],
  },
  {
    id: "eyes-visor", slot: "eyes", name: "Visor", price: 180, overlay: true,
    draw: () => [
      rect(32, 41, 56, 16, "rgba(43,179,243,0.55)", { rx: 8, stroke: "var(--joy-sky)", strokeWidth: 2 }),
      line(38, 45, 50, 45, "#fff", 2, { opacity: 0.8 }),
    ],
  },
  {
    id: "eyes-rainbow", slot: "eyes", name: "Rainbow", price: 350,
    draw: ({ cx = 20, cy = 20 } = {}) => [
      circle(cx, cy, 6.5, "var(--joy-coral)"),
      circle(cx, cy, 4.9, "var(--joy-sun)"),
      circle(cx, cy, 3.3, "var(--joy-mint)"),
      circle(cx, cy, 1.7, "var(--joy-sky)"),
    ],
    // Four rings blur into one muddy dot when small; two bold ones don't.
    smallVariant: ({ cx = 20, cy = 20 } = {}) => [
      circle(cx, cy, 8, "var(--joy-coral)"),
      circle(cx, cy, 4, "var(--joy-sky)"),
    ],
  },
];

/* ---------------------------------------------------------------- backpacks */

const packs = [
  {
    id: "pack-satchel", slot: "pack", name: "Satchel", price: 80,
    draw: ({ layer } = {}) => [
      ...(layer === "back" ? [] : [
        path("M42 84 L84 110", "none", { stroke: "#8a5a2b", strokeWidth: 4, strokeLinecap: "round" }),
        orect(79, 103, 20, 16, "#d4935a", 4),
        opath("M79 107 Q89 113 99 107 L99 103 L79 103 Z", "#b97638", 1.5),
      ]),
    ],
    // A bigger bag on a thick strap, so it reads as a bag and not a smudge.
    smallVariant: ({ layer } = {}) => [
      ...(layer === "back" ? [] : [
        path("M40 82 L86 112", "none", { stroke: "#8a5a2b", strokeWidth: 7, strokeLinecap: "round" }),
        orect(74, 99, 32, 25, "#d4935a", 6, 2.6),
        opath("M74 106 Q90 116 106 106 L106 99 L74 99 Z", "#a8662c", 2.2),
      ]),
    ],
  },
  {
    id: "pack-jetpack", slot: "pack", name: "Jetpack", price: 250,
    draw: ({ layer } = {}) => [
      ...(layer === "front" ? [] : [
        orect(16, 86, 88, 10, "#b9c3cf", 4),
        path("M8 110 Q14 128 20 110 Z M100 110 Q106 128 112 110 Z", "var(--joy-coral)"),
        path("M10.5 110 Q14 121 17.5 110 Z M102.5 110 Q106 121 109.5 110 Z", "var(--joy-sun)"),
        orect(5, 78, 18, 34, "#d5dce6", 8),
        orect(97, 78, 18, 34, "#d5dce6", 8),
        rect(5, 90, 18, 5, "var(--joy-coral)"),
        rect(97, 90, 18, 5, "var(--joy-coral)"),
      ]),
    ],
  },
  {
    id: "pack-wings", slot: "pack", name: "Wings", price: 350,
    draw: ({ layer } = {}) => [
      ...(layer === "front" ? [] : [
        opath("M42 90 C 22 66, 2 78, 6 100 C 14 97, 20 104, 40 104 Z", "#ffffff"),
        opath("M78 90 C 98 66, 118 78, 114 100 C 106 97, 100 104, 80 104 Z", "#ffffff"),
        path("M14 88 Q26 90 38 96 M106 88 Q94 90 82 96", "none", { stroke: "var(--joy-grape)", strokeWidth: 1.6, strokeLinecap: "round" }),
      ]),
    ],
  },
  {
    id: "pack-shell", slot: "pack", name: "Turtle Shell", price: 200,
    draw: ({ layer } = {}) => [
      ...(layer === "front" ? [] : [
        ellipse(60, 100, 45, 33, "var(--joy-mint)", { stroke: INK, strokeWidth: 2 }),
        path("M18 88 L30 96 L19 110 M102 88 L90 96 L101 110 M24 78 L36 84 M96 78 L84 84", "none", { stroke: "#1f8f74", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" }),
      ]),
      ...(layer === "back" ? [] : [
        path("M40 84 Q46 96 40 112 M80 84 Q74 96 80 112", "none", { stroke: "#1f8f74", strokeWidth: 3.5, strokeLinecap: "round" }),
      ]),
    ],
    // A wider dome that stands well clear of Pip's arms, with a heavy rim.
    smallVariant: ({ layer } = {}) => [
      ...(layer === "front" ? [] : [
        ellipse(60, 98, 55, 40, "var(--joy-mint)", { stroke: "#1f6f5c", strokeWidth: 4.5 }),
        path("M10 92 L28 98 M110 92 L92 98 M30 66 L42 78 M90 66 L78 78", "none", { stroke: "#1f6f5c", strokeWidth: 4.5, strokeLinecap: "round" }),
      ]),
      ...(layer === "back" ? [] : [
        path("M40 84 Q46 96 40 112 M80 84 Q74 96 80 112", "none", { stroke: "#1f6f5c", strokeWidth: 6, strokeLinecap: "round" }),
      ]),
    ],
  },
];

/* ------------------------------------------------------------------ trails */

const trails = [
  {
    id: "trail-bubbles", slot: "trail", name: "Bubbles", price: 150,
    draw: () => [circle(0, 0, 4.5, "rgba(43,179,243,0.18)", { stroke: "var(--joy-sky)", strokeWidth: 1.6 }), circle(-1.4, -1.6, 1.1, "#fff")],
    smallVariant: () => [circle(0, 0, 9, "rgba(43,179,243,0.35)", { stroke: "var(--joy-sky)", strokeWidth: 3.2 }), circle(-3, -3, 2.4, "#fff")],
  },
  {
    id: "trail-sparkles", slot: "trail", name: "Sparkles", price: 200,
    draw: () => [path("M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z", "var(--joy-sun)")],
    smallVariant: () => [path("M0 -12 L3.5 -3.5 L12 0 L3.5 3.5 L0 12 L-3.5 3.5 L-12 0 L-3.5 -3.5 Z", "var(--joy-sun)", { stroke: "#b06f00", strokeWidth: 1.6, strokeLinejoin: "round" })],
  },
  {
    id: "trail-leaves", slot: "trail", name: "Leaves", price: 200,
    draw: () => [path("M-5 3 Q-1 -7 6 -4 Q3 5 -5 3 Z", "var(--joy-mint)", { stroke: "#1f8f74", strokeWidth: 1 })],
    smallVariant: () => [path("M-10 6 Q-2 -14 12 -8 Q6 10 -10 6 Z", "var(--joy-mint)", { stroke: "#1f6f5c", strokeWidth: 2.4, strokeLinejoin: "round" })],
  },
  {
    id: "trail-stars", slot: "trail", name: "Stars", price: 400,
    draw: () => [path(starPath(0, 0, 6, 2.8), "var(--joy-grape)")],
    smallVariant: () => [path(starPath(0, 0, 11.5, 5.6), "var(--joy-grape)", { stroke: "#4b2a8a", strokeWidth: 1.6, strokeLinejoin: "round" })],
  },
];

/* ---------------------------------------------------------- town decor */

const town = [
  {
    id: "town-oak", slot: "town", name: "Oak Tree", price: 70, w: 60, h: 80,
    draw: () => [
      orect(26, 46, 9, 34, "#a8743f", 3),
      ocircle(18, 40, 15, "#4cc38a"),
      ocircle(42, 38, 16, "#4cc38a"),
      ocircle(30, 24, 19, "#5fd49a"),
    ],
  },
  {
    id: "town-bench", slot: "town", name: "Park Bench", price: 90, w: 60, h: 34,
    draw: () => [
      orect(8, 22, 4, 12, "#6b4a2b", 1),
      orect(48, 22, 4, 12, "#6b4a2b", 1),
      orect(4, 18, 52, 6, "#c98b4a", 3),
      orect(4, 4, 52, 6, "#c98b4a", 3),
      orect(8, 8, 3, 11, "#6b4a2b", 1),
      orect(49, 8, 3, 11, "#6b4a2b", 1),
    ],
  },
  {
    id: "town-lamp", slot: "town", name: "Street Lamp", price: 90, w: 24, h: 76,
    draw: () => [
      circle(12, 16, 13, "rgba(255,176,32,0.22)"),
      orect(10, 20, 4, 54, "#3f4a57", 2),
      orect(6, 72, 12, 4, "#3f4a57", 2),
      opath("M4 14 L20 14 L17 6 L7 6 Z", "#3f4a57"),
      ocircle(12, 17, 4.5, "var(--joy-sun)", 1.5),
    ],
  },
  {
    id: "town-fountain", slot: "town", name: "Fountain", price: 250, w: 84, h: 56,
    draw: () => [
      path("M42 30 Q34 6 22 26 M42 30 Q50 6 62 26 M42 30 L42 8", "none", { stroke: "var(--joy-sky)", strokeWidth: 3, strokeLinecap: "round" }),
      circle(42, 7, 3, "var(--joy-sky)"),
      orect(36, 28, 12, 12, "#d5dce6", 3),
      ellipse(42, 44, 38, 10, "#d5dce6", { stroke: INK, strokeWidth: 2 }),
      ellipse(42, 42, 30, 6, "var(--joy-sky)", { opacity: 0.6 }),
      rect(6, 44, 72, 10, "#d5dce6"),
      path("M4 44 L4 52 Q42 62 80 52 L80 44", "none", { stroke: INK, strokeWidth: 2, strokeLinejoin: "round" }),
    ],
  },
  {
    id: "town-mural", slot: "town", name: "Mural Wall", price: 300, w: 120, h: 60,
    draw: () => [
      orect(2, 6, 116, 52, "#fff4e0", 4),
      circle(26, 26, 11, "var(--joy-sun)"),
      path("M2 46 Q22 32 40 44 T80 42 T118 38 L118 58 L2 58 Z", "var(--joy-sky)", { opacity: 0.85 }),
      path("M60 40 L72 16 L84 40 Z", "var(--joy-grape)"),
      path("M78 40 L92 22 L106 40 Z", "var(--joy-mint)"),
      circle(48, 20, 4, "var(--joy-coral)"),
      orect(2, 6, 116, 52, "none", 4),
    ],
  },
  {
    id: "town-clock", slot: "town", name: "Clock Tower", price: 500, w: 56, h: 160, lock: { anyCourses: 2 },
    draw: () => [
      opath("M8 40 L28 6 L48 40 Z", "var(--joy-coral)"),
      orect(10, 40, 36, 120, "#f4ead8", 2),
      ocircle(28, 62, 13, "#ffffff"),
      line(28, 62, 28, 53, INK, 2.4),
      line(28, 62, 34, 65, INK, 2.4),
      orect(20, 132, 16, 28, "#a8743f", 8),
      rect(18, 90, 6, 10, "#cfe3f5", { rx: 1 }),
      rect(32, 90, 6, 10, "#cfe3f5", { rx: 1 }),
    ],
  },
  {
    id: "town-rainbow", slot: "town", name: "Rainbow", price: 450, w: 440, h: 200, lock: { courseId: "scratch" },
    draw: () => {
      const bands = ["var(--joy-coral)", "var(--joy-sun)", "var(--joy-mint)", "var(--joy-sky)", "var(--joy-grape)"];
      return [g({ opacity: 0.55, fill: "none", strokeWidth: 11 }, bands.map((c, i) => {
        const r = 210 - i * 11;
        return path(`M${220 - r} 200 A ${r} ${r} 0 0 1 ${220 + r} 200`, "none", { stroke: c });
      }))];
    },
  },
];

export const shopItems = [...bodies, ...hats, ...eyes, ...packs, ...trails, ...town];
export const SHOP_BY_ID = Object.fromEntries(shopItems.map((i) => [i.id, i]));

export const DEFAULT_EQUIPPED = { body: "body-classic", hat: null, eyes: "eyes-round", pack: null, trail: null, town: [] };
