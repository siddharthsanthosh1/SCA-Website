import { useState } from "react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import UsMap, { stateShape } from "../components/UsMap";
import BranchDialog from "../components/BranchDialog";
import { internationalBranches } from "../data/branches";
import { forms, org } from "../data/site";

export default function Branches() {
  const [active, setActive] = useState(null);

  const openState = (s) =>
    setActive({
      abbr: s.abbr,
      kicker: s.abbr,
      title: `${s.name} Branch`,
      email: `${s.abbr.toLowerCase()}@studentcodealliance.org`,
      shape: stateShape(s),
    });

  const openIntl = (b) =>
    setActive({
      abbr: b.city,
      kicker: b.country,
      title: `${b.city} Branch`,
      email: b.email,
      shape: null,
    });

  return (
    <>
      <PageHero
        eyebrow="Programs & branches"
        title="Find the branch nearest you."
        lede="Interested in taking one of our courses as a student? Sign up with the form below, then pick your branch. Classes are free everywhere we run them."
      >
        <div className="btn-row">
          <a className="btn btn--accent" href={forms.studentShort} target="_blank" rel="noreferrer">
            Student sign-up form
            <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href={`mailto:${org.email}`}>
            {org.email}
          </a>
        </div>
      </PageHero>

      <section className="section section--tight">
        <div className="shell">
          <SectionHead eyebrow="Domestic" title="Branches across all 50 states." />
          <Reveal>
            <UsMap onSelect={openState} selected={active?.abbr} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="International"
            title="And six cities beyond the U.S."
            lede="Each international branch runs the same free, ten-week curriculum in its own community."
          />
          <div className="grid grid--3">
            {internationalBranches.map((b, i) => (
              <Reveal key={b.email} delay={i * 70}>
                <button className="card intl" onClick={() => openIntl(b)}>
                  <span className="intl__country chip">{b.country}</span>
                  <h3 className="h3 intl__city">{b.city}</h3>
                  {b.region && <p className="muted intl__region">{b.region}</p>}
                  <span className="intl__email">{b.email}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BranchDialog branch={active} onClose={() => setActive(null)} />
    </>
  );
}
