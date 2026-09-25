import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import { faqs } from "../data/faq";
import { org } from "../data/site";

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions we get asked most."
        lede="If your question is not here, email us — we answer everything."
      />

      <section className="section section--tight">
        <div className="shell faq-shell">
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
          <Reveal delay={120}>
            <div className="card faq-contact">
              <h3 className="h3">Still stuck?</h3>
              <p className="muted">
                Reach the team directly and we will point you to the right branch.
              </p>
              <a className="btn btn--ghost btn--sm" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
