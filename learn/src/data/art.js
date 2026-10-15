/* ---------------------------------------------------------------------------
   Tiny SVG vocabulary for the game layer.

   Every picture in Pip, the Workshop, Byteville and the badges is a list of
   shapes: [tag, attrs, children?]. components/art/Shapes.jsx turns the list
   into real <svg> elements. Keeping art as plain data (no JSX) means
   scripts/validate-content.mjs can import it in Node and check that every
   item, badge and building actually draws something.

   There are no image files anywhere in this project. If something can't be
   drawn with these, simplify it until it can.
   --------------------------------------------------------------------------- */

export const SHAPE_TAGS = ["g", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text"];

export const INK = "#1d2a3a"; // outline colour shared by all the art

export const g = (attrs, kids) => ["g", attrs || {}, kids];
export const rect = (x, y, width, height, fill, more = {}) => ["rect", { x, y, width, height, fill, ...more }];
export const circle = (cx, cy, r, fill, more = {}) => ["circle", { cx, cy, r, fill, ...more }];
export const ellipse = (cx, cy, rx, ry, fill, more = {}) => ["ellipse", { cx, cy, rx, ry, fill, ...more }];
export const path = (d, fill, more = {}) => ["path", { d, fill, ...more }];
export const line = (x1, y1, x2, y2, stroke, strokeWidth = 2, more = {}) =>
  ["line", { x1, y1, x2, y2, stroke, strokeWidth, strokeLinecap: "round", ...more }];
export const text = (x, y, value, more = {}) =>
  ["text", { x, y, textAnchor: "middle", fontFamily: "Jost, Inter, sans-serif", fontWeight: 700, ...more }, String(value)];

/* Outlined versions: the friendly 2px ink edge used on kid surfaces. */
export const ink = (w = 2) => ({ stroke: INK, strokeWidth: w, strokeLinejoin: "round" });
export const orect = (x, y, w, h, fill, rx = 3, sw = 2) => rect(x, y, w, h, fill, { rx, ...ink(sw) });
export const opath = (d, fill, sw = 2) => path(d, fill, ink(sw));
export const ocircle = (cx, cy, r, fill, sw = 2) => circle(cx, cy, r, fill, ink(sw));

/* A five-point star centred on (cx, cy). */
export function starPath(cx, cy, outer, inner = outer * 0.45) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return d + "Z";
}
