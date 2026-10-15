import { createElement, Fragment } from "react";

/* Turns a shape list from data/art.js into SVG elements. */
export default function Shapes({ list }) {
  if (!Array.isArray(list)) return null;
  return list.map((shape, i) => {
    if (!shape) return null;
    const [tag, attrs, kids] = shape;
    const children = kids == null ? null : typeof kids === "string" ? kids : <Shapes list={kids} />;
    return createElement(tag, { key: i, ...attrs }, children);
  });
}

/* A shop item / badge / building drawn on its own, with a <title> so it
   carries meaning for screen readers when it isn't purely decorative. */
export function Art({ shapes, viewBox, width, height, title, className }) {
  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <Fragment>
        <Shapes list={shapes} />
      </Fragment>
    </svg>
  );
}
