import { useEffect, useRef, useState } from "react";
import { forms } from "../data/site";

/* Modal shown when a branch is selected on the map or in the international list. */
export default function BranchDialog({ branch, onClose }) {
  const panelRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!branch) return;
    setCopied(false);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [branch, onClose]);

  if (!branch) return null;

  const { title, kicker, email, shape } = branch;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__backdrop" aria-hidden="true" />
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} branch`}
        tabIndex={-1}
        ref={panelRef}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal__art" aria-hidden="true">
          {shape ? (
            <svg viewBox={shape.viewBox} className="modal__shape">
              <defs>
                <linearGradient id="modal-shape-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1f6fd0" />
                  <stop offset="100%" stopColor="#3e9b34" />
                </linearGradient>
              </defs>
              <path d={shape.d} fill="url(#modal-shape-grad)" />
            </svg>
          ) : (
            <span className="modal__monogram">{title.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="modal__body">
          <span className="chip chip--green">{kicker}</span>
          <h3 className="modal__title">{title}</h3>
          <p className="muted modal__sub">
            Free classes · virtual · once a week · 8&ndash;10 weeks
          </p>

          <button className="modal__email" onClick={copy} title="Copy address">
            <span>{email}</span>
            <span className="modal__copy">{copied ? "Copied" : "Copy"}</span>
          </button>

          <div className="btn-row modal__actions">
            <a className="btn btn--accent btn--sm" href={forms.studentShort} target="_blank" rel="noreferrer">
              Sign up for a class
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost btn--sm" href={`mailto:${email}`}>
              Email this branch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
