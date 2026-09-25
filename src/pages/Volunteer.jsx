import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { roles } from "../data/volunteer";
import { forms } from "../data/site";

export default function Volunteer() {
  return (
    <>
      <PageHero
        eyebrow="Volunteering opportunities"
        title="Five roles. All of them earn service hours."
        lede="Fill out the form below to tell us which opportunities interest you. Every role contributes to our mission and counts toward your service hours."
      >
        <div className="btn-row">
          <a className="btn btn--accent" href={forms.volunteer} target="_blank" rel="noreferrer">
            Apply to volunteer
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </PageHero>

      <section className="section section--tight">
        <div className="shell">
          <SectionHead eyebrow="Open roles" title="Where you could fit." />
          <div className="grid grid--2 grid--wide">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 75}>
                <article className="card role">
                  <div className="role__head">
                    <h3 className="h3">{r.title}</h3>
                    <span className="chip">{r.tag}</span>
                  </div>
                  <p className="muted">{r.blurb}</p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={roles.length * 75}>
              <div className="card role role--cta">
                <h3 className="h3">Something else in mind?</h3>
                <p className="muted">
                  Tell us on the form. We are a student-run organization and the roles
                  grow with the people who show up.
                </p>
                <a
                  className="btn btn--ghost btn--sm"
                  href={forms.volunteer}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the form
                  <span className="arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
