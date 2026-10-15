/* The Sparks economy, checked. Run with: npm run check:economy

   Walks every course, prints exactly how many Sparks it can ever pay out, and
   fails if finishing Python alone can't buy at least six things in the
   Workshop. A shop a child can't afford is worse than no shop. */

import { courses } from "../src/data/courses.js";
import { shopItems } from "../src/data/shop.js";
import { PAY, earnedBreakdown, isUnlocked } from "../src/lib/sparks.js";
import { emptyState, doneCourse, fullState } from "./lib/synthetic.mjs";

let errors = 0;
const fail = (m) => { console.error("  ✗ " + m); errors++; };
const pad = (v, n) => String(v).padStart(n);

console.log("Sparks per action");
for (const [k, v] of Object.entries(PAY)) console.log(`  ${k.padEnd(9)} ${pad(v, 4)}`);

console.log("\nEarnable per course (every question, game, lesson, topic and the course itself)");
console.log(`  ${"course".padEnd(16)} ${pad("questions", 9)} ${pad("games", 6)} ${pad("lessons", 8)} ${pad("topics", 7)} ${pad("course", 7)} ${pad("total", 7)}`);
const perCourse = {};
for (const c of courses.filter((x) => x.status === "live")) {
  const b = earnedBreakdown(doneCourse(emptyState(), c));
  perCourse[c.id] = b.total;
  const s = b.sparks;
  console.log(`  ${c.title.padEnd(16)} ${pad(s.questions, 9)} ${pad(s.games, 6)} ${pad(s.lessons, 8)} ${pad(s.topics, 7)} ${pad(s.courses, 7)} ${pad(b.total, 7)}`);
}
const all = earnedBreakdown(fullState({ days: 0 })).total;
console.log(`  ${"All five".padEnd(16)} ${pad(all, 52)}`);
console.log(`  (plus ${PAY.day} for each day a student does anything — not counted above)`);

const priced = shopItems.filter((i) => i.price > 0);
const shopTotal = priced.reduce((n, i) => n + i.price, 0);
console.log(`\nWorkshop: ${shopItems.length} items, ${priced.length} with a price, ${shopTotal} Sparks to buy everything`);

// Python is the first course for most kids. What it alone can buy, using
// only items open to someone who has finished Python and nothing else:
const pythonDone = doneCourse(emptyState(), courses.find((c) => c.id === "python"));
const open = priced.filter((i) => isUnlocked(pythonDone, i)).sort((a, b) => a.price - b.price);
let budget = perCourse.python;
const basket = [];
for (const i of open) if (i.price <= budget) { basket.push(i); budget -= i.price; }
console.log(`\nFinishing Python alone (${perCourse.python} Sparks) buys ${basket.length} items, cheapest first:`);
console.log("  " + basket.map((i) => `${i.name} (${i.price})`).join(", "));
if (basket.length < 6) fail(`Python alone only affords ${basket.length} items — it must afford at least 6`);

const cheapest6 = open.slice(0, 6).reduce((n, i) => n + i.price, 0);
console.log(`  The six cheapest cost ${cheapest6}; Python leaves ${perCourse.python - cheapest6} to spare after them.`);

if (all < shopTotal) console.log(`\nNote: everything in the shop (${shopTotal}) costs more than all five courses pay (${all}). Students choose; that's fine.`);
else console.log(`\nFinishing all five courses (${all}) can buy the whole shop (${shopTotal}).`);

console.log(`\n${errors} error(s)`);
process.exit(errors ? 1 : 0);
