# Student Code Alliance — website rebuild

A React rebuild of studentcodealliance.org. Same brand palette as the live site
(near-black canvas, warm off-white type, the slate gradient and the green
accent), rebuilt with a modern layout, real components and editable data files.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Requires Node 18 or newer.

## Deploying

`npm run build` produces a static `dist/` folder — drop it on Netlify, Vercel,
GitHub Pages, Cloudflare Pages or any static host. Routing uses `HashRouter`
(`/#/about`), so deep links work on hosts that don't support SPA rewrites. To
switch to clean URLs (`/about`), change `HashRouter` to `BrowserRouter` in
`src/main.jsx` and add a catch-all rewrite to `index.html` on your host.

## What's where

```
src/
  data/            <- edit these, not the pages
    site.js        org details, nav, stats, Google Form links, testimonials, sponsors
    branches.js    international branches
    usStatesGeo.js generated US map geometry + the 50 state branches
    curriculum.js  the five courses
    faq.js         questions and answers
    volunteer.js   volunteer roles
  components/      Header, Footer, UsMap, BranchDialog, Accordion, Reveal, Logo, ...
  pages/           Home, About, Branches, Curriculum, StartingABranch,
                   Volunteer, Hackathon, Faq, NotFound
  styles/
    global.css     design tokens (colors, spacing, buttons, cards) + reset
    components.css everything component-specific
```

### Common edits

**Change a stat, link or form URL** — `src/data/site.js`. Every page reads from
there, including the header CTA and the footer.

**Add, rename or remove an international branch** — `src/data/branches.js`.

**State branches** come from `src/data/usStatesGeo.js`, which also holds the map
geometry. Each state's address is derived from its abbreviation
(`nc@studentcodealliance.org`) in `src/pages/Branches.jsx` — if a state uses a
different address, add an override there.

**Change the colors** — `:root` at the top of `src/styles/global.css`. The green
(`--green`), the blue (`--blue`) and the slate gradient (`--grad-slate`) are the
three brand values everything else derives from.

**Swap in the real logo** — replace the SVG in `src/components/Logo.jsx` and
`public/favicon.svg`, or import an image file and render it instead.

## Regenerating the map

`src/data/usStatesGeo.js` is generated and checked in, so you never need to run
this unless you want different geometry or projection. If you do:

```bash
npm install --no-save us-atlas topojson-client topojson-simplify d3-geo
node scripts/generate-us-map.mjs
```

The source is the public-domain us-atlas TopoJSON (Natural Earth), simplified,
projected with Albers USA, and written out as plain path strings — so the site
itself ships with no mapping libraries.

## Notes on this rebuild

- The **About page keeps the org's story and drops the executive board section**,
  as requested. Nothing else was removed.
- The branch map is a real geographic map of the US. Click any state to open a
  dialog with that branch's contact, its outline drawn as artwork, a copy button
  and a sign-up link. Escape or a click outside closes it. Small north-eastern
  states get their label placed outside the shape with a leader line and a
  larger tap target, the search box filters the map and offers clickable
  results, and on phones the map scrolls sideways so it never shrinks to
  unreadable. International branch cards open the same dialog.
- FAQ answers, course descriptions, volunteer roles and branch contacts were
  taken from the live site. A few sentences were tightened for readability;
  nothing factual was changed or invented.
- Fonts load from Google Fonts (Inter + JetBrains Mono) with system fallbacks.
- No tracking, no analytics, no cookies.
