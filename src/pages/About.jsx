import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { CtaBand } from "./Home";
import { stats } from "../data/site";
import CountUp from "../components/CountUp";
import TeamCard from "../components/TeamCard";
import { team } from "../data/team";

const pillars = [
  {
    title: "Practice over theory",
    body: "Our lessons are built so students write code from the first week. Concepts arrive when a project needs them, not before.",
  },
  {
    title: "Technology with a social lens",
    body: "Every course ends in a game or a social project. We want students to see software as something you point at a problem.",
  },
  {
    title: "A network, not a classroom",
    body: "We connect computer science clubs and branches across the country so student leaders can share what works.",
  },
  {
    title: "Open by default",
    body: "Our curriculum is open-sourced and handed to local CS nonprofits and school clubs, in English and in Spanish.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A non-profit run entirely by students."
        lede="Student Code Alliance is a non-profit organization mobilizing our youth to create socially-impactful software."
      />

      <section className="section section--tight">
        <div className="shell">
          <div className="about-body">
          <Reveal>
            <p className="lede">
              We teach online programming lessons seven days a week to students K-12
              across the globe. Our novel approach to teaching focuses solely on a
              practical application of skills over raw theory. Our organization gives
              students the opportunity to innovate through our hackathons and outreach
              events, while teaching them the essence of learning how to learn.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="lede">
              Started by students in New Jersey, we aim to equip future generations with
              skills in technology through a social lens. We focus on large-scale social
              justice in technology projects — initiating hackathons for social issue
              awareness, and establishing a connection of computer science clubs at
              schools across the nation.
            </p>
          </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="shell">
          <Reveal>
            <ul className="stat-panel">
              {stats.map((s) => (
                <li key={s.label}>
                  <span className="stat-panel__value accent-text">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="stat-panel__label">{s.label}</span>
                </li>
              ))}
              <li>
                <span className="stat-panel__value accent-text">All 50</span>
                <span className="stat-panel__label">States covered</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--band">
        <div className="shell">
          <SectionHead
            eyebrow="Our team"
            title="The students running it."
            lede="Our executive board is made up of students who run the branches, curriculum, events and engineering themselves."
          />
          <ul className="grid team-grid">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 70}>
                <TeamCard {...m} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="What we stand for"
            title="Four things we refuse to compromise on."
          />
          <div className="grid grid--2 grid--wide">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="card pillar">
                  <span className="pillar__rule" aria-hidden="true" />
                  <h3 className="h3">{p.title}</h3>
                  <p className="muted">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
