import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import SectionHead from "../components/SectionHead";
import SponsorDialog from "../components/SponsorDialog";
import { asset } from "../lib/asset";
import {
  stats,
  languages,
  testimonials,
  sponsors,
  pathways,
  forms,
  org,
} from "../data/site";

export default function Home() {
  const [sponsor, setSponsor] = useState(null);
  const closeSponsor = useCallback(() => setSponsor(null), []);

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="hero">
        <div className="grid-lines" aria-hidden="true" />
        <div
          className="aura"
          aria-hidden="true"
          style={{
            width: 640,
            height: 640,
            top: -280,
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(31,111,208,0.08), transparent 62%)",
          }}
        />
        <div
          className="aura"
          aria-hidden="true"
          style={{
            width: 420,
            height: 420,
            top: 120,
            right: "-6%",
            background: "radial-gradient(circle, rgba(62,155,52,0.06), transparent 65%)",
          }}
        />

        <div className="shell hero__inner">
          <Reveal as="span" className="chip chip--green hero__badge">
            <span className="pulse" aria-hidden="true" />
            Free classes · taught seven days a week
          </Reveal>

          <Reveal delay={70}>
            <h1 className="hero__title">
              <span className="gradient-text">Student Code</span>
              <span className="accent-text">Alliance</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="hero__lede">{org.tagline}.</p>
          </Reveal>

          <Reveal delay={200}>
            <div className="btn-row hero__actions">
              <a className="btn btn--primary" href={forms.student} target="_blank" rel="noreferrer">
                Sign up for a class
                <span className="arrow" aria-hidden="true">→</span>
              </a>
              <Link className="btn btn--ghost" to="/starting-a-branch">
                Start a branch
              </Link>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="stat-strip">
              {stats.map((s) => (
                <li key={s.label}>
                  <span className="stat-strip__value">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="stat-strip__label">{s.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- languages */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...languages, ...languages, ...languages].map((l, i) => (
            <span key={i} className="marquee__item">
              {l}
              <i />
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- mission */}
      <section className="section">
        <div className="shell mission">
          <div className="mission__left">
            <SectionHead
              eyebrow="Our mission"
              title="Students teaching students to build software that matters."
            />
          </div>
          <div className="mission__right">
            <Reveal delay={80}>
              <p className="lede">
                Student Code Alliance is a non-profit mobilizing our youth to create
                socially-impactful software. We teach online programming lessons seven
                days a week to K-12 students across the globe, and our approach focuses
                on the practical application of skills over raw theory.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                Our hackathons and outreach events give students room to innovate while
                they learn the essence of learning how to learn. Our curriculum is
                open-sourced and has been handed to local CS nonprofits and school clubs
                to support their own educational efforts.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="btn-row">
                <Link className="btn btn--ghost btn--sm" to="/about">
                  More about us
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ pathways */}
      <section className="section section--tight section--band">
        <div className="shell">
          <SectionHead
            eyebrow="Want to get involved?"
            title="Three ways in."
            lede="Whichever door you come through, everything we run is free and student-led."
          />
          <div className="grid grid--3 pathways">
            {pathways.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="card pathway">
                  <span className="pathway__index">0{i + 1}</span>
                  <h3 className="h3">{p.title}</h3>
                  <p className="muted">{p.body}</p>
                  {p.cta.external ? (
                    <a
                      className="pathway__link"
                      href={p.cta.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.cta.label}
                      <span className="arrow" aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link className="pathway__link" to={p.cta.to}>
                      {p.cta.label}
                      <span className="arrow" aria-hidden="true">→</span>
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- testimonials */}
      <section className="section">
        <div className="shell">
          <SectionHead eyebrow="From the families we teach" title="What parents tell us." />
          <div className="grid grid--2">
            {testimonials.map((t, i) => (
              <Reveal key={t.quote} delay={i * 110}>
                <figure className="card quote">
                  <span className="quote__mark" aria-hidden="true">&ldquo;</span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption className="muted">— {t.author}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ sponsors */}
      <section className="section section--tight section--band">
        <div className="shell">
          <SectionHead
            eyebrow="Thank you"
            title="Sponsors"
            lede="The companies that help keep every class free. Tap one to see what they do."
            align="center"
          />
          <div className="grid grid--2 sponsors">
            {sponsors.map((s, i) => (
              <Reveal key={s.name} delay={i * 100}>
                <button
                  type="button"
                  className="card sponsor"
                  onClick={() => setSponsor(s)}
                  aria-haspopup="dialog"
                >
                  <span className="sponsor__logo">
                    <img src={asset(s.logo)} alt={`${s.name} logo`} loading="lazy" />
                  </span>
                  <span className="sponsor__body">
                    <span className="sponsor__name">{s.name}</span>
                    <span className="muted sponsor__note">{s.note}</span>
                    <span className="sponsor__more">
                      What they do
                      <span className="arrow" aria-hidden="true">→</span>
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SponsorDialog sponsor={sponsor} onClose={closeSponsor} />

      {/* ----------------------------------------------------------------- cta */}
      <CtaBand />
    </>
  );
}

export function CtaBand() {
  return (
    <section className="section section--tight">
      <div className="shell">
        <Reveal>
          <div className="cta-band">
            <div
              className="aura"
              aria-hidden="true"
              style={{
                width: 420,
                height: 420,
                bottom: -240,
                left: "12%",
                background: "radial-gradient(circle, rgba(104,204,88,0.14), transparent 65%)",
              }}
            />
            <div className="cta-band__body">
              <h2 className="h2 gradient-text">Ready when you are.</h2>
              <p className="lede">
                Classes are free, virtual and run once a week. Tutoring and leadership
                roles are open year-round.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn--accent" href={forms.student} target="_blank" rel="noreferrer">
                Sign up for a class
                <span className="arrow" aria-hidden="true">→</span>
              </a>
              <Link className="btn btn--ghost" to="/volunteer">
                Volunteer with us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
