import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { nav, org, forms } from "../data/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner shell">
        <Link to="/" className="brand" aria-label={`${org.name} — home`}>
          <Logo />
          <span className="brand__text">
            <strong>Student Code</strong>
            <span>Alliance</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `site-nav__link ${isActive ? "is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <a
            className="btn btn--accent btn--sm"
            href={forms.student}
            target="_blank"
            rel="noreferrer"
          >
            Join a class
          </a>
          <button
            className={`burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {nav.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ "--i": i }}
              className={({ isActive }) =>
                `mobile-menu__link ${isActive ? "is-active" : ""}`
              }
            >
              <span>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12 12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavLink>
          ))}
        </nav>
        <a
          className="btn btn--accent"
          href={forms.student}
          target="_blank"
          rel="noreferrer"
        >
          Join a class
        </a>
      </div>
    </header>
  );
}
