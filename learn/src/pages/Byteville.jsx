import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../lib/progress";
import { isTopicDone, isCourseDone } from "../lib/sparks";
import { getCourse } from "../data/courses";
import { buildings, DISTRICTS, SCENE, TOWN_SPOTS } from "../data/byteville";
import { SHOP_BY_ID } from "../data/shop";
import { pipLine } from "../data/pip-lines";
import Shapes from "../components/art/Shapes";
import Building from "../components/art/Building";
import Pip from "../components/pip/Pip";
import PipSays from "../components/pip/PipSays";
import FunOff from "../components/joy/FunOff";
import { Check, Arrow } from "../components/Icons";

/* ---------------------------------------------------------------------------
   Byteville: one SVG town that grows a building for every topic finished.

   Built buildings are buttons — tap or press Enter to see which topic earned
   it and jump back to review it. A building grows in the first time it's
   seen, then just stands there. A finished course lights its district.
   The list under the picture says the same thing in words.
   --------------------------------------------------------------------------- */

const key = (b) => `built:${b.courseId}:${b.topicId}`;
const topicOf = (b) => getCourse(b.courseId)?.topics.find((t) => t.id === b.topicId);

function Sky() {
  return (
    <>
      <defs>
        <linearGradient id="bv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f3ff" />
          <stop offset="1" stopColor="#f8fcff" />
        </linearGradient>
        <radialGradient id="bv-glow">
          <stop offset="0" stopColor="#ffd970" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd970" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={SCENE.w} height={SCENE.h} fill="url(#bv-sky)" />
      <circle cx="1110" cy="190" r="50" fill="#ffd970" opacity="0.25" />
      <circle cx="1110" cy="190" r="32" fill="var(--joy-sun)" />
      {[[120, 186, 1], [520, 162, 0.8], [860, 204, 1.1]].map(([x, y, s], i) => (
        <g key={i} className="town__cloud" style={{ animationDelay: `${-i * 20}s` }}>
          <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" stroke="#d6ecfb" strokeWidth="2">
            <ellipse cx="0" cy="0" rx="34" ry="15" />
            <ellipse cx="-20" cy="4" rx="20" ry="11" />
            <ellipse cx="22" cy="4" rx="22" ry="12" />
          </g>
        </g>
      ))}
      <path d="M0 300 L0 252 Q150 204 300 246 T600 236 T900 242 T1200 228 L1200 300 Z" fill="#d6f0c4" />
      <path d="M0 300 L0 276 Q220 244 430 274 T860 268 T1200 262 L1200 300 Z" fill="#cbeab6" />
    </>
  );
}

function Decoration({ id }) {
  const item = SHOP_BY_ID[id];
  const spot = TOWN_SPOTS[id];
  if (!item || !spot) return null;
  return (
    <g transform={`translate(${spot.x} ${spot.y - item.h})`}>
      <title>{item.name}</title>
      <Shapes list={item.draw()} />
    </g>
  );
}

export default function Byteville() {
  const progress = useProgress();
  const { state, fun, equipped } = progress;

  const built = useMemo(() => buildings.filter((b) => {
    const t = topicOf(b);
    return t && isTopicDone(state, getCourse(b.courseId), t);
  }), [state]);
  const lit = useMemo(() => new Set(DISTRICTS.filter((id) => isCourseDone(state, getCourse(id)))), [state]);

  // What's new on this visit is decided once, on arrival, so the grow
  // animation isn't cut short when it gets marked as seen.
  const [fresh] = useState(() => new Set(built.filter((b) => !progress.hasSeen(key(b))).map(key)));
  const [freshLit] = useState(() => [...lit].filter((id) => !progress.hasSeen(`lit:${id}`)));
  const [mood, setMood] = useState(freshLit.length ? "cheering" : "idle");
  const [picked, setPicked] = useState(null);
  const [line] = useState(() =>
    freshLit.length ? `The ${getCourse(freshLit[0]).title} lights are on!` : built.length ? pipLine("byteville") : pipLine("sleeping")
  );

  useEffect(() => {
    if (!fun) return;
    const t = setTimeout(() => progress.markSeen([...fresh, ...freshLit.map((id) => `lit:${id}`)]), 1600);
    const m = setTimeout(() => setMood("idle"), 1200);
    return () => (clearTimeout(t), clearTimeout(m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fun]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPicked(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!fun) return <FunOff place="Byteville" />;

  const builtSet = new Set(built.map(key));
  const decor = equipped.town;
  const back = buildings.filter((b) => b.y === SCENE.backGround);
  const front = buildings.filter((b) => b.y === SCENE.frontGround);
  const sky = decor.filter((id) => TOWN_SPOTS[id]?.y <= 340);
  const near = decor.filter((id) => TOWN_SPOTS[id]?.y > 340);
  const pickedTopic = picked && topicOf(picked);
  const pickedCourse = picked && getCourse(picked.courseId);

  /* The picture: back row, then Pip on the road, then the front row, so
     they overlap correctly. Nothing here takes focus. */
  const drawLot = (b, i) => {
    if (!builtSet.has(key(b))) {
      return <ellipse key={key(b)} cx={b.x + 32} cy={b.y - 2} rx="28" ry="5" fill="none" stroke="#9fcf86" strokeWidth="1.6" strokeDasharray="4 4" />;
    }
    return <Building key={key(b)} building={b} lit={lit.has(b.courseId)} grow={fresh.has(key(b))} delay={0.15 + (i % 3) * 0.12} />;
  };

  /* What you can press, in a layer of its own on top, in district order —
     all of Python's buildings, then Web Development's, and so on — so Tab
     and a screen reader move through the town the way it's organised, not
     along the back row and then the front. */
  const target = (b) => {
    const t = topicOf(b);
    const c = getCourse(b.courseId);
    const choose = () => setPicked((p) => (p && key(p) === key(b) ? null : b));
    return (
      <g
        key={key(b)}
        className={"town__bldg" + (picked && key(picked) === key(b) ? " is-picked" : "")}
        role="button"
        tabIndex={0}
        aria-label={`${b.name}. Built by finishing ${t.title} in ${c.title}.`}
        aria-pressed={Boolean(picked && key(picked) === key(b))}
        onClick={choose}
        onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "center" })}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), choose())}
      >
        <title>{b.name}</title>
        {/* Invisible until focused or picked, but it's also the click target. */}
        <rect className="town__ring" x={b.x - 6} y={b.y - 106} width="76" height="112" rx="10" fill="rgba(31,111,208,0.06)" stroke="var(--blue)" strokeWidth="2.5" strokeDasharray="6 4" />
      </g>
    );
  };

  return (
    <main className="shell" style={{ paddingBlock: "clamp(24px, 5vw, 44px) 72px" }}>
      <header className="spread" style={{ alignItems: "flex-end", marginBottom: 18 }}>
        <div className="stack" style={{ gap: 8, maxWidth: "56ch" }}>
          <span className="eyebrow">Byteville</span>
          <h1 className="h1 kid-heading">Your town</h1>
          <p>
            Every building is a topic you finished. {built.length} of {buildings.length} built
            {lit.size ? ` · ${lit.size} district${lit.size === 1 ? "" : "s"} lit up` : ""}.
          </p>
        </div>
        <PipSays mood={built.length ? "waving" : "sleeping"} line={line} size={64} />
      </header>

      <div className="town">
        <div className="town__scroll" tabIndex={-1}>
          <svg className="town__svg" viewBox={`0 ${SCENE.top} ${SCENE.w} ${SCENE.h - SCENE.top}`} role="group" aria-label={`Byteville, ${built.length} of ${buildings.length} buildings built`}>
            <Sky />
            {sky.map((id) => <Decoration key={id} id={id} />)}

            <rect y="300" width={SCENE.w} height="300" fill="#c6ecb2" />
            {[...lit].map((id) => (
              <ellipse key={id} className="town__glow" cx={DISTRICTS.indexOf(id) * 240 + 120} cy="430" rx="150" ry="170" fill="url(#bv-glow)" />
            ))}

            <rect y={SCENE.road[0]} width={SCENE.w} height={SCENE.road[1] - SCENE.road[0]} fill="#f3e8d2" />
            <path d={`M0 ${SCENE.road[0]} H${SCENE.w} M0 ${SCENE.road[1]} H${SCENE.w}`} stroke="#e2cfa8" strokeWidth="2" />
            <path d={`M10 425 H${SCENE.w}`} stroke="#fff" strokeWidth="3" strokeDasharray="18 16" />
            {DISTRICTS.map((id, d) => (
              <g key={id}>
                <text x={d * 240 + 120} y="420" textAnchor="middle" fontFamily="Jost, sans-serif" fontWeight="700" fontSize="13" fill="#c5ab7c">
                  {getCourse(id).title.toUpperCase()}
                </text>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle key={i} cx={d * 240 + 30 + i * 36} cy="401" r="3.2" fill={lit.has(id) ? "#ffd970" : "#dfe4ea"} stroke="#c9ccd1" strokeWidth="1" />
                ))}
              </g>
            ))}

            {back.map(drawLot)}

            {/* Pip strolls along the road, between the two rows. */}
            <g className="town__walker">
              <svg x="-22" y="384" width="44" height="58" viewBox="0 0 44 58" overflow="visible">
                <Pip mood={mood} size={44} equipped={equipped} walking />
              </svg>
            </g>

            {front.map(drawLot)}
            {near.map((id) => <Decoration key={id} id={id} />)}

            {DISTRICTS.map((id) => {
              const mine = buildings.filter((b) => b.courseId === id && builtSet.has(key(b)));
              return mine.length ? (
                <g key={id} role="group" aria-label={`${getCourse(id).title} district`}>
                  {mine.map(target)}
                </g>
              ) : null;
            })}
          </svg>
        </div>
      </div>

      <div aria-live="polite">
        {picked && (
          <div className="kid spread" style={{ marginTop: 14 }}>
            <div className="stack" style={{ gap: 3 }}>
              <strong style={{ color: "var(--text)", fontFamily: "Jost, sans-serif", fontSize: "1.15rem" }}>{picked.name}</strong>
              <span className="small muted">
                Built by finishing “{pickedTopic.title}” in {pickedCourse.title}.
              </span>
            </div>
            <div className="row">
              <Link className="btn btn--kid" to={`/course/${picked.courseId}/lesson/${pickedTopic.lessons[0].id}`}>
                Review {pickedTopic.title} <Arrow size={14} />
              </Link>
              <button className="btn btn--ghost btn--kid" onClick={() => setPicked(null)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <section style={{ marginTop: 32 }} aria-labelledby="districts">
        <h2 id="districts" className="h3 kid-heading" style={{ marginBottom: 14 }}>Districts</h2>
        <div className="stack" style={{ gap: 22 }}>
          {DISTRICTS.map((id) => {
            const c = getCourse(id);
            const mine = buildings.filter((b) => b.courseId === id);
            const n = mine.filter((b) => builtSet.has(key(b))).length;
            return (
              <div key={id} className="district">
                <div className="row" style={{ gap: 8 }}>
                  <strong style={{ color: "var(--text)" }}>{c.title}</strong>
                  <span className="chip chip--grey">{n}/6 built</span>
                  {lit.has(id) && <span className="chip chip--amber">Lights on</span>}
                </div>
                <ul className="district__list">
                  {mine.map((b) => {
                    const t = topicOf(b);
                    const isBuilt = builtSet.has(key(b));
                    return (
                      <li key={key(b)} className={"district__item" + (isBuilt ? " is-built" : "")}>
                        {isBuilt ? <span style={{ color: "var(--green)" }}><Check size={14} bold /></span> : <span aria-hidden="true" style={{ width: 14, textAlign: "center" }}>·</span>}
                        <span>
                          {b.name}
                          <span className="muted" style={{ fontWeight: 400 }}>
                            {isBuilt ? ` — ${t.title}` : ` — finish “${t.title}” to build`}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
