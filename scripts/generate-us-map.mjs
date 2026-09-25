import fs from 'node:fs';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import { geoPath, geoAlbersUsa } from 'd3-geo';

const raw = JSON.parse(fs.readFileSync(new URL('../node_modules/us-atlas/states-10m.json', import.meta.url), 'utf8'));
const topo = simplify(presimplify(raw), 0.012);
const fc = feature(topo, topo.objects.states);

// FIPS -> USPS
const FIPS = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC',
  '12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY',
  '22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT',
  '31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH',
  '40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT',
  '50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY',
};

const W = 960, H = 600;
const states = fc.features.filter((f) => FIPS[f.id] && FIPS[f.id] !== 'DC');
const projection = geoAlbersUsa().fitExtent([[14, 14], [W - 132, H - 14]], {
  type: 'FeatureCollection',
  features: states,
});
const path = geoPath(projection);

const round = (s) => s.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(1));

const out = states
  .map((f) => {
    const abbr = FIPS[f.id];
    const d = round(path(f));
    const c = path.centroid(f);
    const b = path.bounds(f);
    return {
      abbr,
      name: f.properties.name,
      d,
      cx: +c[0].toFixed(1),
      cy: +c[1].toFixed(1),
      bbox: [b[0][0], b[0][1], b[1][0] - b[0][0], b[1][1] - b[0][1]].map((n) => +n.toFixed(1)),
    };
  })
  .sort((a, b) => a.abbr.localeCompare(b.abbr));

// small states get their label pushed outside the shape with a leader line
const OUTSET = {
  VT: [-44, -62], NH: [30, -54], MA: [64, -12], RI: [58, 10], CT: [46, 30],
  NJ: [54, 16], DE: [62, 10], MD: [78, 34],
};

// tight viewBox around the shapes AND the outset labels
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const s of out) {
  const [x, y, w, h] = s.bbox;
  minX = Math.min(minX, x); minY = Math.min(minY, y);
  maxX = Math.max(maxX, x + w); maxY = Math.max(maxY, y + h);
  const o = OUTSET[s.abbr];
  if (o) {
    const lx = s.cx + o[0], ly = s.cy + o[1];
    minX = Math.min(minX, lx - 10); minY = Math.min(minY, ly - 14);
    maxX = Math.max(maxX, lx + 32); maxY = Math.max(maxY, ly + 14);
  }
}
const P = 10;
const VB = [minX - P, minY - P, maxX - minX + P * 2, maxY - minY + P * 2].map((n) => +n.toFixed(1));

const body = out
  .map((s) => {
    const o = OUTSET[s.abbr];
    const extra = o ? `, lx: ${(s.cx + o[0]).toFixed(1)}, ly: ${(s.cy + o[1]).toFixed(1)}, outset: true` : '';
    return `  { abbr: "${s.abbr}", name: ${JSON.stringify(s.name)}, cx: ${s.cx}, cy: ${s.cy}${extra}, bbox: [${s.bbox.join(', ')}], d: "${s.d}" }`;
  })
  .join(',\n');

const file = `/* ---------------------------------------------------------------------------
   Pre-computed US state geometry.

   Generated from the us-atlas TopoJSON (Natural Earth, public domain) projected
   with d3-geo's Albers USA projection into a ${W}x${H} viewBox. Baked into this
   file so the site ships with no mapping dependencies at runtime.

   \`cx\`/\`cy\` are label anchors and \`bbox\` is [x, y, width, height], used to frame
   a single state on its own in the branch dialog. Small north-eastern states
   carry \`lx\`/\`ly\` and \`outset: true\` — their labels sit outside the shape with
   a leader line.
   --------------------------------------------------------------------------- */

export const MAP_VIEWBOX = "${VB.join(' ')}";

export const usStates = [
${body},
];
`;

fs.writeFileSync(new URL('../src/data/usStatesGeo.js', import.meta.url), file);
console.log('states:', out.length, 'bytes:', file.length);
