import Reveal from "./Reveal";

export default function SectionHead({ eyebrow, title, lede, align = "left" }) {
  return (
    <div className={`section-head section-head--${align}`}>
      {eyebrow && (
        <Reveal as="span" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal delay={60}>
        <h2 className="h2 gradient-text">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={110}>
          <p className="lede">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
