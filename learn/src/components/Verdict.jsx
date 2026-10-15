import { Check, Retry } from "./Icons";

/* Right and not-yet each carry an icon and words, never colour alone. */
export default function Verdict({ ok, title, children }) {
  return (
    <div className={"verdict " + (ok ? "verdict--ok" : "verdict--no")} role="status">
      <span className="verdict__icon">{ok ? <Check size={18} bold /> : <Retry size={17} />}</span>
      <div>
        <b>{title}</b>
        {children}
      </div>
    </div>
  );
}
