import { useState } from "react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`accordion__item ${isOpen ? "is-open" : ""}`}>
            <button
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="accordion__icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
            <div className="accordion__panel" role="region">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
