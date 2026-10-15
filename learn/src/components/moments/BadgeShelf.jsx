import { useEffect, useMemo, useState } from "react";
import { useProgress } from "../../lib/progress";
import { badges, earnedBadgeIds } from "../../data/badges";
import { Art } from "../art/Shapes";

/* Every badge, earned or not. Unearned ones are greyed out and say in plain
   words how to earn them; the name is always text, not just a picture. */
export default function BadgeShelf() {
  const progress = useProgress();
  const earned = useMemo(() => new Set(earnedBadgeIds(progress.state)), [progress.state]);
  const [fresh] = useState(() => new Set([...earned].filter((id) => !progress.hasSeen(`badge:${id}`))));

  useEffect(() => {
    const t = setTimeout(() => progress.markSeen([...fresh].map((id) => `badge:${id}`)), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p className="small muted" style={{ marginBottom: 12 }}>{earned.size} of {badges.length} earned</p>
      <ul className="badges">
        {badges.map((b) => {
          const on = earned.has(b.id);
          return (
            <li key={b.id} className={"badge" + (on ? "" : " is-off")}>
              <Art shapes={b.draw()} viewBox="0 0 80 92" width={64} height={74} title={on ? `${b.name} badge, earned` : `${b.name} badge, not earned yet`} />
              {on && fresh.has(b.id) && <span className="badge__new">New</span>}
              <span className="badge__name">{b.name}</span>
              <span className="badge__how">{on ? "Earned" : b.how}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
