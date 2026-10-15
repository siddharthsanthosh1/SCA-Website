/* ---------------------------------------------------------------------------
   Byteville — a picture of what the student has learned.

   One building per topic: 5 courses × 6 topics = 30. Finishing every lesson in
   a topic puts its building on the street; finishing a whole course lights
   up that district. Nothing here is random and nothing is bought — the only
   things a student can add with Sparks are the decorations in TOWN_SPOTS.

   Scene: 1200 × 600. Sky and hills above y = 300, grass below, a road at
   y 404–446. Each course is a 240-wide district: topics 1–3 on the back row
   (ground y = 392), topics 4–6 on the front row (ground y = 548).

   Building shape:
     { courseId, topicId, name, x, y, draw({ lit }) → shapes }
   `x, y` is the building's bottom-left corner in the scene. `draw` works in
   a 64 × 100 frame with the ground at y = 100 (front-row buildings stay below
   y = 12 so they never cover the road). `lit` is true once the course is
   finished: windows glow.

   To add a building: give it a topic no other building uses, then run
   `npm run check:content` — it checks every topic is covered exactly once
   and that every building draws.
   --------------------------------------------------------------------------- */

import { INK, rect, circle, ellipse, path, line, text, orect, opath, ocircle } from "./art.js";

// `top` is where the visible picture starts: the sky above it is never shown.
export const SCENE = { w: 1200, h: 600, top: 130, road: [404, 446], backGround: 392, frontGround: 548 };
export const DISTRICTS = ["python", "javascript", "java", "cpp", "scratch"];
const SLOT_X = [12, 88, 164];

/* Where each topic stands, worked out once so every coordinate is explicit. */
function at(courseId, topicId) {
  const d = DISTRICTS.indexOf(courseId);
  const t = Number(topicId.slice(1)) - 1;
  return { x: d * 240 + SLOT_X[t % 3], y: t < 3 ? SCENE.backGround : SCENE.frontGround };
}

/* ------------------------------------------------------------ kit of parts */

const WIN_OFF = "#cfe3f5";
const WIN_ON = "#ffd970";
const WOOD = "#a8743f";
const STEEL = "#d5dce6";
const DARK = "#5b6573";

const win = (x, y, w, h, lit) => orect(x, y, w, h, lit ? WIN_ON : WIN_OFF, 1.5, 1.6);
const door = (x, w, h, fill = WOOD) => orect(x, 100 - h, w, h, fill, 2);
const wall = (x, y, w, fill) => orect(x, y, w, 100 - y, fill, 3);
const roof = (x, y, w, h, fill) => opath(`M${x - 4} ${y} L${x + w / 2} ${y - h} L${x + w + 4} ${y} Z`, fill);
const post = (x, top, w = 4, fill = WOOD) => orect(x, top, w, 100 - top, fill, 1.5, 1.6);
const smoke = (x, y) => [circle(x, y, 4, "#eef1f5", { stroke: "#cfd6df", strokeWidth: 1.4 }), circle(x + 5, y - 8, 5.5, "#eef1f5", { stroke: "#cfd6df", strokeWidth: 1.4 })];
const label = (x, y, value, size = 9, fill = INK) => text(x, y, value, { fontSize: size, fill });
const gear = (cx, cy, r, fill) => [
  circle(cx, cy, r, "none", { stroke: INK, strokeWidth: r * 0.55, strokeDasharray: `${(r * 0.55).toFixed(1)} ${(r * 0.42).toFixed(1)}` }),
  ocircle(cx, cy, r * 0.8, fill, 1.6),
  circle(cx, cy, r * 0.28, INK),
];

/* ---------------------------------------------------------------- Python
   Blue district: the first things a programmer learns. */

const python = {
  t1: ["Signal Hut", ({ lit }) => [
    line(52, 100, 52, 30, INK, 2.5),
    line(46, 50, 58, 50, INK, 2), line(47, 70, 57, 70, INK, 2),
    path("M58 22 Q62 28 58 34 M63 17 Q70 28 63 39", "none", { stroke: "var(--joy-sky)", strokeWidth: 2.4, strokeLinecap: "round" }),
    ocircle(52, 28, 3.5, "var(--joy-sun)", 1.5),
    wall(6, 62, 40, "#e8f4fd"), roof(6, 62, 40, 16, "var(--joy-sky)"),
    door(20, 12, 22), win(9, 70, 8, 8, lit), win(35, 70, 8, 8, lit),
  ]],
  t2: ["Toolshed", ({ lit }) => [
    wall(6, 56, 50, "#f6ead8"), roof(6, 56, 50, 18, "#c98b4a"),
    orect(18, 68, 26, 32, WOOD, 2), line(31, 69, 31, 99, INK, 1.6),
    win(10, 62, 6, 5, lit), win(46, 62, 6, 5, lit),
    orect(48, 80, 14, 20, "var(--joy-sun)", 2), line(51, 88, 59, 88, INK, 1.6),
    orect(2, 86, 13, 14, "var(--joy-mint)", 2), line(5, 93, 12, 93, INK, 1.6),
  ]],
  t3: ["Crossroads Sign", () => [
    post(30, 28, 5),
    opath("M35 32 L56 32 L63 39 L56 46 L35 46 Z", "var(--joy-sky)"),
    opath("M30 52 L9 52 L2 59 L9 66 L30 66 Z", "var(--joy-coral)"),
    label(47, 42.5, "if", 9, "#fff"), label(17, 62.5, "else", 8, "#fff"),
    path("M18 100 q4 -8 8 0 M40 100 q4 -7 8 0", "#5fd49a", { stroke: "#2f9e6a", strokeWidth: 1.4 }),
  ]],
  t4: ["Loop-de-loop Track", () => [
    orect(14, 70, 4, 26, STEEL, 1), orect(46, 70, 4, 26, STEEL, 1),
    circle(32, 52, 22, "none", { stroke: INK, strokeWidth: 7 }),
    circle(32, 52, 22, "none", { stroke: "var(--joy-coral)", strokeWidth: 4 }),
    path("M0 95 L64 95", "none", { stroke: INK, strokeWidth: 5, strokeLinecap: "round" }),
    path("M0 95 L64 95", "none", { stroke: "var(--joy-coral)", strokeWidth: 2.5, strokeLinecap: "round" }),
    orect(26, 25, 12, 8, "var(--joy-sun)", 3, 1.6),
  ]],
  t5: ["Library Shelf", ({ lit }) => {
    const books = [];
    const colours = ["var(--joy-sky)", "var(--joy-coral)", "var(--joy-sun)", "var(--joy-mint)", "var(--joy-grape)"];
    [44, 64, 84].forEach((y, row) => {
      for (let i = 0; i < 6; i++) books.push(rect(10 + i * 7.4, y - 14 + ((i + row) % 3), 6, 14 - ((i + row) % 3), colours[(i + row * 2) % 5], { stroke: INK, strokeWidth: 1 }));
    });
    return [
      wall(6, 32, 52, "#f6ead8"), orect(2, 26, 60, 8, WOOD, 2),
      ...books,
      line(8, 44, 56, 44, INK, 2), line(8, 64, 56, 64, INK, 2), line(8, 84, 56, 84, INK, 2),
      circle(32, 92, 3, lit ? WIN_ON : "#e6d7bf", { stroke: INK, strokeWidth: 1.2 }),
    ];
  }],
  t6: ["Function Factory", ({ lit }) => [
    orect(48, 22, 11, 78, STEEL, 2), ...smoke(54, 14),
    opath("M4 52 L4 38 L18 50 L18 38 L32 50 L32 38 L48 50 L48 100 L4 100 Z", "#e8f4fd"),
    label(26, 70, "f(x)", 11),
    win(8, 76, 9, 8, lit), win(35, 76, 9, 8, lit),
    door(20, 12, 18, "var(--joy-sky)"),
  ]],
};

/* ---------------------------------------------------------------- Web dev
   Coral district: things people see and use. */

const javascript = {
  t1: ["Billboard", ({ lit }) => [
    post(12, 56), post(48, 56),
    orect(2, 22, 60, 36, "#fff4e0", 3),
    label(32, 44, "www", 12, "var(--joy-coral)"),
    ...[12, 32, 52].map((x) => ocircle(x, 19, 2.6, lit ? WIN_ON : STEEL, 1.2)),
  ]],
  t2: ["Noticeboard", () => [
    post(10, 40), post(50, 40),
    roof(6, 40, 52, 10, "var(--joy-coral)"),
    orect(6, 42, 52, 36, "#d9a66b", 3),
    orect(11, 47, 16, 13, "#ffffff", 1, 1.2), orect(32, 46, 20, 11, "#fff4e0", 1, 1.2), orect(14, 62, 22, 12, "#e8f4fd", 1, 1.2), orect(40, 60, 13, 14, "#ffffff", 1, 1.2),
    circle(19, 47, 1.8, "var(--joy-coral)"), circle(42, 46, 1.8, "var(--joy-sky)"), circle(25, 62, 1.8, "var(--joy-mint)"), circle(46, 60, 1.8, "var(--joy-grape)"),
  ]],
  t3: ["Paint Shop", ({ lit }) => [
    wall(6, 46, 52, "#ffffff"),
    opath("M2 46 L62 46 L62 54 Q57 60 52 54 Q47 60 42 54 Q37 60 32 54 Q27 60 22 54 Q17 60 12 54 Q7 60 2 54 Z", "var(--joy-coral)"),
    path("M12 46 L12 55 M32 46 L32 55 M52 46 L52 55", "none", { stroke: "#fff", strokeWidth: 4 }),
    ellipse(32, 36, 15, 9, "#fff4e0", { stroke: INK, strokeWidth: 2 }),
    circle(25, 34, 2.4, "var(--joy-coral)"), circle(31, 32, 2.4, "var(--joy-sky)"), circle(37, 35, 2.4, "var(--joy-mint)"), circle(30, 39, 2.4, "var(--joy-grape)"),
    win(10, 64, 16, 14, lit), door(36, 14, 30, "var(--joy-sky)"),
  ]],
  t4: ["Ramp", ({ lit }) => [
    wall(22, 44, 40, "#fdeceb"), roof(22, 44, 40, 14, "var(--joy-coral)"),
    orect(22, 86, 40, 14, STEEL, 1),
    door(36, 14, 34), win(26, 54, 8, 8, lit), win(50, 54, 8, 8, lit),
    opath("M0 100 L22 86 L22 100 Z", STEEL),
    line(2, 90, 22, 77, INK, 2), line(2, 90, 2, 98, INK, 2),
    orect(27, 70, 7, 7, "var(--joy-sky)", 1.5, 1.2), circle(30.5, 72, 1.1, "#fff"),
  ]],
  t5: ["Switchboard", ({ lit }) => [
    orect(8, 32, 48, 68, STEEL, 4),
    orect(13, 38, 38, 30, "#22324a", 3, 1.6),
    ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => circle(19 + c * 9, 45 + r * 9, 2.6, (r + c + (lit ? 0 : 1)) % 2 || lit ? WIN_ON : "#4b5d76"))),
    ...[16, 28, 40].map((x, i) => [orect(x, 76, 8, 14, "#ffffff", 2, 1.4), rect(x + 1.5, i % 2 ? 84 : 78, 5, 4.5, "var(--joy-coral)")]).flat(),
  ]],
  t6: ["Community Centre", ({ lit }) => [
    line(56, 30, 56, 4, INK, 2), opath("M56 5 L66 9 L56 13 Z", "var(--joy-sun)", 1.4),
    wall(2, 46, 60, "#fff4e0"), roof(2, 46, 60, 16, "var(--joy-coral)"),
    win(7, 54, 10, 10, lit), win(47, 54, 10, 10, lit), win(7, 72, 10, 10, lit), win(47, 72, 10, 10, lit),
    door(22, 20, 30, WOOD), line(32, 71, 32, 99, INK, 1.6),
    circle(32, 38, 3.5, lit ? WIN_ON : "#ffffff", { stroke: INK, strokeWidth: 1.4 }),
  ]],
};

/* ---------------------------------------------------------------- Java
   Grape district: careful, planned building. */

const java = {
  t1: ["Blueprint Office", ({ lit }) => [
    wall(6, 38, 52, "#efeaff"), orect(2, 33, 60, 7, "var(--joy-grape)", 2),
    orect(13, 46, 38, 24, "#2f6fd6", 2, 1.6),
    path("M19 46 V70 M26 46 V70 M33 46 V70 M40 46 V70 M47 46 V70 M13 54 H51 M13 62 H51", "none", { stroke: "#9cc2f5", strokeWidth: 0.8 }),
    path("M18 66 L18 52 L30 52 L30 60 L44 60 L44 66 Z", "none", { stroke: "#fff", strokeWidth: 1.5 }),
    door(26, 12, 22), win(10, 80, 9, 8, lit), win(45, 80, 9, 8, lit),
  ]],
  t2: ["Measuring Post", () => [
    orect(14, 92, 36, 8, STEEL, 2),
    orect(25, 14, 14, 80, "#fff4e0", 2),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(25, 22 + i * 9, i % 2 ? 30 : 34, 22 + i * 9, INK, 1.4)),
    opath("M23 14 L32 4 L41 14 Z", "var(--joy-grape)"),
    label(48, 30, "int", 8, "var(--joy-grape)"),
  ]],
  t3: ["Junction Box", () => [
    path("M32 56 L32 38 L12 24 M32 38 L52 24", "none", { stroke: "var(--joy-grape)", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }),
    ocircle(12, 23, 4, "var(--joy-mint)", 1.6), ocircle(52, 23, 4, "var(--joy-coral)", 1.6),
    orect(10, 56, 44, 44, "#efeaff", 4),
    opath("M32 62 L44 75 L32 88 L20 75 Z", "var(--joy-sun)"),
    label(32, 79, "?", 11),
  ]],
  t4: ["Conveyor Belt", () => [
    path("M14 26 A10 10 0 1 1 22 40", "none", { stroke: "var(--joy-grape)", strokeWidth: 2.5, strokeLinecap: "round" }),
    opath("M18 37 L23 41 L24 34 Z", "var(--joy-grape)", 1.2),
    orect(2, 70, 60, 11, DARK, 5.5),
    ...[9, 22, 35, 48, 57].map((x) => circle(x, 75.5, 2.6, STEEL)),
    orect(10, 82, 4, 18, DARK, 1), orect(50, 82, 4, 18, DARK, 1),
    orect(6, 56, 14, 14, "var(--joy-sun)", 2), orect(27, 58, 12, 12, "var(--joy-coral)", 2), orect(46, 55, 12, 15, "var(--joy-mint)", 2),
  ]],
  t5: ["Storage Racks", () => [
    post(6, 28, 4, DARK), post(54, 28, 4, DARK),
    line(6, 52, 58, 52, INK, 2.5), line(6, 76, 58, 76, INK, 2.5), line(6, 98, 58, 98, INK, 2.5),
    ...[0, 1, 2].map((i) => orect(12 + i * 14, 38, 12, 14, i === 1 ? "var(--joy-grape)" : "#d9a66b", 2, 1.6)),
    ...[0, 1, 2].map((i) => orect(12 + i * 14, 62, 12, 14, i === 2 ? "var(--joy-sun)" : "#d9a66b", 2, 1.6)),
    ...[0, 1, 2].map((i) => label(18 + i * 14, 92, i, 9, "var(--joy-grape)")),
  ]],
  t6: ["Workshop Hall", ({ lit }) => [
    wall(2, 48, 60, "#efeaff"),
    opath("M0 50 Q32 14 64 50 Z", "var(--joy-grape)"),
    ...gear(32, 38, 8, "var(--joy-sun)"),
    orect(20, 70, 24, 30, WOOD, 3), line(32, 71, 32, 99, INK, 1.6),
    win(6, 58, 10, 9, lit), win(48, 58, 10, 9, lit),
  ]],
};

/* ---------------------------------------------------------------- C++
   Mint and steel district: machines and memory. */

const cpp = {
  t1: ["Foundry", () => [
    orect(44, 18, 12, 82, DARK, 2), ...smoke(50, 10),
    wall(4, 50, 46, "#e3f7f1"), opath("M0 52 L27 38 L54 52 Z", DARK),
    opath("M14 100 L14 76 Q27 62 40 76 L40 100 Z", "#4b2a1a"),
    path("M18 100 L18 78 Q27 68 36 78 L36 100 Z", "var(--joy-coral)"),
    path("M22 100 L22 82 Q27 75 32 82 L32 100 Z", "var(--joy-sun)"),
  ]],
  t2: ["Scale House", ({ lit }) => [
    wall(8, 58, 48, "#e3f7f1"), roof(8, 58, 48, 16, "var(--joy-mint)"),
    line(32, 40, 32, 20, INK, 2), line(16, 22, 48, 22, INK, 2.5),
    path("M10 30 Q16 36 22 30 Z M42 30 Q48 36 54 30 Z", STEEL, { stroke: INK, strokeWidth: 1.6 }),
    line(16, 22, 12, 30, INK, 1.2), line(16, 22, 20, 30, INK, 1.2), line(48, 22, 44, 30, INK, 1.2), line(48, 22, 52, 30, INK, 1.2),
    door(26, 12, 22), win(12, 66, 9, 8, lit), win(43, 66, 9, 8, lit),
  ]],
  t3: ["Points Lever", () => [
    path("M0 96 L64 96 M0 90 L64 90", "none", { stroke: DARK, strokeWidth: 2.5 }),
    path("M28 90 L64 72 M36 96 L64 82", "none", { stroke: DARK, strokeWidth: 2.5 }),
    ...[6, 16, 26, 44, 54].map((x) => line(x, 87, x, 99, WOOD, 3)),
    orect(10, 58, 18, 22, "var(--joy-mint)", 3),
    line(19, 62, 30, 38, INK, 3), ocircle(30, 37, 4.5, "var(--joy-coral)", 1.6),
  ]],
  t4: ["Pulley Line", () => [
    post(6, 22, 5, DARK), post(53, 34, 5, DARK),
    ocircle(8.5, 22, 5.5, STEEL, 1.6), ocircle(55.5, 34, 5.5, STEEL, 1.6),
    path("M8.5 16.5 L55.5 28.5 M8.5 27.5 L55.5 39.5", "none", { stroke: INK, strokeWidth: 1.6 }),
    line(32, 34, 32, 52, INK, 1.4),
    opath("M24 52 L40 52 L38 66 L26 66 Z", "var(--joy-mint)"),
    line(18, 30, 18, 58, INK, 1.4), orect(14, 58, 8, 8, "var(--joy-sun)", 2, 1.4),
  ]],
  t5: ["Warehouse", ({ lit }) => [
    wall(2, 44, 60, "#e3f7f1"), opath("M-1 46 L32 32 L65 46 Z", DARK),
    orect(14, 62, 36, 38, STEEL, 2),
    ...[68, 74, 80, 86, 92].map((y) => line(15, y, 49, y, "#9aa6b5", 1.4)),
    label(32, 56, "0x2A", 8, "var(--joy-mint)"),
    win(5, 52, 6, 6, lit), win(53, 52, 6, 6, lit),
  ]],
  t6: ["Assembly Hall", ({ lit }) => [
    wall(4, 42, 56, "#e3f7f1"), orect(0, 36, 64, 8, "var(--joy-mint)", 2),
    ...[10, 27, 44].map((x) => opath(`M${x} 74 L${x} 56 Q${x + 5} 49 ${x + 10} 56 L${x + 10} 74 Z`, lit ? WIN_ON : WIN_OFF, 1.6)),
    door(24, 16, 20, DARK),
    ...gear(52, 28, 6, "var(--joy-sun)"),
    path("M14 36 L14 26 L24 20", "none", { stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }), ocircle(25, 19, 3, "var(--joy-coral)", 1.4),
  ]],
};

/* ---------------------------------------------------------------- Scratch
   Sunny district: stages, sounds and games. */

const scratch = {
  t1: ["Stage", () => [
    orect(2, 76, 60, 24, "#c98b4a", 2),
    orect(6, 30, 52, 46, "#fff4e0", 2),
    opath("M6 30 L22 30 Q14 54 20 76 L6 76 Z", "var(--joy-coral)"),
    opath("M58 30 L42 30 Q50 54 44 76 L58 76 Z", "var(--joy-coral)"),
    opath("M2 26 L62 26 L62 34 Q47 40 32 34 Q17 40 2 34 Z", "#e04f4f"),
    path("M32 52 L35 60 L43 60 L37 65 L39 73 L32 68 L25 73 L27 65 L21 60 L29 60 Z", "var(--joy-sun)", { stroke: INK, strokeWidth: 1.4 }),
  ]],
  t2: ["Paint Box", () => [
    opath("M6 58 L58 58 L50 30 L14 30 Z", "#fff4e0"),
    orect(6, 58, 52, 42, "#ffffff", 4),
    ...["--scratch-motion", "--scratch-looks", "--scratch-sound", "--scratch-events", "--scratch-operators", "--scratch-variables"].map((v, i) =>
      ocircle(16 + (i % 3) * 16, 70 + Math.floor(i / 3) * 16, 5.5, `var(${v})`, 1.4)),
    line(20, 52, 44, 36, WOOD, 3), path("M44 36 L50 31", "none", { stroke: "var(--joy-grape)", strokeWidth: 4, strokeLinecap: "round" }),
  ]],
  t3: ["Bell Tower", () => [
    orect(20, 30, 24, 70, "#fff4e0", 2), roof(20, 30, 24, 18, "var(--joy-coral)"),
    opath("M24 58 L24 40 Q32 32 40 40 L40 58 Z", "#22324a", 1.6),
    opath("M26 54 Q26 42 32 42 Q38 42 38 54 Z", "var(--joy-sun)", 1.4), circle(32, 56, 2, "var(--joy-sun)"),
    path("M14 42 Q10 48 14 54 M50 42 Q54 48 50 54", "none", { stroke: "var(--joy-sun)", strokeWidth: 2.2, strokeLinecap: "round" }),
    door(27, 10, 18),
  ]],
  t4: ["Sensor Post", () => [
    post(30, 44, 4, DARK), orect(22, 92, 20, 8, STEEL, 2),
    orect(16, 22, 32, 24, "var(--scratch-sensing)", 8),
    ocircle(32, 34, 7, "#ffffff", 1.6), circle(33.5, 33, 3, "#22324a"),
    path("M8 26 Q4 34 8 42 M56 26 Q60 34 56 42", "none", { stroke: "var(--scratch-sensing)", strokeWidth: 2.2, strokeLinecap: "round" }),
  ]],
  t5: ["Scoreboard", ({ lit }) => [
    post(12, 64), post(48, 64),
    orect(4, 26, 56, 40, "#22324a", 4),
    label(32, 36, "SCORE", 7, "#9fb3c8"),
    label(32, 58, "10", 19, lit ? WIN_ON : "var(--joy-sun)"),
  ]],
  t6: ["Arcade", ({ lit }) => [
    wall(4, 42, 56, "#f3eeff"),
    orect(0, 28, 64, 16, "var(--joy-grape)", 4),
    label(32, 39.5, "ARCADE", 8, "#ffffff"),
    ...[6, 16, 26, 38, 48, 58].map((x, i) => circle(x, 30.5, 1.6, lit || i % 2 ? WIN_ON : "#c8bdff")),
    door(24, 16, 26, "#22324a"),
    win(7, 52, 12, 12, lit), win(45, 52, 12, 12, lit),
    line(13, 84, 13, 76, INK, 2), ocircle(13, 75, 3, "var(--joy-coral)", 1.4), orect(7, 84, 12, 6, "var(--joy-sky)", 2, 1.4),
  ]],
};

const ART = { python, javascript, java, cpp, scratch };

export const buildings = DISTRICTS.flatMap((courseId) =>
  Object.entries(ART[courseId]).map(([topicId, [name, draw]]) => ({ courseId, topicId, name, ...at(courseId, topicId), draw }))
);

export const buildingFor = (courseId, topicId) => buildings.find((b) => b.courseId === courseId && b.topicId === topicId) || null;

/* Fixed homes for the decorations a student can buy. Same place every time —
   nothing in Byteville is random. `x, y` is the item's bottom-left corner. */
export const TOWN_SPOTS = {
  "town-rainbow": { x: 380, y: 330 },
  "town-clock": { x: 572, y: 300 },
  "town-mural": { x: 140, y: 300 },
  "town-fountain": { x: 940, y: 300 },
  "town-oak": { x: 780, y: 300 },
  "town-bench": { x: 330, y: 594 },
  "town-lamp": { x: 468, y: 598 },
};

