# Student Code Alliance — Learn

A Khan-Academy-style learning platform. Students read a short lesson, then practise:
multiple choice, predict-the-output, fill-in-the-blank, **real code that runs in their
browser**, and short games. Accounts and progress are handled by Firebase.

All five Student Code Alliance courses are live, each following the SCA course outline in
6 topics and 18 lessons:

| Course | Practice | Lessons | Questions | Games |
|---|---|---|---|---|
| Intro to Python | Live Python (Pyodide) | 18 | 57 | — |
| Web Development | Live HTML/CSS/JS preview + JS console | 18 | 68 | 10 |
| Java | Quizzes + games | 18 | 74 | 10 |
| C++ | Quizzes + games | 18 | 71 | 10 |
| Scratch | Quizzes + games, with real block colours | 18 | 67 | 10 |

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

It works straight away with no Firebase. Progress saves to the browser and a banner says
so. Add your Firebase keys when you're ready and accounts switch on — and from then on
**every page needs an account**: anyone not signed in is sent to the sign-up page, then
back to the page they asked for. There is no guest mode.

```bash
npm run build        # production build into dist/
npm run preview      # serve that build
npm run check:content  # validate every lesson, question, shop item, badge and building
npm run check:economy  # print what every course pays in Sparks; fail if the shop is unaffordable
npm test             # the Sparks rules (nothing pays twice, nothing overspends)
```

Node 18 or newer.

---

## Firebase setup

### 1. Create the project

1. **console.firebase.google.com → Create a project** → name it `student-code-alliance`.
2. **Turn Google Analytics OFF.** You don't need it, and it adds a consent obligation for
   a site aimed at children.
3. **Sign in with an account the organization controls**, not a personal Gmail. Whoever
   owns this project owns the students' accounts. Add both co-presidents as **Owners**
   under *Project settings → Users and permissions* before you do anything else.

### 2. Register the web app

*Project overview → the `</>` icon* → nickname `sca-learn` → tick **Also set up Firebase
Hosting**. Copy the `firebaseConfig` values into `.env.local`:

```bash
cp .env.example .env.local
```

These keys are **public by design** — they ship inside every Firebase web app. Security
comes from `firestore.rules`, not from hiding them. Committing them is fine.

### 3. Authentication

*Build → Authentication → Get started*, then enable:

| Method | Why |
|---|---|
| **Email/Password** | The default for students without a Google account |

Leave **Google** and **Anonymous** off: students sign up with an email and password,
and the sign-in page has no Google button. The sign-in page has a
"Forgot your password?" link, which uses Firebase's built-in reset email (*Authentication →
Templates* lets you change its wording).

Under *Settings → Authorized domains*, add your custom domain when you have one.
`localhost` is already allowed.

### 4. Firestore

*Build → Firestore Database → Create database → **Production mode*** → location
`nam5 (us-central)`.

Then *Rules → paste the contents of `firestore.rules` → Publish*. Do not skip this. In
production mode nothing can be read or written until those rules are in place.

### 5. Deploy

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick your project
npm run build
firebase deploy
```

---

## What's stored where

**Course content is not in Firestore.** Lessons and questions live in `src/data/` as plain
JavaScript. They're free to read, versioned in git, work offline, and a tutor can fix a
typo with a pull request instead of clicking through a console.

Firestore holds only per-student progress:

```
users/{uid}                     name, email, last seen
users/{uid}/progress/all        xp, completed lessons, answers, streak,
                                and `game`: Fun mode, items owned and equipped,
                                days learned, a Sparks snapshot
```

One document per student, written at most once every 2 seconds and only when something
changes. A branch of 300 students doing a lesson a day is nowhere near the Firestore free
tier (50k reads / 20k writes a day).

---

## How the code runner works

| Course | How practice runs | Cost |
|---|---|---|
| Python | **Pyodide** — CPython compiled to WebAssembly, running in the student's browser | Free |
| Web Development | `web` runner: a sandboxed `<iframe>` live preview for HTML/CSS/JS; JavaScript-only exercises run in a sandboxed Web Worker | Free |
| Java, C++, Scratch | Quizzes, predict-the-output, fill-in-the-blank, and games (trace, find the bug, put in order, fill the gaps, blitz) | Free |

Nothing a student writes leaves their computer, and there is no server to run or pay for.

The web preview is an `<iframe srcdoc sandbox="allow-scripts">` with no `allow-same-origin`,
so student code can't reach this page, its cookies or Firebase. Console output, errors and
the facts the grader needs (computed styles, the DOM after JavaScript has run) come back
over `postMessage`. Every `for`/`while`/`do` loop gets a time guard injected, so a half-typed
loop can't freeze the tab while the preview re-renders.

Java and C++ are quiz-only on purpose: there is no free, fast way to compile and run them
in a browser. The options are a paid execution API (Judge0, Piston), a commercial JVM in
WebAssembly (CheerpJ) or a 20 MB+ WASM toolchain per student. The comment at the top of
`src/data/courses.js` records the reasoning and the upgrade path (`runner: "api"`). Those
courses earn their depth through the trace games, where the student predicts every
variable and every printed line.

The Python runtime is ~14 MB, fetched once from the jsDelivr CDN and then cached by the
browser. It only downloads when a student opens their first Python exercise.

### Self-hosting Python

Only needed if a school network blocks jsDelivr.

```bash
npm install pyodide@0.26.4
mkdir -p public/pyodide
cp node_modules/pyodide/{pyodide.js,pyodide.asm.js,pyodide.asm.wasm,python_stdlib.zip,pyodide-lock.json} public/pyodide/
echo "VITE_PYODIDE_URL=/pyodide/" >> .env.local
```

Be aware this adds ~14 MB to every deploy, and Firebase Hosting's free tier allows 360 MB
of transfer per day — roughly 36 first-time visitors. Stay on the CDN unless you have to
move.

---

## The game layer: Pip, Sparks, the Workshop and Byteville

Student Code Alliance teaches kids to build software that helps their community, so the
game is: **you are an engineer, and the things you build appear in a town.**

- **Byteville** — a small town drawn in SVG that starts as an empty field. Every topic a
  student finishes puts a building on the street; every finished course lights up a
  district. It is a picture of what they've learned — nothing in it is random and nothing
  is bought with money.
- **Pip** — a palm-sized robot who learns alongside them. Curious, a bit clumsy, never
  sarcastic. Pip cheers a right answer and shrugs off a wrong one ("Not yet — try again").
- **Sparks** — earned by learning, never bought. Spent in **the Workshop** on parts for Pip
  and decorations for Byteville.

The page stays white. Colour (`--joy-*` in `app.css`) only appears on Pip, Byteville, the
Workshop, badges and celebration moments.

### The economy

| Action | Sparks | Pays |
|---|---|---|
| Question answered correctly | 5 | once per question |
| Game finished | 15 | once per game, whatever the score |
| Lesson completed | 10 | once per lesson |
| Topic completed (all 3 lessons) | 50 | once per topic |
| Course completed | 200 | once per course |
| First activity of a day | 5 | once per calendar day |

The balance is never a counter. `src/lib/sparks.js` works it out from what has been
recorded every time — correct flags, completed lessons, days — minus the catalogue price
of everything owned. Redoing a solved question changes nothing, and a hand-edited number
can't hand out free Sparks. `npm test` checks this (including answering one question five
times and seeing the balance move once); `npm run check:economy` prints what each course
pays and fails if finishing Python alone can't buy at least six things. Today Python pays
965 and the five courses together pay 5685, just over the 5670 it costs to buy the whole
shop.

**Fun mode** (on by default, switch on the My progress page) turns all of this off: no Pip,
no Byteville, no Workshop, no confetti, celebrations shrink to a tick and a line. Sparks keep
counting silently so nothing is lost. The first lesson a student opens offers it once.
Web Development, Java and C++ are marked `older: true` in `courses.js`: Pip never appears
mid-question there, only on lesson-complete and course-complete.

Rules this layer keeps, on purpose — please keep them: no streak guilt, no timers (except
the opt-in blitz, which has a no-timer mode), no fake scarcity, no daily login rewards, no
leaderboards, no notifications, no random rewards, nothing that costs or looks like it
costs money.

### Adding a shop item

Add an entry to `shopItems` in `src/data/shop.js`:

```js
{ id: "hat-wizard", slot: "hat", name: "Wizard Hat", price: 120, hidesAntenna: true,
  draw: () => [opath("M38 31 L60 -16 L82 31 Z", "var(--joy-grape)")] }
```

`slot` is `body`, `hat`, `eyes`, `pack`, `trail` or `town`. Hats, eyes and backpacks draw in
Pip's own frame (`viewBox="0 -16 120 156"`, head at 26–94 × 24–76), so the same drawing is
used on Pip and on the shop card. Town items draw in their own `w × h` frame with the ground
at `y = h`, and need a fixed spot in `TOWN_SPOTS` in `src/data/byteville.js`. Add
`lock: { courseId, topicId? }` or `lock: { anyCourses: 2 }` to make something unlock with
progress — never with spending. Then run `npm run check:content` and `npm run check:economy`.

### Adding a building

There is exactly one building per topic. Each course's buildings live in one block in
`src/data/byteville.js`, keyed by topic id:

```js
t4: ["Loop-de-loop Track", ({ lit }) => [wall(6, 50, 52, "#e8f4fd"), roof(6, 50, 52, 16, "var(--joy-sky)"), win(12, 60, 9, 8, lit)]],
```

Buildings draw in a 64 × 100 frame with the ground at `y = 100`; `lit` is true once the
course is finished, so windows glow. Positions come from `at()`: each course is a 240-wide
district with three lots on the back row (topics 1–3) and three on the front (4–6). A new
course needs a sixth district (widen `SCENE.w` and add it to `DISTRICTS`); a seventh topic
needs a new lot in `at()`. `npm run check:content` fails if a topic has no building, two
buildings share a topic, a building sits outside the scene, or it points at a topic that
doesn't exist.

### No image files

Every visual — Pip, every shop item, every building, every badge, the confetti — is inline
SVG or CSS drawn in code. There are no `.png`/`.jpg` files, no icon fonts, no CDN art and no
generated images, and `npm run check:content` fails if one appears in `src/` or `public/`.
If something can't be drawn as a few SVG shapes, simplify it until it can. The shapes are
plain data (`src/data/art.js`) so the checks can import and draw every one of them in Node.

---

## Adding another language

1. Pick a runner in `src/data/courses.js`: `python`, `web`, `js` or `quiz`. If none fits,
   read the comment at the top of that file before adding one.
2. Create `src/data/<lang>-lessons.js`, `<lang>-questions.js` and `<lang>-games.js` in the
   same shape as an existing course (`java-*.js` is a good template for a quiz course).
   Prefix question ids with a short course code (`java-`, `cpp-`, `scr-`) and game ids
   with `<lang>-g-`, then add both prefixes to `ID_PREFIX`/`GAME_PREFIX` in
   `scripts/validate-content.mjs`.
3. Import the three exports in `src/data/courses.js`, attach them as `topics`,
   `questions` and `games`, and change `status` from `"soon"` to `"live"`.
4. If code samples use a comment marker other than `//`, add it to `COMMENT` in
   `src/components/Blocks.jsx` (the course id is the key).
5. Run `npm run check:content` and `npm run build`, then click through every lesson at
   phone width.

The validator catches the mistakes you can't see by reading: answer indexes pointing past
the end of the options, duplicate ids, questions or games referenced by no lesson (or by
two), fill-in-the-blanks with no blank, code questions with no way to be marked, malformed
`dom` checks, games that break their own rules, unknown Scratch categories and leftover
`TODO`s. It also self-tests the check engine. Run it before every deploy.

### Lesson blocks

```js
{ t: "p", text }                                   // supports `code`, **bold**, *italic*
{ t: "list", items: [] }
{ t: "code", code, caption?, lang? }               // lang: "html" | "css" picks the comment marker
{ t: "callout", tone: "info|tip|warn", title, text }
{ t: "scratch", blocks: [{ text, cat, indent? }], caption? }
```

Anywhere text is rendered, `{{motion:move (10) steps}}` draws an inline Scratch block.
Categories: motion, looks, sound, events, control, sensing, operators, variables, pen,
myblocks. A bare `*` in text starts italics, so keep code in backticks.

### Question formats

```js
// Multiple choice (also used for predict-the-output — add `code`, or `script` for Scratch)
{ id, lesson, kind: "mcq", prompt, code?, script?, options: [], answer: 0, explain }

// Fill in the blank (exactly one ___)
{ id, lesson, kind: "fill", prompt, code: "print(___)", accept: ['"Hi"'], explain }

// Runnable code (python / js runners), graded by actually executing it
{ id, lesson, kind: "code", prompt, starter, stdin?: ["Sam"],
  checks: [{ type: "stdout", equals: "Hi Sam!" },
           { type: "source", contains: "input", hint: "..." }],
  hint, solution }

// Web runner, page task: panes shown, starter/solution keyed by pane
{ id, lesson, kind: "code", panes: ["html", "css"],
  starter: { html, css }, solution: { css },        // solution lists only panes that change
  actions?: [{ do: "click" | "input" | "submit", selector, value? }],
  checks: [
    { type: "dom", selector: "h1", exists: true },
    { type: "dom", selector: "ul li", count: 3, label: "a list item" },
    { type: "dom", selector: "h1", text: "My Site" },          // trimmed, case-insensitive
    { type: "dom", selector: "img", attr: "alt", present: true },
    { type: "dom", selector: ".card", style: "display", equals: "flex" },  // computed style
    { type: "dom", selector: "#out", text: "Hi Sam", live: true },        // after JS + actions
  ],
  hint, explain }

// Web runner, console task: same as a js code question, with panes: ["js"]
```

`stdin` feeds answers to `input()`/`prompt()` so exercises that ask questions can still be
graded. `dom` checks read the HTML as written (parsed with `DOMParser`) unless they need
the rendered page: `style` checks and `live: true` checks are answered by the preview frame
after the student's JavaScript and any `actions` have run. Each failure produces a sentence
a student can act on ("Your page needs an `<h1>` heading"); give a compound selector a
`label` so the message reads naturally, or a `hint` to replace it entirely.

### Games

Games live in `src/data/<lang>-games.js`. A lesson lists them by id in `games: []`, after
its questions, and they show under a **Play** heading. They save through the same
`progress.recordAnswer()` as questions (10 XP the first time), so they need no new
Firestore fields or rules, and they never block finishing a lesson. Every game works by
mouse, touch (tap, then tap where it goes) and keyboard.

```js
// Put the code in order. Lines with identical text and indent are interchangeable.
{ id, lesson, kind: "sort", title, brief, explain,
  lines: [{ text: "int count = 5;", indent: 0 }, { text: "forever", indent: 0, cat: "control" }] }  // ≥3 lines; cat draws a Scratch block

// Find the broken line. Every other line needs a hint that teaches.
{ id, lesson, kind: "bug", title, code: ["...", "..."], buggyLine: 1,
  wrongLineHints: { 0: "...", 2: "..." }, explain }

// Walk the program. `state` is the variables after that line; nothing is revealed
// until the student has answered the step's `ask`.
{ id, lesson, kind: "trace", title, code: ["..."], explain,
  steps: [{ line: 0, state: { i: 0 }, output?: "0", note?: "...",
            ask?: { prompt: "What is i now?", accept: ["1"] } }] }

// Drag tokens into the gaps. The tray must hold decoys as well as the answers.
{ id, lesson, kind: "cloze", title, code: "___ greet(name) {...}", blanks: ["function"],
  tray: ["function", "def", "var"], explain }

// Timed true/false round, ≥12 items, with an untimed option. Personal best is stored as
// a solved answer under "<id>:best:<n>".
{ id, lesson, kind: "blitz", title, seconds: 60,
  items: [{ prompt, answer: true, explain }] }
```

For Scratch, `bug` and `trace` code lines can be `{ text, cat, indent }` instead of strings.

## Before you put this in front of students

- [ ] Have a tutor read every question bank. The Java and C++ snippets were compiled and
      run to check their answer keys, and every web exercise's solution was run through its
      own checks in a browser — but Python and Scratch were checked by hand only, and
      wording, difficulty and distractors still need a teacher's eye before a child sees them.
- [ ] Decide your policy on under-13 accounts. Collecting an email from a child under 13
      in the US brings COPPA into play, and every student now needs an account with an
      email. Talk to whoever advises the org before younger branches sign up — options
      include tutor-created accounts or parental consent.
- [ ] Add a privacy note saying what you store (name, email, lesson progress) and who can
      see it.
- [ ] Test on a school Chromebook. That is what most of these students will use.
