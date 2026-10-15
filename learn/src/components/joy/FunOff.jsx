import { Link } from "react-router-dom";
import { useProgress } from "../../lib/progress";

/* What the Workshop and Byteville show when Fun mode is off. Plain, and
   nothing is lost: Sparks have kept counting the whole time. */
export default function FunOff({ place }) {
  const progress = useProgress();
  return (
    <main className="shell" style={{ paddingBlock: "clamp(28px, 6vw, 56px) 72px" }}>
      <div className="card stack" style={{ gap: 12, maxWidth: 560 }}>
        <h1 className="h2">{place} is switched off</h1>
        <p>
          Fun mode is off, so {place} is hidden. Everything you've earned is still counted and kept.
        </p>
        <div className="row">
          <button className="btn btn--kid" onClick={() => progress.setFun(true)}>Switch Fun mode on</button>
          <Link className="btn btn--ghost btn--kid" to="/me">My progress</Link>
        </div>
      </div>
    </main>
  );
}
