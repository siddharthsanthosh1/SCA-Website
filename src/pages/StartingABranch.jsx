import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { forms } from "../data/site";

const steps = [
  {
    title: "Apply",
    body: "Fill out the branch manager form with your past skills and experience in computer science, tutoring and leadership. Applications are competitive, so put your best effort into it.",
  },
  {
    title: "Interview",
    body: "Selected applicants are interviewed by the executive board about how they would run classes in their own community.",
  },
  {
    title: "Sign the contract",
    body: "Before you start, you sign a contract committing to represent our mission and our standards for students.",
  },
  {
    title: "Launch your branch",
    body: "Coordinate dates and times of classes, recruit your tutors, and publicise your classes locally.",
  },
];

const responsibilities = [
  "Coordinate the dates and times of classes",
  "Recruit and support a team of tutors",
  "Publicise classes across your community",
];

export default function StartingABranch() {
  return (
    <>
      <PageHero
        eyebrow="Starting a branch"
        title="Run Student Code Alliance where you live."
        lede="Branch managers are the reason we reach all 50 states and five countries. If you want to lead one, here is exactly what that takes."
      >
        <div className="btn-row">
          <a className="btn btn--accent" href={forms.branchLeader} target="_blank" rel="noreferrer">
            Apply to lead a branch
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </PageHero>

      <section className="section section--tight">
        <div className="shell">
          <SectionHead eyebrow="The process" title="Four steps from application to first class." />
          <ol className="steps">
            {steps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 80} className="steps__item">
                <span className="steps__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="card responsibilities">
              <div>
                <span className="eyebrow">Responsibilities</span>
                <h2 className="h2 gradient-text">What a branch manager owns.</h2>
                <ul className="ticks">
                  {responsibilities.map((r) => (
                    <li key={r}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="m4 9.5 3.2 3.2L14 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <a className="btn btn--primary" href={forms.branchLeader} target="_blank" rel="noreferrer">
                Apply here
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
