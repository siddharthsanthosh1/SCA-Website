import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { courses } from "../data/curriculum";
import { org } from "../data/site";
import { CtaBand } from "./Home";

export default function Curriculum() {
  return (
    <>
      <PageHero
        eyebrow="Our curriculum"
        title="Beginner in week one. Social-project builder by week ten."
        lede="Our curriculum was developed by students proficient in programming, with one goal: take a beginner from their first line of code to a project that does something useful in ten weeks."
      />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid grid--2 grid--wide">
            {courses.map((c, i) => (
              <Reveal key={c.name} delay={i * 70}>
                <article className={`card course course--${c.accent}`}>
                  <div className="course__head">
                    <h3 className="h3">{c.name}</h3>
                    <span className={`chip chip--${c.accent}`}>{c.weeks}</span>
                  </div>
                  <p className="muted course__blurb">{c.blurb}</p>
                  <div className="course__foot">
                    <span className="course__audience">{c.audience}</span>
                    <a href={c.href} target="_blank" rel="noreferrer" className="pathway__link">
                      Learn more
                      <span className="arrow" aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="shell">
          <Reveal>
            <div className="card opensource">
              <div>
                <SectionHead
                  eyebrow="Open-sourced"
                  title="Use our curriculum at your own club."
                  lede="We have open-sourced this curriculum and used it to help hundreds of students and school clubs get their own classes running. Java and Python are also available in Spanish."
                />
              </div>
              <a className="btn btn--primary" href={`mailto:${org.curriculumEmail}`}>
                Request the curriculum
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
