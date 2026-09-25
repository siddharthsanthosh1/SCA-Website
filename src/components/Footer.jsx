import { Link } from "react-router-dom";
import Logo from "./Logo";
import { nav, org } from "../data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="brand">
              <Logo size={30} />
              <span className="brand__text">
                <strong>Student Code</strong>
                <span>Alliance</span>
              </span>
            </Link>
            <p className="muted site-footer__tagline">{org.tagline}.</p>
            <div className="site-footer__social">
              <a href={org.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a href={org.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V3h-2.2A4.3 4.3 0 0 0 10.5 7.3V8.5H8V11h2.5v10H14V11h2.4l.6-2.5H14Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href={`mailto:${org.email}`} aria-label="Email us">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m4 8 7.1 4.7a1.6 1.6 0 0 0 1.8 0L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>

          <div className="site-footer__cols">
            <div>
              <h4 className="site-footer__heading">Explore</h4>
              <ul>
                {nav.slice(0, 4).map((i) => (
                  <li key={i.to}>
                    <Link to={i.to}>{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="site-footer__heading">Get involved</h4>
              <ul>
                {nav.slice(4).map((i) => (
                  <li key={i.to}>
                    <Link to={i.to}>{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__col--contact">
              <h4 className="site-footer__heading">Contact</h4>
              <ul>
                <li>
                  <a href={`mailto:${org.email}`}>{org.email}</a>
                </li>
                <li>
                  <a href={org.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={org.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="rule" />

        <div className="site-footer__bottom">
          <span className="muted">
            © {year} {org.name}. All rights reserved.
          </span>
          <span className="muted">Built and run by students.</span>
        </div>
      </div>
    </footer>
  );
}
