import Shapes from "./Shapes";

/* A Byteville building placed in scene coordinates. */
export default function Building({ building, lit = false, grow = false, delay = 0 }) {
  return (
    <g transform={`translate(${building.x} ${building.y - 100})`}>
      <g className={grow ? "town__grow" : undefined} style={grow ? { animationDelay: `${delay}s` } : undefined}>
        <Shapes list={building.draw({ lit })} />
      </g>
    </g>
  );
}
