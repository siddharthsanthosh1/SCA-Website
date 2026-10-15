import { useMemo } from "react";
import Shapes from "../art/Shapes";
import { SHOP_BY_ID, DEFAULT_EQUIPPED, PIP_EYE, PIP_SCREEN } from "../../data/shop";

/* ---------------------------------------------------------------------------
   Pip — a palm-sized robot who learns alongside the student.

   One inline SVG, no image files. Every colour comes from a CSS variable or
   from the equipped items, so a new body colour or hat just changes the data.
   Pip is decorative: aria-hidden, always. Whatever Pip "says" is rendered as
   real text next to it (see PipSays).

   Drawn in a 120 × 156 frame (viewBox 0 -16 120 156): head 26–94 × 24–76,
   body 36–84 × 80–124, feet on y≈130. Hats and backpacks in data/shop.js
   draw in this same frame.

   Animations are CSS only (styles/joy.css) and switch off entirely under
   prefers-reduced-motion — every pose's resting state is a complete picture.
   --------------------------------------------------------------------------- */

export const MOODS = ["idle", "happy", "thinking", "cheering", "oops", "sleeping", "waving"];

const EYE_L = { cx: 49, cy: 50 };
const EYE_R = { cx: 71, cy: 50 };
const BLINKS = new Set(["idle", "waving", "thinking"]);
const TRAIL_SPOTS = [[16, 118], [8, 100], [20, 86]];

/* Under this size an item's fine detail turns to specks, so items that have
   a `smallVariant` (data/shop.js) draw that bolder silhouette instead. */
const SMALL_BELOW = 64;
const drawOf = (item, small) => (small && item.smallVariant) || item.draw;

const stroke = (w = 2.6) => ({ fill: "none", stroke: PIP_EYE, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" });

function ItemEyes({ item, small }) {
  const base = item.overlay ? SHOP_BY_ID[DEFAULT_EQUIPPED.eyes] : item;
  const draw = drawOf(base, small);
  return (
    <>
      <Shapes list={draw(EYE_L)} />
      <Shapes list={draw(EYE_R)} />
    </>
  );
}

/* Each mood has its own eyes and its own mouth — not one face with a hat. */
function Face({ mood, eyes, small }) {
  switch (mood) {
    case "happy":
      return (
        <>
          <path d="M43 52 Q49 43 55 52 M65 52 Q71 43 77 52" {...stroke(2.8)} />
          <path d="M50 57 Q60 69 70 57 Z" fill={PIP_EYE} />
        </>
      );
    case "thinking":
      return (
        <>
          <g className="pip__eyes">
            <circle cx="52" cy="46" r="4.2" fill={PIP_EYE} />
            <circle cx="74" cy="46" r="4.2" fill={PIP_EYE} />
          </g>
          <path d="M66 38.5 L78 41" {...stroke(2.2)} />
          <path d="M55 62 L66 59.5" {...stroke(2.4)} />
        </>
      );
    case "cheering":
      return (
        <>
          <path d="M44 45 L53 50 L44 55 M76 45 L67 50 L76 55" {...stroke(2.8)} />
          <path d="M47 56 Q60 75 73 56 Z" fill={PIP_EYE} />
          <ellipse cx="60" cy="64.5" rx="5" ry="2.6" fill="var(--joy-coral)" />
        </>
      );
    case "oops":
      return (
        <>
          <circle cx="49" cy="49" r="6" fill={PIP_EYE} />
          <circle cx="71" cy="50" r="3.6" fill={PIP_EYE} />
          <path d="M49 62 q2.75 -3.2 5.5 0 t5.5 0 t5.5 0 t5.5 0" {...stroke(2.2)} />
        </>
      );
    case "sleeping":
      return (
        <>
          <path d="M43 49 Q49 54 55 49 M65 49 Q71 54 77 49" {...stroke(2.6)} />
          <circle cx="60" cy="61" r="2.4" {...stroke(2)} />
        </>
      );
    case "waving":
      return (
        <>
          <g className="pip__eyes"><ItemEyes item={eyes} small={small} /></g>
          <path d="M52 57 Q60 65.5 68 57 Z" fill={PIP_EYE} />
          <circle cx="40" cy="60" r="3.3" fill="var(--joy-coral)" opacity="0.75" />
          <circle cx="80" cy="60" r="3.3" fill="var(--joy-coral)" opacity="0.75" />
        </>
      );
    default: // idle
      return (
        <>
          <g className="pip__eyes"><ItemEyes item={eyes} small={small} /></g>
          <path d="M53 59 Q60 64.5 67 59" {...stroke(2.4)} />
        </>
      );
  }
}

export default function Pip({ mood = "idle", size = 96, equipped, animate = true, walking = false, className = "" }) {
  // Blink timing is randomised per Pip so a page of them doesn't blink in unison.
  const blink = useMemo(() => ({ dur: `${(4 + Math.random() * 3).toFixed(2)}s`, delay: `${(Math.random() * 3).toFixed(2)}s` }), []);
  const m = MOODS.includes(mood) ? mood : "idle";

  const eq = { ...DEFAULT_EQUIPPED, ...(equipped || {}) };
  const bodyItem = SHOP_BY_ID[eq.body] || SHOP_BY_ID[DEFAULT_EQUIPPED.body];
  const eyes = SHOP_BY_ID[eq.eyes] || SHOP_BY_ID[DEFAULT_EQUIPPED.eyes];
  const hat = eq.hat ? SHOP_BY_ID[eq.hat] : null;
  const pack = eq.pack ? SHOP_BY_ID[eq.pack] : null;
  const trail = eq.trail ? SHOP_BY_ID[eq.trail] : null;
  const overlayEyes = eyes.overlay && (BLINKS.has(m) || m === "happy");
  const small = size < SMALL_BELOW;

  const style = {
    "--pip-body": bodyItem.colors.body,
    "--pip-dark": bodyItem.colors.dark,
    "--pip-blink": blink.dur,
    "--pip-blink-delay": blink.delay,
  };
  const cls = ["pip", `pip--${m}`, animate && "pip--anim", walking && "pip--walking", className].filter(Boolean).join(" ");

  return (
    <svg viewBox="0 -16 120 156" width={size} height={Math.round((size * 156) / 120)} className={cls} style={style} aria-hidden="true" focusable="false">
      <ellipse className="pip__shadow" cx="60" cy="135" rx="26" ry="4" fill="rgba(22,32,43,0.10)" />

      {trail && (
        <g className="pip__trail">
          {TRAIL_SPOTS.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g className="pip__trail-p" style={{ animationDelay: `${i * 0.8}s` }}>
                <Shapes list={drawOf(trail, small)()} />
              </g>
            </g>
          ))}
        </g>
      )}

      <g className="pip__float">
        <g className="pip__move">
          {pack && <Shapes list={drawOf(pack, small)({ layer: "back" })} />}

          <g className="pip__arm pip__arm--l">
            {/* Invisible, so the arm's box — and so its shoulder pivot — stays put while the forearm bends. */}
            <rect className="pip__armbox" x="9" y="84" width="41" height="44" fill="none" />
            <g className="pip__fore">
              <rect x="23" y="97" width="13" height="15" rx="6.5" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
            </g>
            <rect x="23" y="86" width="13" height="15" rx="6.5" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
          </g>
          <g className="pip__arm pip__arm--r">
            {/* Invisible, so the arm's box — and so its shoulder pivot — stays put while the forearm bends. */}
            <rect className="pip__armbox" x="70" y="84" width="41" height="44" fill="none" />
            <g className="pip__fore">
              <rect x="84" y="97" width="13" height="15" rx="6.5" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
            </g>
            <rect x="84" y="86" width="13" height="15" rx="6.5" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
          </g>

          <rect className="pip__foot pip__foot--l" x="41" y="120" width="16" height="10" rx="5" fill="var(--pip-dark)" />
          <rect className="pip__foot pip__foot--r" x="63" y="120" width="16" height="10" rx="5" fill="var(--pip-dark)" />

          <rect x="36" y="79" width="48" height="45" rx="16" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
          <circle cx="60" cy="101" r="6.5" fill={PIP_SCREEN} />
          <circle className="pip__heart" cx="60" cy="101" r="2.8" fill="var(--joy-coral)" />

          {pack && <Shapes list={drawOf(pack, small)({ layer: "front" })} />}

          <rect x="52" y="73" width="16" height="9" rx="3" fill="var(--pip-dark)" />

          {!hat?.hidesAntenna && (
            <g>
              <line x1="60" y1="26" x2="60" y2="11" stroke="var(--pip-dark)" strokeWidth="3" strokeLinecap="round" />
              <circle className="pip__light" cx="60" cy="8" r="4.6" fill={m === "sleeping" ? "#c9d3df" : "var(--joy-sun)"} stroke="var(--pip-dark)" strokeWidth="1.6" />
            </g>
          )}

          <rect x="20" y="42" width="8" height="17" rx="4" fill="var(--pip-dark)" />
          <rect x="92" y="42" width="8" height="17" rx="4" fill="var(--pip-dark)" />
          <rect x="26" y="24" width="68" height="52" rx="18" fill="var(--pip-body)" stroke="var(--pip-dark)" strokeWidth="2.5" />
          <path d="M34 33 Q39 28.5 49 28.5" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
          <rect x="34" y="33" width="52" height="37" rx="12" fill={PIP_SCREEN} />

          <Face mood={m} eyes={eyes} small={small} />
          {overlayEyes && <Shapes list={drawOf(eyes, small)()} />}

          {m === "oops" && <path d="M95 26 Q90.5 34 95 36.5 Q99.5 34 95 26 Z" fill="var(--joy-sky)" stroke="var(--pip-dark)" strokeWidth="1.2" />}

          {hat && <Shapes list={drawOf(hat, small)()} />}

          {m === "sleeping" && (
            <g fill="none" stroke="var(--pip-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pip__zzz">
              <path d="M98 14 h6 l-6 7 h6" />
              <path d="M106 -2 h8 l-8 9 h8" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
