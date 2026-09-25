import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, lede, children }) {
  return (
    <section className="page-hero">
      <div className="grid-lines" aria-hidden="true" />
      <div
        className="aura"
        aria-hidden="true"
        style={{
          width: 520,
          height: 520,
          top: -240,
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(31,111,208,0.08), transparent 65%)",
        }}
      />
      <div className="shell page-hero__inner">
        {eyebrow && (
          <Reveal className="eyebrow" as="span">
            {eyebrow}
          </Reveal>
        )}
        <Reveal delay={60}>
          <h1 className="h1 gradient-text page-hero__title">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={120}>
            <p className="lede page-hero__lede">{lede}</p>
          </Reveal>
        )}
        {children && <Reveal delay={180}>{children}</Reveal>}
      </div>
    </section>
  );
}
