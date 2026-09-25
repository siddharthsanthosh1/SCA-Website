import { useMemo, useState } from "react";
import { usStates, MAP_VIEWBOX } from "../data/usStatesGeo";

export default function UsMap({ onSelect, selected }) {
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return new Set(
      usStates
        .filter((s) => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().startsWith(q))
        .map((s) => s.abbr)
    );
  }, [query]);

  const hovered = usStates.find((s) => s.abbr === hover);
  const results = matches ? usStates.filter((s) => matches.has(s.abbr)) : [];

  return (
    <div className="usmap">
      <div className="usmap__bar">
        <div className="usmap__search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            placeholder="Find your state"
            aria-label="Search for a state branch"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="usmap__hint muted">
          {hovered ? hovered.name : "Click a state to see its branch"}
        </p>
      </div>

      {matches && (
        <div className="usmap__results">
          {results.length ? (
            results.slice(0, 8).map((s) => (
              <button key={s.abbr} className="chip usmap__result" onClick={() => onSelect(s)}>
                {s.name}
              </button>
            ))
          ) : (
            <span className="muted">No state matches that.</span>
          )}
        </div>
      )}

      <div className="usmap__scroll">
      <div className="usmap__canvas">
        <svg
          viewBox={MAP_VIEWBOX}
          className="usmap__svg"
          role="group"
          aria-label="Map of Student Code Alliance branches in the United States"
        >
          <defs>
            <linearGradient id="usmap-active" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f6fd0" />
              <stop offset="100%" stopColor="#3e9b34" />
            </linearGradient>
            {/* soft blue drop-shadow under the active state */}
            <filter id="usmap-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1f6fd0" floodOpacity="0.3" />
            </filter>
          </defs>

          {usStates.map((s) => {
            const dim = matches && !matches.has(s.abbr);
            const isActive = selected === s.abbr;
            return (
              <g
                key={s.abbr}
                className={`usmap__state ${dim ? "is-dim" : ""} ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => setHover(s.abbr)}
                onMouseLeave={() => setHover(null)}
              >
                <path
                  d={s.d}
                  className="usmap__path"
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.name} branch`}
                  onClick={() => onSelect(s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(s);
                    }
                  }}
                />
                {s.outset && (
                  <line
                    className="usmap__leader"
                    x1={s.cx}
                    y1={s.cy}
                    x2={s.lx - 9}
                    y2={s.ly + 3}
                  />
                )}
                <text
                  className="usmap__label"
                  x={s.outset ? s.lx : s.cx}
                  y={s.outset ? s.ly : s.cy}
                  dy="0.34em"
                  textAnchor={s.outset ? "start" : "middle"}
                >
                  {s.abbr}
                </text>
                {s.outset && (
                  /* the shapes are tiny — give the label its own hit target */
                  <rect
                    className="usmap__hit"
                    x={s.lx - 6}
                    y={s.ly - 12}
                    width={36}
                    height={24}
                    rx={6}
                    onClick={() => onSelect(s)}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      </div>

      <p className="usmap__foot muted">
        {usStates.length} state branches · every branch runs the same free curriculum
      </p>
    </div>
  );
}

/* Frames one state's shape for the dialog artwork. */
export function stateShape(s) {
  const [x, y, w, h] = s.bbox;
  const pad = Math.max(w, h) * 0.09;
  return {
    d: s.d,
    viewBox: [x - pad, y - pad, w + pad * 2, h + pad * 2]
      .map((n) => n.toFixed(1))
      .join(" "),
  };
}
