import { useEffect, useRef } from "react";
import { org } from "../data/site";
import { asset } from "../lib/asset";

/* Modal shown when a sponsor card is clicked. Shares the branch dialog's look. */
export default function SponsorDialog({ sponsor, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!sponsor) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sponsor, onClose]);

  if (!sponsor) return null;

  const { name, kicker, logo, about, note, url, site } = sponsor;

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__backdrop" aria-hidden="true" />
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`About ${name}`}
        tabIndex={-1}
        ref={panelRef}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal__art modal__art--logo">
          <img src={asset(logo)} alt={`${name} logo`} className="modal__logo" />
        </div>

        <div className="modal__body">
          <span className="chip chip--blue">{kicker}</span>
          <h3 className="modal__title">{name}</h3>
          <p className="modal__about">{about}</p>

          <div className="modal__gift">
            <span className="modal__gift-k">Their support</span>
            <span>{note}</span>
          </div>

          <div className="btn-row modal__actions">
            <a className="btn btn--primary btn--sm" href={url} target="_blank" rel="noreferrer">
              Visit {site}
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost btn--sm" href={`mailto:${org.email}`}>
              Become a sponsor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
