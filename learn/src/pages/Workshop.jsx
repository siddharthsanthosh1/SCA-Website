import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../lib/progress";
import { lockText } from "../lib/sparks";
import { shopItems, SLOTS } from "../data/shop";
import { pipLine } from "../data/pip-lines";
import PipSays from "../components/pip/PipSays";
import Pip from "../components/pip/Pip";
import { Art } from "../components/art/Shapes";
import { SparkAmount } from "../components/joy/Spark";
import FunOff from "../components/joy/FunOff";
import { Lock, Check } from "../components/Icons";

/* ---------------------------------------------------------------------------
   The Workshop: spend Sparks on parts for Pip and decorations for Byteville.

   Every item is on show — ones you can't afford yet are dimmed with how far
   there is to go, ones that need real progress say exactly what unlocks them.
   Buying takes two taps (Buy, then "Yes, buy it") so a stray tap never spends
   anything. No random rewards, no timers, no deals, no money.
   --------------------------------------------------------------------------- */

function Preview({ item, equipped }) {
  if (item.slot === "town") {
    return <Art shapes={item.draw()} viewBox={`-4 -4 ${item.w + 8} ${item.h + 8}`} width={Math.min(150, (item.w + 8) * (104 / (item.h + 8)))} height={104} title={item.name} />;
  }
  const look = { ...equipped, [item.slot]: item.id };
  return <Pip mood="idle" size={74} equipped={look} animate={false} />;
}

function ItemCard({ item, confirming, onAsk, onCancel, onBought }) {
  const progress = useProgress();
  const { sparks, equipped } = progress;
  const owned = progress.isOwned(item.id);
  const unlocked = progress.isUnlocked(item.id);
  const on = progress.isEquipped(item.id);
  const short = item.price - sparks;
  const isDefault = item.price === 0 && !item.lock;
  const town = item.slot === "town";

  let state = "buy";
  if (!unlocked) state = "locked";
  else if (owned) state = "owned";
  else if (short > 0) state = "short";

  const nameId = `item-${item.id}`;

  // Keep keyboard focus on this card as its button changes underneath it:
  // Buy → (Yes, buy it | Cancel) → Equip, or back to Buy on Cancel.
  const mainBtn = useRef(null);
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (wasConfirming.current && !confirming) mainBtn.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming, owned]);

  return (
    <article className={`item is-${state}` + (on ? " is-on" : "")} aria-labelledby={nameId}>
      <div className="item__art">
        <Preview item={item} equipped={equipped} />
      </div>
      <h3 id={nameId} className="item__name">{item.name}</h3>
      <div className="item__price">{item.price === 0 ? "Free" : <SparkAmount n={item.price} />}</div>
      <div className="item__note">
        {state === "locked" && <span className="row" style={{ gap: 4, justifyContent: "center" }}><Lock size={12} /> {lockText(item)}</span>}
        {state === "short" && <><SparkAmount n={item.price} size={12} /> — {short} to go</>}
        {state === "owned" && on && (town ? "In Byteville" : "Pip is wearing this")}
        {state === "owned" && !on && "Yours"}
      </div>

      {state === "locked" && <button className="btn btn--ghost btn--kid" disabled>Locked</button>}
      {state === "short" && <button className="btn btn--ghost btn--kid" disabled>Buy</button>}
      {state === "buy" && !confirming && (
        <button ref={mainBtn} className="btn btn--kid" onClick={onAsk} aria-label={`Buy ${item.name} for ${item.price} Sparks`}>
          Buy
        </button>
      )}
      {state === "buy" && confirming && (
        <div className="item__confirm">
          <button
            className="btn btn--kid"
            autoFocus
            onClick={() => {
              progress.buy(item.id);
              onBought(item);
            }}
            aria-label={`Yes, buy ${item.name} for ${item.price} Sparks`}
          >
            Yes, buy it
          </button>
          <button className="btn btn--ghost btn--kid" onClick={onCancel}>Cancel</button>
        </div>
      )}
      {state === "owned" && (
        <button
          ref={mainBtn}
          className={"btn btn--kid" + (on ? " btn--ghost" : "")}
          aria-pressed={on}
          disabled={on && isDefault}
          onClick={() => progress.equip(item.id)}
        >
          {on ? (isDefault ? <><Check size={14} bold /> Wearing</> : town ? "Put away" : "Take off") : town ? "Place in Byteville" : "Equip"}
        </button>
      )}
    </article>
  );
}

export default function Workshop() {
  const progress = useProgress();
  const { fun, sparks, sparksEarned, spent } = progress;
  const [confirm, setConfirm] = useState(null);
  const [line, setLine] = useState(() => pipLine("workshop"));
  const [mood, setMood] = useState("idle");

  useEffect(() => {
    if (mood === "idle") return;
    const t = setTimeout(() => setMood("idle"), 1200);
    return () => clearTimeout(t);
  }, [mood]);

  if (!fun) return <FunOff place="The Workshop" />;

  const bought = () => {
    setConfirm(null);
    setLine(pipLine("bought"));
    setMood("happy");
  };

  return (
    <main className="shell" style={{ paddingBlock: "clamp(24px, 5vw, 44px) 72px" }}>
      <header className="shop-hero">
        <PipSays mood={mood} line={line} size={112} />
        <div className="stack" style={{ gap: 8, flex: "1 1 260px" }}>
          <span className="eyebrow">The Workshop</span>
          <h1 className="h1 kid-heading">Parts for Pip, things for Byteville</h1>
          <p>
            You have <strong style={{ color: "var(--text)" }}><SparkAmount n={sparks} size={16} /></strong> to spend.
            Every one came from learning — you've earned {sparksEarned} and spent {spent}.
          </p>
          <div className="row">
            <Link className="btn btn--ghost btn--kid" to="/byteville">Visit Byteville</Link>
          </div>
        </div>
      </header>

      <p className="small muted" style={{ marginTop: 18 }}>
        Earn Sparks by answering questions (5), finishing games (15) and lessons (10), whole topics (50) and courses (200),
        and 5 for the first thing you do each day. Each one pays once.
      </p>

      {SLOTS.map((slot) => (
        <section key={slot.id} style={{ marginTop: 30 }} aria-labelledby={`slot-${slot.id}`}>
          <h2 id={`slot-${slot.id}`} className="h3 kid-heading" style={{ marginBottom: 12 }}>{slot.title}</h2>
          <div className="shop-grid">
            {shopItems
              .filter((i) => i.slot === slot.id)
              .map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  confirming={confirm === item.id}
                  onAsk={() => setConfirm(item.id)}
                  onCancel={() => setConfirm(null)}
                  onBought={bought}
                />
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
