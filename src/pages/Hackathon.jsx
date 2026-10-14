import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { forms, org, pastHackathons } from "../data/site";
import { asset } from "../lib/asset";

const facts = [
  { k: "Focus", v: "Mental health technology" },
  { k: "Launch", v: "October" },
  { k: "Who", v: "Youth innovators only" },
  { k: "Goal", v: "Largest youth mental-health hackathon on the East Coast" },
];

export default function Hackathon() {
  return (
    <>
      <PageHero
        eyebrow="Social Hackathon"
        title="Software pointed at the problems that matter."
        lede="Our Social Hackathon challenges youth innovators to develop software-based solutions to significant social issues."
      >
        <div className="btn-row">
          <a className="btn btn--accent" href={forms.volunteer} target="_blank" rel="noreferrer">
            Join the hackathon committee
            <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href={`mailto:${org.email}`}>
            Sponsor or partner
          </a>
        </div>
      </PageHero>

      <section className="section">
        <div className="shell">
          <SectionHead eyebrow="Past hackathons" title="What we've run on Devpost." />
          <div className="grid grid--2">
            {pastHackathons.map((h, i) => (
              <Reveal key={h.name} delay={i * 70}>
                <a className="card past-hack" href={h.url} target="_blank" rel="noreferrer">
                  <span className="past-hack__flier">
                    {h.flier ? (
                      <img src={asset(h.flier)} alt={`${h.name} flier`} loading="lazy" />
                    ) : (
                      <span className="past-hack__placeholder">{h.name}</span>
                    )}
                  </span>
                  <span className="past-hack__body">
                    <span className="fact__k">{h.dates}</span>
                    <span className="fact__v">{h.name}</span>
                    <span className="past-hack__tagline">{h.tagline}</span>
                    <span className="past-hack__stats">
                      {h.stats.map((s) => (
                        <span key={s} className="chip chip--green">{s}</span>
                      ))}
                    </span>
                    <span className="past-hack__more">
                      View on Devpost <span className="arrow" aria-hidden="true">→</span>
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <Reveal>
            <div className="card hack-panel">
              <p className="lede">
                Launching in October, our Social Hackathon focuses on mobilizing youth
                for mental health-based technology. We aspire to be the largest
                youth-only focused hackathon for mental health on the East Coast.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead eyebrow="At a glance" title="The short version." />
          <div className="grid grid--2 facts">
            {facts.map((f, i) => (
              <Reveal key={f.k} delay={i * 70}>
                <div className="card fact">
                  <span className="fact__k">{f.k}</span>
                  <span className="fact__v">{f.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
