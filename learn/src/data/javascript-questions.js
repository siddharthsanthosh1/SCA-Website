/* ---------------------------------------------------------------------------
   Web Development — practice questions.

   Same kinds as python-questions.js:
     mcq   { prompt, code?, options[], answer (index), explain }
     fill  { prompt, code (with ___), accept[], explain }
     code  { prompt, panes, starter, checks[], hint, solution, explain?, actions? }

   Wrong options are deliberate: each is the answer a student gets from one
   specific mistake, and the explanation names that mistake.
   --------------------------------------------------------------------------- */

export const javascriptQuestions = [
  /* ------------------------------------------- 1.1 What a website actually is */
  {
    id: "web-1-1-a", lesson: "1.1", kind: "mcq",
    prompt: "Which job does HTML do on a web page?",
    options: [
      "Says what is on the page — headings, paragraphs, pictures, links",
      "Sets the colours and fonts",
      "Makes buttons do something when you click them",
      "Stores the website on the internet",
    ],
    answer: 0,
    explain: "HTML is the content and its structure. Colours and fonts are CSS, and reacting to clicks is JavaScript — mixing those up is the most common first confusion, because all three arrive together in one page.",
  },
  {
    id: "web-1-1-b", lesson: "1.1", kind: "mcq",
    prompt: "You type a web address and press Enter. What happens?",
    options: [
      "Your browser asks a server for the page's files, the server sends them, and your browser builds the page",
      "Every website is already stored on your computer, and the address picks one",
      "The server sends a finished picture of the page, like a screenshot",
    ],
    answer: 0,
    explain: "The server sends files — HTML, CSS, JavaScript, images — and *your* browser turns them into a page. That's why the same site can look different on a phone and a laptop: each browser builds it for its own screen.",
  },
  {
    id: "web-1-1-c", lesson: "1.1", kind: "fill",
    prompt: "The main page of most websites is a file called index-dot-something. Fill in the file extension.",
    code: "index.___",
    accept: ["html", "htm"],
    explain: "HTML files end in `.html`. When you visit a site's address with no file name, servers usually send `index.html` by default.",
  },

  /* ------------------------------------------------ 1.2 Your first HTML page */
  {
    id: "web-1-2-a", lesson: "1.2", kind: "mcq",
    prompt: "Which part of an HTML file holds what actually appears on the page?",
    options: ["`<body>`", "`<head>`", "`<title>`", "`<!doctype html>`"],
    answer: 0,
    explain: "Everything visible goes in `<body>`. `<head>` is tempting because it sits at the top, but it holds information *about* the page — and `<title>` only shows in the browser tab, not on the page.",
  },
  {
    id: "web-1-2-b", lesson: "1.2", kind: "mcq",
    prompt: "On this page, the paragraph comes out huge and bold, just like the heading. Why?",
    code: `<h1>Riverside Food Bank<h1>\n<p>Open Saturdays, 9 to 12.</p>`,
    options: [
      "The heading's closing tag is missing its `/`, so the browser starts a second heading and the paragraph ends up inside it",
      "Paragraphs always copy the style of the heading above them",
      "`<p>` needs to come before `<h1>`",
      "The paragraph needs its own `<body>` tag",
    ],
    answer: 0,
    explain: "`<h1>` without the slash is another *opening* tag. The browser starts a new heading and never sees it closed, so everything after it is part of that heading. Paragraphs don't inherit styles from the heading above — they only looked that way because they were inside one.",
  },
  {
    id: "web-1-2-c", lesson: "1.2", kind: "fill",
    prompt: "Close this paragraph properly.",
    code: "<p>We're open on Saturdays.<___>",
    accept: ["/p", "</p>"],
    explain: "A closing tag is the same word as the opening tag with a slash in front: `</p>`. Forgetting the slash is the single most common HTML mistake.",
  },
  {
    id: "web-1-2-d", lesson: "1.2", kind: "code", panes: ["html"],
    prompt: "Make the start of a page for a food bank: an `<h1>` that says exactly **Riverside Food Bank**, and under it a `<p>` paragraph saying anything you like about it.",
    starter: { html: "<!-- Write your heading and paragraph below -->\n" },
    checks: [
      { type: "dom", selector: "h1", text: "Riverside Food Bank" },
      { type: "dom", selector: "p", exists: true },
    ],
    hint: "Open the tag, write the words, close it with a slash: `<h1>Riverside Food Bank</h1>`. Then do the same with `<p>`.",
    solution: { html: "<h1>Riverside Food Bank</h1>\n<p>Free groceries for anyone who needs them, every Saturday morning.</p>" },
    explain: "Two elements, each opened and closed. You'll notice the browser already gives the heading its big bold look — that's its built-in style, which CSS will let you change.",
  },

  /* ------------------------------------ 1.3 Headings, paragraphs and links */
  {
    id: "web-1-3-a", lesson: "1.3", kind: "mcq",
    prompt: "A page has its title at the top and three sections underneath. Which tag should each section heading use?",
    options: [
      "`<h2>` — the sections sit one level below the page's `<h1>`",
      "`<h1>`, so the sections look important",
      "`<h4>`, because it's a nicer size",
      "A `<p>` with the words in bold",
    ],
    answer: 0,
    explain: "Headings are an outline. One `<h1>` for the page, `<h2>` for its sections. Choosing `<h4>` for its size is the classic mistake — if you want a different size, that's a job for CSS, and the outline stays correct for screen readers.",
  },
  {
    id: "web-1-3-b", lesson: "1.3", kind: "mcq",
    prompt: "This link is on a page at riverside.org. Someone clicks it. What happens?",
    code: `<a href="www.example.org">Visit our partner</a>`,
    options: [
      "The browser looks for a page called `www.example.org` on riverside.org itself, and finds nothing",
      "It goes to example.org — the browser fills in the `https://`",
      "Nothing — the text doesn't show up as a link at all",
      "It opens example.org in a new tab",
    ],
    answer: 0,
    explain: "Without `https://`, an `href` is treated as a path on your own site, the same as `href=\"about.html\"`. The address bar fills in `https://` when *you* type, which is why people expect links to do the same. They don't.",
  },
  {
    id: "web-1-3-c", lesson: "1.3", kind: "code", panes: ["html"],
    prompt: "Under the paragraph, add a link that says exactly **Search the catalog** and goes to `https://example.org/catalog`.",
    starter: { html: "<h1>Riverside Library</h1>\n<p>Looking for a book?</p>\n" },
    checks: [
      { type: "dom", selector: "a", attr: "href", equals: "https://example.org/catalog" },
      { type: "dom", selector: "a", text: "Search the catalog" },
    ],
    hint: "A link is `<a href=\"where it goes\">what people click</a>`. Copy the address exactly, including `https://`.",
    solution: { html: "<h1>Riverside Library</h1>\n<p>Looking for a book?</p>\n<a href=\"https://example.org/catalog\">Search the catalog</a>" },
    explain: "The `href` is where it goes, the text is what people click. Clicking it in the preview won't leave the page — links are switched off in there — but on a real site it would.",
  },
  {
    id: "web-1-3-d", lesson: "1.3", kind: "code", panes: ["html"],
    prompt: "This page uses `<h1>` for everything. Keep the page title as the only `<h1>`, and make **When** and **Where** into section headings one level below it.",
    starter: { html: "<h1>Park Cleanup Day</h1>\n<h1>When</h1>\n<p>Saturday, 10am to 1pm.</p>\n<h1>Where</h1>\n<p>Meet at the north gate of Riverside Park.</p>\n" },
    checks: [
      { type: "dom", selector: "h1", count: 1 },
      { type: "dom", selector: "h1", text: "Park Cleanup Day" },
      { type: "dom", selector: "h2", count: 2 },
    ],
    hint: "One level below `<h1>` is `<h2>`. Change both the opening and the closing tag of each section heading.",
    solution: { html: "<h1>Park Cleanup Day</h1>\n<h2>When</h2>\n<p>Saturday, 10am to 1pm.</p>\n<h2>Where</h2>\n<p>Meet at the north gate of Riverside Park.</p>" },
    explain: "Now the page reads as an outline: one title, two sections. A screen reader user can jump straight to \"Where\" without hearing the rest.",
  },

  /* ------------------------------------------------------- 2.1 Lists and images */
  {
    id: "web-2-1-a", lesson: "2.1", kind: "mcq",
    prompt: "You're writing the steps to become a volunteer: fill in the form, come to training, pick a shift. Which list should you use?",
    options: ["`<ol>`", "`<ul>`", "Three `<li>` elements with no list around them", "`<list type=\"numbers\">`"],
    answer: 0,
    explain: "The steps only work in that order, so it's an ordered list. `<ul>` would show bullets and lose the meaning that step 2 follows step 1. And `<li>` belongs inside a list — on its own it's not valid HTML.",
  },
  {
    id: "web-2-1-b", lesson: "2.1", kind: "mcq",
    prompt: "A photo shows volunteers sorting cans at the food bank. Which is the best `alt` text?",
    options: [
      "`alt=\"image\"`",
      "`alt=\"IMG_2041.jpg\"`",
      "`alt=\"Volunteers sorting cans into boxes at the food bank\"`",
      "`alt=\"Click here\"`",
    ],
    answer: 2,
    explain: "Alt text is read aloud in place of the picture, so it should say what the picture shows. \"image\" tells a screen reader user nothing they didn't already know, and a file name is worse — it's what people paste in when they're told alt is required but not why.",
  },
  {
    id: "web-2-1-c", lesson: "2.1", kind: "code", panes: ["html"],
    prompt: "These three items are written as paragraphs. Turn them into a bulleted list — one list, three items, in the same order.",
    starter: { html: "<h2>Most needed this week</h2>\n<p>Canned beans</p>\n<p>Rice</p>\n<p>Peanut butter</p>\n" },
    checks: [
      { type: "dom", selector: "ul", exists: true },
      { type: "dom", selector: "ul li", count: 3, label: "a list item" },
      { type: "dom", selector: "ul li", text: "Canned beans", label: "a list item" },
    ],
    hint: "Bullets mean `<ul>`. Wrap everything in one `<ul>`, then change each `<p>` to `<li>`.",
    solution: { html: "<h2>Most needed this week</h2>\n<ul>\n  <li>Canned beans</li>\n  <li>Rice</li>\n  <li>Peanut butter</li>\n</ul>" },
    explain: "One `<ul>` around the whole list, one `<li>` per item. The order doesn't matter to meaning here, so it's unordered — the bullets come free.",
  },
  {
    id: "web-2-1-d", lesson: "2.1", kind: "code", panes: ["html"],
    prompt: "This picture has no `alt` text. Add one that describes it: the photo shows volunteers packing food boxes.\n\nThe file doesn't exist in this preview, so you'll see a broken picture — which is exactly when alt text gets shown.",
    starter: { html: "<h2>Our volunteers</h2>\n<img src=\"volunteers.jpg\">\n" },
    checks: [
      { type: "dom", selector: "img", attr: "alt", present: true },
      { type: "dom", selector: "img", attr: "src", equals: "volunteers.jpg" },
    ],
    hint: "Add `alt=\"...\"` inside the `<img>` tag, next to `src`. Describe the picture in a sentence.",
    solution: { html: "<h2>Our volunteers</h2>\n<img src=\"volunteers.jpg\" alt=\"Volunteers packing boxes of food at the Riverside Food Bank\">" },
    explain: "Now anyone who can't see the picture — because they use a screen reader, or because it didn't load — still gets what it was there to say.",
  },

  /* ---------------------------------- 2.2 Divs, sections and semantic tags */
  {
    id: "web-2-2-a", lesson: "2.2", kind: "mcq",
    prompt: "Your site has a row of links at the top: Home, Events, Donate. Which tag should wrap them?",
    options: ["`<nav>`", "`<div class=\"nav\">`", "`<section>`", "`<p>`"],
    answer: 0,
    explain: "`<nav>` says \"these are the ways around the site\", and screen readers let people jump straight to it. A `<div class=\"nav\">` can look identical, which is why it's tempting — but the class name means nothing to anyone except you.",
  },
  {
    id: "web-2-2-b", lesson: "2.2", kind: "mcq",
    prompt: "You change a `<div>` to `<main>`. What changes on screen?",
    options: [
      "Nothing — they look the same. `<main>` tells browsers and screen readers what that part is",
      "The content gets bigger and bolder",
      "The content moves to the middle of the screen",
      "The page breaks, because `<main>` needs CSS to work",
    ],
    answer: 0,
    explain: "Semantic tags describe *what* something is, not how it looks. It's easy to assume every tag changes the look because headings do — but how things look is CSS's job, and `<main>` has no style of its own.",
  },
  {
    id: "web-2-2-c", lesson: "2.2", kind: "code", panes: ["html"],
    prompt: "This page is built from three plain `<div>`s. Replace each with the semantic tag that says what it is: the top part with the name, the main content, and the address at the bottom.",
    starter: { html: "<div>\n  <h1>Riverside Library</h1>\n</div>\n<div>\n  <h2>Opening hours</h2>\n  <p>Monday to Saturday, 9am to 6pm.</p>\n</div>\n<div>\n  <p>123 River Road</p>\n</div>\n" },
    checks: [
      { type: "dom", selector: "header", exists: true },
      { type: "dom", selector: "header h1", exists: true, label: "an `<h1>` inside your `<header>`" },
      { type: "dom", selector: "main", exists: true },
      { type: "dom", selector: "footer", exists: true },
      { type: "dom", selector: "div", exists: false, hint: "There's still a `<div>` on the page. Swap each one for the tag that says what that part is." },
    ],
    hint: "The top is a `<header>`, the middle is `<main>`, the bottom is a `<footer>`. Change both the opening and the closing tag each time.",
    solution: { html: "<header>\n  <h1>Riverside Library</h1>\n</header>\n<main>\n  <h2>Opening hours</h2>\n  <p>Monday to Saturday, 9am to 6pm.</p>\n</main>\n<footer>\n  <p>123 River Road</p>\n</footer>" },
    explain: "The preview looks exactly the same as before — and that's the point. The change is in what the page *means*, which is what screen readers and search engines read.",
  },
  {
    id: "web-2-2-d", lesson: "2.2", kind: "fill",
    prompt: "Fill in the tag that wraps a site's main links.",
    code: "<___>\n  <a href=\"/\">Home</a>\n  <a href=\"/events\">Events</a>\n  <a href=\"/donate\">Donate</a>\n</nav>",
    accept: ["nav", "<nav>"],
    explain: "The closing tag gives it away: `</nav>` needs an opening `<nav>`. Opening and closing tags always use the same word.",
  },

  /* ----------------------------------------------------- 2.3 Forms and inputs */
  {
    id: "web-2-3-a", lesson: "2.3", kind: "mcq",
    prompt: "Why give each input a `<label>` instead of only `placeholder` text?",
    options: [
      "A placeholder disappears as soon as you type, and many screen readers don't read it as the box's name",
      "Placeholders don't work inside a `<form>`",
      "Labels make the input box bigger",
      "Without labels the form can't be sent",
    ],
    answer: 0,
    explain: "Placeholders look like labels, which is why people use them that way. But halfway through typing, you can no longer see what the box was for — and a screen reader may announce it as just \"edit text\". The form works either way; the label is for the person filling it in.",
  },
  {
    id: "web-2-3-b", lesson: "2.3", kind: "mcq",
    prompt: "Clicking the word **Email** doesn't put the cursor in the box, and a screen reader announces the box with no name. Why?",
    code: `<label for="email">Email</label>\n<input type="email" id="mail">`,
    options: [
      "The label's `for` is `email` but the input's `id` is `mail` — they have to match exactly",
      "`for` should say `name`, not `email`",
      "The label has to go inside the `<input>` tag",
      "`type=\"email\"` boxes can't have labels",
    ],
    answer: 0,
    explain: "`for` points at an `id`, and the match has to be exact — `email` and `mail` are as different as two unrelated words. A one-letter typo here breaks the connection silently; the page still looks fine.",
  },
  {
    id: "web-2-3-c", lesson: "2.3", kind: "code", panes: ["html"],
    prompt: "Build a volunteer sign-up form under the heading. It needs:\n\n- a `<form>`\n- a label saying **Email**, connected to an email input with `id=\"email\"`\n- a `<button>` that says **Sign up**",
    starter: { html: "<h2>Volunteer sign-up</h2>\n<!-- Build the form here -->\n" },
    checks: [
      { type: "dom", selector: "form", exists: true },
      { type: "dom", selector: "form input[type=\"email\"]", exists: true, label: "an email `<input>` inside your `<form>`" },
      { type: "dom", selector: "input[type=\"email\"]", attr: "id", equals: "email", label: "an email `<input>`" },
      { type: "dom", selector: "label", attr: "for", equals: "email" },
      { type: "dom", selector: "button", text: "Sign up" },
    ],
    hint: "Inside `<form>...</form>` put `<label for=\"email\">Email</label>`, then `<input type=\"email\" id=\"email\">`, then `<button>Sign up</button>`.",
    solution: { html: "<h2>Volunteer sign-up</h2>\n<form>\n  <label for=\"email\">Email</label>\n  <input type=\"email\" id=\"email\" name=\"email\">\n  <button>Sign up</button>\n</form>" },
    explain: "Click the word Email in the preview — the cursor jumps into the box. That's the `for` and `id` matching up, and it's the same connection a screen reader uses.",
  },
  /* ---------------------------------------------- 3.1 Selectors, colour, type */
  {
    id: "web-3-1-a", lesson: "3.1", kind: "mcq",
    prompt: "You want to style only the paragraphs that have `class=\"note\"`. Which selector do you write?",
    options: ["`.note`", "`#note`", "`note`", "`p`"],
    answer: 0,
    explain: "A dot means class. `#note` looks for an element with `id=\"note\"`, and plain `note` looks for a `<note>` tag, which doesn't exist — so nothing changes and no error tells you why. `p` would style every paragraph, not just the notes.",
  },
  {
    id: "web-3-1-b", lesson: "3.1", kind: "mcq",
    prompt: "What colour is this paragraph's text?",
    code: `<!-- HTML -->\n<p class="warning">The park closes at dusk.</p>\n\n/* CSS */\np {\n  color: blue;\n}\n.warning {\n  color: red;\n}\np {\n  color: green;\n}`,
    options: ["Red", "Green", "Blue", "None — the rules cancel out and it stays black"],
    answer: 0,
    explain: "A class selector is more specific than an element selector, so `.warning` wins even though the second `p` rule comes later. \"The last rule wins\" only breaks ties between selectors that are equally specific — that's why green is so tempting. Rules never cancel each other out; one of them always wins.",
  },
  {
    id: "web-3-1-c", lesson: "3.1", kind: "fill",
    prompt: "Fill in the property that changes the colour of the text itself.",
    code: "h1 {\n  ___: tomato;\n}",
    accept: ["color"],
    explain: "It's `color` — American spelling, nothing in front. `colour`, `font-color` and `text-color` are silently ignored, which is why this typo is so hard to spot. To colour the area behind the text, you'd use `background-color`.",
  },
  {
    id: "web-3-1-d", lesson: "3.1", kind: "code", panes: ["html", "css"],
    prompt: "The Riverside Library page needs some style. In the CSS pane:\n\n• make the `<h1>` dark green (`darkgreen`)\n• give the paragraph with the class `note` a `lightyellow` background",
    starter: {
      html: `<h1>Riverside Library</h1>\n<p>Open every day from 9 to 6.</p>\n<p class="note">Bring your library card to borrow a laptop.</p>`,
      css: `/* Write your rules here */\n`,
    },
    checks: [
      { type: "dom", selector: "h1", style: "color", equals: "darkgreen" },
      { type: "dom", selector: ".note", style: "background-color", equals: "lightyellow", label: "the paragraph with class `note`" },
    ],
    hint: "You need two rules: one with the selector `h1` and one with `.note`. Inside each, write `property: value;` — the properties are `color` and `background-color`.",
    solution: {
      html: `<h1>Riverside Library</h1>\n<p>Open every day from 9 to 6.</p>\n<p class="note">Bring your library card to borrow a laptop.</p>`,
      css: `h1 {\n  color: darkgreen;\n}\n\n.note {\n  background-color: lightyellow;\n}`,
    },
    explain: "An element selector (`h1`) styles every heading of that kind; a class selector (`.note`) styles only what you've labelled. That split — tags for the general look, classes for the special cases — is how most stylesheets are organised.",
  },

  /* --------------------------------------------------------- 3.2 Box model */
  {
    id: "web-3-2-a", lesson: "3.2", kind: "mcq",
    prompt: "How wide is this box on screen, measured from the outside of the left border to the outside of the right border?",
    code: `.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n  margin: 10px;\n}`,
    options: ["250px", "200px", "225px", "270px"],
    answer: 0,
    explain: "By default `width` is the content only. Padding is added on both sides (20 + 20) and so is the border (5 + 5): 200 + 40 + 10 = 250px. 225 comes from counting each side once. 270 adds the margin too — but margin is space outside the border, not part of the box.",
  },
  {
    id: "web-3-2-b", lesson: "3.2", kind: "mcq",
    prompt: "Same box, one line added. How wide is it on screen now, border to border?",
    code: `.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}`,
    options: ["200px", "250px", "150px", "160px"],
    answer: 0,
    explain: "`border-box` makes `width` mean the whole box, padding and border included, so it's exactly 200px. The browser shrinks the content area instead: 200 − 40 − 10 = 150px of room for text. 150 is the content, not the box; 160 forgets the border; 250 is the default, content-box answer.",
  },
  {
    id: "web-3-2-c", lesson: "3.2", kind: "fill",
    prompt: "Fill in the value that makes `width` include the padding and the border.",
    code: ".card {\n  box-sizing: ___;\n  width: 300px;\n  padding: 16px;\n}",
    accept: ["border-box"],
    explain: "`border-box` means \"measure the width at the border\". The default, `content-box`, measures only the content, which is why padding normally makes boxes grow.",
  },
  {
    id: "web-3-2-d", lesson: "3.2", kind: "code", panes: ["html", "css"],
    prompt: "The donation card's text is jammed right against its edge. In the CSS pane, give `.card`:\n\n• 16px of padding on every side\n• a 2px solid border (any colour)\n• `box-sizing: border-box`, so it stays 260px wide",
    starter: {
      html: `<div class="card">\n  <h2>Give a can</h2>\n  <p>Drop canned food at the front desk any weekday.</p>\n</div>`,
      css: `.card {\n  width: 260px;\n  background-color: lightyellow;\n}`,
    },
    checks: [
      { type: "dom", selector: ".card", style: "padding-top", equals: "16px", label: "the card" },
      { type: "dom", selector: ".card", style: "padding-left", equals: "16px", label: "the card" },
      { type: "dom", selector: ".card", style: "border-top-width", equals: "2px", label: "the card",
        hint: "Your card needs a 2px border. A border only shows up if it has a style as well as a width — try `border: 2px solid darkgreen;`." },
      { type: "dom", selector: ".card", style: "box-sizing", equals: "border-box", label: "the card" },
    ],
    hint: "Add three lines inside the `.card` rule: `padding: 16px;`, `border: 2px solid darkgreen;` and `box-sizing: border-box;`.",
    solution: {
      html: `<div class="card">\n  <h2>Give a can</h2>\n  <p>Drop canned food at the front desk any weekday.</p>\n</div>`,
      css: `.card {\n  width: 260px;\n  background-color: lightyellow;\n  padding: 16px;\n  border: 2px solid darkgreen;\n  box-sizing: border-box;\n}`,
    },
    explain: "Padding gives the text breathing room, and because of `border-box` the card is still exactly 260px wide — the content area shrank to 260 − 32 − 4 = 224px instead of the card growing.",
  },

  /* --------------------------------------------------------- 3.3 Flexbox */
  {
    id: "web-3-3-a", lesson: "3.3", kind: "mcq",
    prompt: "These three cards still stack on top of each other instead of sitting in a row. Why?",
    code: `<!-- HTML -->\n<div class="cards">\n  <div class="card">Food</div>\n  <div class="card">Clothes</div>\n  <div class="card">Books</div>\n</div>\n\n/* CSS */\n.card {\n  display: flex;\n}`,
    options: [
      "`display: flex` has to go on `.cards`, the parent, not on each card",
      "Flexbox only works on `<section>` elements, not `<div>`",
      "It also needs `flex-direction: row`",
      "The cards need `float: left` as well",
    ],
    answer: 0,
    explain: "Flexbox is switched on for a container and arranges that container's children. On `.card`, it makes each card a flex container for its own text, while the cards themselves are still ordinary blocks that stack. `flex-direction: row` is already the default, so adding it changes nothing.",
  },
  {
    id: "web-3-3-b", lesson: "3.3", kind: "mcq",
    prompt: "A `.nav` container has `display: flex` and four links inside. Which line spreads them out so the first link touches the left edge and the last touches the right?",
    options: [
      "`justify-content: space-between;`",
      "`justify-content: center;`",
      "`align-items: space-between;`",
      "`text-align: justify;`",
    ],
    answer: 0,
    explain: "`justify-content` controls spacing along the row, and `space-between` puts all the spare room between the items, none at the ends. `align-items` works across the row (up and down) and doesn't accept `space-between`. `center` bunches the links together in the middle.",
  },
  {
    id: "web-3-3-c", lesson: "3.3", kind: "code", panes: ["html", "css"],
    prompt: "These three cards should sit side by side, but someone put `display: flex` in the wrong rule. Fix the CSS so the cards line up in a row with a **16px gap** between them.",
    starter: {
      html: `<div class="cards">\n  <div class="card">Donate food</div>\n  <div class="card">Volunteer</div>\n  <div class="card">Spread the word</div>\n</div>`,
      css: `.card {\n  display: flex;\n  border: 1px solid #ccc;\n  padding: 12px;\n}`,
    },
    checks: [
      { type: "dom", selector: ".card", count: 3, label: "a card" },
      { type: "dom", selector: ".cards", style: "display", equals: "flex", label: "the `.cards` container" },
      { type: "dom", selector: ".cards", style: "column-gap", equals: "16px", label: "the `.cards` container",
        hint: "Your cards are in a row — now add `gap: 16px;` to the `.cards` rule to space them out." },
    ],
    hint: "Make a new rule with the selector `.cards` (the parent) and put `display: flex;` and `gap: 16px;` in it.",
    solution: {
      html: `<div class="cards">\n  <div class="card">Donate food</div>\n  <div class="card">Volunteer</div>\n  <div class="card">Spread the word</div>\n</div>`,
      css: `.cards {\n  display: flex;\n  gap: 16px;\n}\n\n.card {\n  border: 1px solid #ccc;\n  padding: 12px;\n}`,
    },
    explain: "The container decides the layout; the items just sit in it. `gap` belongs on the container too, which is why it only adds space *between* cards and never at the outside edges.",
  },

  /* ----------------------------------------------------- 4.1 Media queries */
  {
    id: "web-4-1-a", lesson: "4.1", kind: "mcq",
    prompt: "This page is opened on a phone 390px wide. What font size does the body text get?",
    code: `body {\n  font-size: 16px;\n}\n\n@media (min-width: 600px) {\n  body {\n    font-size: 20px;\n  }\n}`,
    options: ["16px", "20px", "18px — halfway between the two", "It depends on which rule is written last"],
    answer: 0,
    explain: "`min-width: 600px` means *600px or wider*. The phone is 390px, so the condition is false and the whole media query is skipped. Reading `min-width` as \"up to 600px\" is the classic slip — that's what `max-width` means. The media query does come last, but order only matters for rules that actually apply.",
  },
  {
    id: "web-4-1-b", lesson: "4.1", kind: "mcq",
    prompt: "Your page looks right when you make your laptop's browser window narrow, but on a real phone everything is tiny and zoomed out. What's the most likely cause?",
    options: [
      "The `<head>` is missing the viewport `<meta>` tag",
      "Phones don't support media queries",
      "The font sizes are in `px` instead of `%`",
      "The stylesheet didn't load on the phone",
    ],
    answer: 0,
    explain: "Without `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, phone browsers pretend the screen is about 980px wide and shrink the page to fit — so your `max-width` media queries never fire. A narrow laptop window doesn't do that pretending, which is why the bug hides until you test on a real phone. If the stylesheet hadn't loaded, the page would look unstyled, not tiny.",
  },
  {
    id: "web-4-1-c", lesson: "4.1", kind: "fill",
    prompt: "Complete the media query so its rule applies to screens **600px wide or narrower**.",
    code: "@media (___: 600px) {\n  .cards {\n    flex-direction: column;\n  }\n}",
    accept: ["max-width"],
    explain: "`max-width: 600px` means \"the screen is at most 600px wide\" — 600 and narrower. `min-width` is the opposite: 600 and wider. Think of max-width as a ceiling on the screen size.",
  },
  {
    id: "web-4-1-d", lesson: "4.1", kind: "code", panes: ["html", "css"],
    prompt: "On a phone, three cards side by side get squashed into thin strips. Add a media query so that on screens **600px wide or narrower**, `.cards` stacks its cards in a column.\n\nKeep the row layout for wider screens.",
    starter: {
      html: `<h1>Ways to help</h1>\n<div class="cards">\n  <div class="card">Donate food</div>\n  <div class="card">Volunteer</div>\n  <div class="card">Spread the word</div>\n</div>`,
      css: `.cards {\n  display: flex;\n  gap: 16px;\n}`,
    },
    checks: [
      { type: "source", contains: "@media", hint: "Start a media query: `@media (max-width: 600px) { ... }`." },
      // Graded by where the cards end up on a phone and on a laptop, not by
      // the CSS text — so max-width, mobile-first min-width, em units and
      // range syntax all pass, as long as the page does the right thing.
      { type: "dom", selector: ".card", layout: "column", viewport: 400, label: "a `.card`",
        hint: "On a phone-sized screen (400px wide) your cards are still side by side. Add a media query for screens 600px and narrower, with a `.cards` rule inside it containing `flex-direction: column;`." },
      { type: "dom", selector: ".card", layout: "row", viewport: 900, label: "a `.card`",
        hint: "On a wide screen (900px) the cards should still sit side by side. Keep `display: flex;` in the normal `.cards` rule, and only change the direction inside the media query." },
    ],
    hint: "Below your `.cards` rule, write `@media (max-width: 600px) {` then a `.cards` rule containing `flex-direction: column;`, then close both sets of curly brackets.",
    solution: {
      html: `<h1>Ways to help</h1>\n<div class="cards">\n  <div class="card">Donate food</div>\n  <div class="card">Volunteer</div>\n  <div class="card">Spread the word</div>\n</div>`,
      css: `.cards {\n  display: flex;\n  gap: 16px;\n}\n\n@media (max-width: 600px) {\n  .cards {\n    flex-direction: column;\n  }\n}`,
    },
    explain: "One media query, and the page fits both screens. If you wrote the row as the normal rule, the media query only overrides the one thing that changes on small screens. If you went mobile first — the column as the normal rule, a `min-width` query for the row — that's just as right, and it's how a lot of real sites are built. Open this lesson on a phone and the preview shows the column.",
  },

  /* ------------------------------------------------------ 4.2 Accessibility */
  {
    id: "web-4-2-a", lesson: "4.2", kind: "mcq",
    prompt: "The food bank page has a photo of volunteers packing cans into boxes. Which alt text is best?",
    options: [
      "`alt=\"Volunteers packing canned food into donation boxes\"`",
      "`alt=\"image\"`",
      "`alt=\"IMG_2041.jpg\"`",
      "`alt=\"\"`",
    ],
    answer: 0,
    explain: "Alt text is read aloud by screen readers and shown when the image can't load, so it should say what the picture shows. \"image\" and a filename tell a listener nothing. An empty `alt=\"\"` is right only for decorative images — it tells screen readers to skip the picture, which would hide the point of this one.",
  },
  {
    id: "web-4-2-b", lesson: "4.2", kind: "mcq",
    prompt: "Your page uses light grey text (`#aaaaaa`) on a white background because it looks clean. What's the problem?",
    options: [
      "Its contrast is about 2.3 to 1, well under the 4.5 to 1 that normal text needs, so many people struggle to read it",
      "There's no problem as long as you can read it on your own screen",
      "Grey isn't a valid CSS colour",
      "Screen readers can't read grey text",
    ],
    answer: 0,
    explain: "Contrast is how much the text stands out from what's behind it. Guidelines ask for at least 4.5 to 1 for normal text, and `#aaaaaa` on white is about 2.3 to 1. Readable on your bright screen doesn't mean readable in sunlight, on a dim laptop or with low vision. Screen readers read text whatever its colour — contrast is about the people who are looking.",
  },
  {
    id: "web-4-2-c", lesson: "4.2", kind: "mcq",
    prompt: "Someone built a Donate button as `<div class=\"btn\" onclick=\"donate()\">Donate</div>`. It works with a mouse. What breaks?",
    options: [
      "Keyboard users can't reach it with Tab or press it with Enter, and screen readers don't announce it as a button",
      "Nothing — a div with onclick behaves exactly like a button",
      "It won't work on phones, because phones don't send clicks",
      "The class `btn` can't be applied to a div",
    ],
    answer: 0,
    explain: "A real `<button>` can be focused with Tab, pressed with Enter or Space, and is announced as a button — all for free. A `<div>` gets none of that, so anyone not using a mouse is stuck. Taps on a phone do send click events, which is exactly why the div seems fine when you test it yourself.",
  },
  {
    id: "web-4-2-d", lesson: "4.2", kind: "code", panes: ["html"],
    prompt: "The food bank's volunteer page has two photos with no alt text. Add an `alt` to both that describes what each photo shows, in a few words.\n\n(The photos don't exist here, so the preview shows your alt text in their place — which is exactly what happens on a real site when an image fails to load.)",
    starter: {
      html: `<h1>Volunteer with us</h1>\n<img src="sorting.jpg">\n<p>Volunteers sort donations every Thursday evening.</p>\n<img src="truck.jpg">\n<p>Our truck collects food from three supermarkets.</p>`,
    },
    checks: [
      { type: "dom", selector: "img", count: 2 },
      { type: "dom", selector: "img", attr: "alt", present: true },
      // Read from the parsed page, so single quotes, double quotes and any
      // attribute order all count the same.
      { type: "dom", selector: "img", attr: "alt", minWords: 2,
        hint: "Describe each photo in a few words, like `alt=\"Volunteers sorting cans into boxes\"`. One word such as \"image\" or \"photo\" doesn't tell a screen reader user anything." },
    ],
    hint: "Inside each `<img>` tag, after the `src`, add `alt=\"...\"` with a short description of what that photo shows.",
    solution: {
      html: `<h1>Volunteer with us</h1>\n<img src="sorting.jpg" alt="Volunteers sorting donated cans into boxes">\n<p>Volunteers sort donations every Thursday evening.</p>\n<img src="truck.jpg" alt="The food bank's delivery truck outside a supermarket">\n<p>Our truck collects food from three supermarkets.</p>`,
    },
    explain: "Good alt text is what you'd say if you were describing the photo to a friend on the phone. Notice that the preview showed it where the broken images were — alt text helps sighted visitors too, whenever an image doesn't load.",
  },
  {
    id: "web-4-2-e", lesson: "4.2", kind: "code", panes: ["html"],
    prompt: "Clicking the words \"Your email\" should put the cursor in the box, and a screen reader should read them out for it. Connect the label to the input: give the input `id=\"email\"` and the label `for=\"email\"`.",
    starter: {
      html: `<form>\n  <label>Your email</label>\n  <input type="email">\n  <button>Sign up</button>\n</form>`,
    },
    checks: [
      { type: "dom", selector: "input", attr: "id", equals: "email" },
      { type: "dom", selector: "label", attr: "for", equals: "email" },
    ],
    hint: "Two attributes, same value: `<label for=\"email\">` and `<input id=\"email\" type=\"email\">`.",
    solution: {
      html: `<form>\n  <label for="email">Your email</label>\n  <input id="email" type="email">\n  <button>Sign up</button>\n</form>`,
    },
    explain: "`for` on the label points at the `id` of the input. Try clicking \"Your email\" in the preview now — the cursor jumps into the box. A bigger click target helps everyone, and the screen reader finally knows what the box is for.",
  },

  /* --------------------------------------------------- 4.3 Whole page */
  {
    id: "web-4-3-a", lesson: "4.3", kind: "mcq",
    prompt: "Where does `<link rel=\"stylesheet\" href=\"style.css\">` belong?",
    options: ["Inside `<head>`", "At the very end of `<body>`", "Inside `<footer>`", "Before `<!doctype html>`"],
    answer: 0,
    explain: "The head holds information about the page — its title, the viewport setting, and which stylesheets to load. Loading styles in the head means they arrive before the content is drawn, so visitors don't see a flash of unstyled page. Nothing ever goes before the doctype.",
  },
  {
    id: "web-4-3-b", lesson: "4.3", kind: "fill",
    prompt: "Fill in the blank so this line loads the page's stylesheet.",
    code: "<link rel=\"___\" href=\"style.css\">",
    accept: ["stylesheet"],
    explain: "`rel` says how the linked file relates to this page — here, it's the stylesheet. Misspell it (`stylesheets`, `style`, `css`) and the browser doesn't apply the file, and it shows no error to tell you.",
  },
  {
    id: "web-4-3-c", lesson: "4.3", kind: "code", panes: ["html", "css"],
    prompt: "Turn this pile of `<div>`s into a proper page for Park Cleanup Day:\n\n• put the title in a `<header>`, as an `<h1>`\n• put the two paragraphs in `<main>`\n• put the contact line in a `<footer>`\n• in the CSS, give the `<header>` a `darkgreen` background and `white` text",
    starter: {
      html: `<div class="top">Park Cleanup Day</div>\n<div class="middle">\n  <p>Saturday, 10am at the north gate.</p>\n  <p>Gloves and bags provided. Bring water.</p>\n</div>\n<div class="bottom">Questions? Email cleanup@example.org</div>`,
      css: `/* Style the header here */\n`,
    },
    checks: [
      { type: "dom", selector: "header h1", exists: true, label: "an `<h1>` inside a `<header>`" },
      { type: "dom", selector: "header h1", text: "Park Cleanup Day", label: "the main heading" },
      { type: "dom", selector: "main p", exists: true, label: "a paragraph inside `<main>`" },
      { type: "dom", selector: "footer", exists: true },
      { type: "dom", selector: "header", style: "background-color", equals: "darkgreen" },
      { type: "dom", selector: "header", style: "color", equals: "white" },
    ],
    hint: "Replace each `<div>` with the right tag: `<header><h1>…</h1></header>`, `<main>…</main>`, `<footer>…</footer>`. Then in the CSS write a `header` rule with `background-color` and `color`.",
    solution: {
      html: `<header>\n  <h1>Park Cleanup Day</h1>\n</header>\n<main>\n  <p>Saturday, 10am at the north gate.</p>\n  <p>Gloves and bags provided. Bring water.</p>\n</main>\n<footer>Questions? Email cleanup@example.org</footer>`,
      css: `header {\n  background-color: darkgreen;\n  color: white;\n  padding: 16px;\n}`,
    },
    explain: "The page looks almost the same as before, but now it says what each part *is*. Screen readers can jump straight to the main content, search engines know which line is the title, and your CSS can target `header` without inventing class names.",
  },
  /* ------------------------------------------------- 5.1 Variables and types */
  {
    id: "web-5-1-a", lesson: "5.1", kind: "mcq",
    prompt: "What does this print?",
    code: 'console.log("5" + 3);',
    options: ["`8`", "`53`", "`\"5\" + 3`", "An error — you can't add text and a number"],
    answer: 1,
    explain: "When either side of `+` is a string, JavaScript joins instead of adding, so the 3 is turned into text and stuck on the end. `8` is tempting because it is what the maths says — but the quotes make the 5 text. Use `Number(\"5\") + 3` when you want 8.",
  },
  {
    id: "web-5-1-b", lesson: "5.1", kind: "mcq",
    prompt: "What happens when this runs?",
    code: "const score = 10;\nscore = 15;\nconsole.log(score);",
    options: [
      "It prints `15`",
      "It prints `10` and ignores the second line",
      "It stops with a TypeError on line 2, before anything is printed",
      "It prints `undefined`",
    ],
    answer: 2,
    explain: "A `const` can't be given a new value, so line 2 throws \"Assignment to constant variable\" and the program stops before the print. It is tempting to think the newest value wins — that is true for `let`, which is what you use when a value needs to change.",
  },
  {
    id: "web-5-1-c", lesson: "5.1", kind: "mcq",
    prompt: "What does this print?",
    code: 'let age = "15";\nconsole.log(typeof age);',
    options: ["`number`", "`string`", "`15`", "`integer`"],
    answer: 1,
    explain: "The quotes make it a string, even though every character is a digit — which is exactly why `number` is tempting. JavaScript also has no separate `integer` type: whole numbers and decimals are both `number`.",
  },
  {
    id: "web-5-1-d", lesson: "5.1", kind: "code", panes: ["js"],
    prompt: "Make a variable called `name` holding the text Ada, and a variable called `year` holding the number 1815. Then use them to print exactly:\n\nAda was born in 1815",
    starter: "// Make your two variables here\n\n",
    checks: [
      { type: "source", matches: "(let|const)\\s+name\\b", hint: "Make a variable called `name` with `let` or `const`." },
      { type: "source", matches: "(let|const)\\s+year\\b", hint: "Make a variable called `year` with `let` or `const`." },
      { type: "stdout", equals: "Ada was born in 1815" },
    ],
    hint: 'Join the pieces with `+`: `name + " was born in " + year`. Watch the spaces inside the quotes.',
    solution: 'const name = "Ada";\nconst year = 1815;\nconsole.log(name + " was born in " + year);',
    explain: "Here `+` joins text to text and then a number to text, which is what you want. The spaces live inside the middle string — leave them out and you get Adawas born in1815.",
  },

  /* --------------------------------------------------------- 5.2 Functions */
  {
    id: "web-5-2-a", lesson: "5.2", kind: "mcq",
    prompt: "What does this print?",
    code: "function double(n) {\n  n * 2;\n}\n\nconsole.log(double(4));",
    options: ["`8`", "`4`", "`undefined`", "`NaN`"],
    answer: 2,
    explain: "The function works out 8 and then throws it away, because nothing says `return`. A function with no `return` gives back `undefined`. `8` is tempting because the maths inside is right — the answer just never leaves the function.",
  },
  {
    id: "web-5-2-b", lesson: "5.2", kind: "fill", caseSensitive: true,
    prompt: "Fill in the blank so the function hands its answer back to whoever called it.",
    code: "function area(width, height) {\n  ___ width * height;\n}",
    accept: ["return"],
    explain: "`return` sends the value back, so `area(3, 4)` becomes `12`. Without it the multiplication still happens, but the call gives `undefined`.",
  },
  {
    id: "web-5-2-c", lesson: "5.2", kind: "mcq",
    prompt: "What does this print?",
    code: 'function greet(name) {\n  return "Hi " + name;\n}\n\nconsole.log(greet());',
    options: ["`Hi `", "`Hi name`", "`Hi undefined`", "An error, because no argument was given"],
    answer: 2,
    explain: "Calling a function with too few arguments isn't an error in JavaScript — the missing parameter is just `undefined`, and `+` turns that into the text \"undefined\". `Hi name` is tempting, but `name` is a variable, not the word name.",
  },
  {
    id: "web-5-2-d", lesson: "5.2", kind: "code", panes: ["js"],
    prompt: "Finish the function `fahrenheit(c)` so it returns the temperature in Fahrenheit: multiply by 9, divide by 5, then add 32.\n\nThe two lines at the bottom should then print 212 and 32.",
    starter: "function fahrenheit(c) {\n  // your formula here\n}\n\nconsole.log(fahrenheit(100));\nconsole.log(fahrenheit(0));",
    checks: [
      // A concise arrow function (`c => c * 9 / 5 + 32`) returns without the
      // keyword. A function that really returns nothing fails the output check.
      { type: "source", matches: "\\breturn\\b|=>", hint: "The function needs to `return` its answer — otherwise it gives back `undefined`." },
      { type: "stdout", equals: "212\n32" },
    ],
    hint: "Inside the function, one line: `return c * 9 / 5 + 32;`",
    solution: "function fahrenheit(c) {\n  return c * 9 / 5 + 32;\n}\n\nconsole.log(fahrenheit(100));\nconsole.log(fahrenheit(0));",
    explain: "The function does the sum once, and every call reuses it with a different `c`. If you saw `undefined` on the way here, that was the missing `return`.",
  },

  /* ------------------------------------------------ 5.3 If statements and loops */
  {
    id: "web-5-3-a", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'console.log(5 == "5");\nconsole.log(5 === "5");',
    options: ["`true`, then `false`", "`true`, then `true`", "`false`, then `false`", "`false`, then `true`"],
    answer: 0,
    explain: "`==` converts the string to a number before comparing, so it says true. `===` also checks the type — number versus string — so it says false. That hidden conversion is why it's safer to always use `===`.",
  },
  {
    id: "web-5-3-b", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'const fruits = ["apple", "pear", "plum"];\n\nfor (let i = 0; i <= fruits.length; i++) {\n  console.log(fruits[i]);\n}',
    options: [
      "apple, pear, plum",
      "apple, pear, plum, then `undefined`",
      "pear, plum, then `undefined`",
      "apple, pear, plum, then the program crashes",
    ],
    answer: 1,
    explain: "The array has 3 items at indexes 0, 1 and 2, but `<=` lets `i` reach 3 too. There is nothing at index 3, and JavaScript quietly gives `undefined` rather than crashing. This is the classic off-by-one: use `i < fruits.length`.",
  },
  {
    id: "web-5-3-c", lesson: "5.3", kind: "mcq",
    prompt: "What does this print?",
    code: 'let lives = 0;\n\nif (lives = 3) {\n  console.log("Still playing");\n} else {\n  console.log("Game over");\n}',
    options: ["`Game over`", "`Still playing`", "Nothing — it's an error", "Both lines"],
    answer: 1,
    explain: "A single `=` doesn't compare — it puts 3 into `lives`, and 3 counts as true, so the `if` branch runs. `Game over` is tempting because lives started at 0, but the condition overwrote it. Comparing needs `===`.",
  },
  {
    id: "web-5-3-d", lesson: "5.3", kind: "code", panes: ["js"],
    prompt: "Use a loop to print the numbers 1 to 5, one per line — but print the word even instead of the number when it is even. The output should be:\n\n1\neven\n3\neven\n5",
    starter: "// Loop from 1 to 5 here\n\n",
    checks: [
      { type: "source", matches: "\\b(for|while)\\b", hint: "Use a `for` or `while` loop rather than five separate prints." },
      // `if` or a ternary (`i % 2 === 0 ? "even" : i`) — both decide.
      { type: "source", matches: "\\bif\\b|\\?[^?:]+:", hint: "You need an `if` to decide between the number and the word." },
      { type: "stdout", equals: "1\neven\n3\neven\n5" },
    ],
    hint: "`i % 2` is the remainder after dividing by 2. It is `0` for even numbers, so test `if (i % 2 === 0)`.",
    solution: 'for (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) {\n    console.log("even");\n  } else {\n    console.log(i);\n  }\n}',
    explain: "The loop counts from 1 and stops after 5 — here `<=` is right, because you want 5 included. Inside, `%` gives the remainder, which is the standard way to test for even and odd.",
  },

  /* ------------------------------------------ 6.1 Finding and changing elements */
  {
    id: "web-6-1-a", lesson: "6.1", kind: "mcq",
    prompt: "The page has `<h1 id=\"title\">Welcome</h1>`. What does this line give back?",
    code: 'document.getElementById("#title");',
    options: ["The `<h1>` element", "`null`", "A list containing the `<h1>`", "The text Welcome"],
    answer: 1,
    explain: "`getElementById` wants the id itself, `\"title\"`. With the `#` it looks for an element whose id is literally #title, finds none, and returns `null`. The `#` is tempting because that's how CSS and `querySelector` write ids.",
  },
  {
    id: "web-6-1-b", lesson: "6.1", kind: "mcq",
    prompt: "What does the list look like after this runs?",
    code: '<ul>\n  <li>Milk</li>\n  <li>Eggs</li>\n  <li>Bread</li>\n</ul>\n\n<script>\n  document.querySelector("li").textContent = "Done";\n</script>',
    options: [
      "Done, Eggs, Bread",
      "Done, Done, Done",
      "Milk, Eggs, Done",
      "Milk, Eggs, Bread — nothing changes",
    ],
    answer: 0,
    explain: "`querySelector` returns the first element that matches, and only that one. It is tempting to think a selector like `li` means every list item, as it does in CSS. To change all of them, use `querySelectorAll(\"li\")` and loop over the result.",
  },
  {
    id: "web-6-1-c", lesson: "6.1", kind: "fill", caseSensitive: true,
    prompt: "Fill in the method that finds an element using a CSS selector, so `#status` works.",
    code: 'const status = document.___("#status");\nstatus.textContent = "Open";',
    accept: ["querySelector"],
    explain: "`querySelector` takes any CSS selector, `#` and all. `getElementById` would also find it, but only if you dropped the `#` and wrote `getElementById(\"status\")`.",
  },
  {
    id: "web-6-1-d", lesson: "6.1", kind: "code", panes: ["html", "js"],
    prompt: "Leave the HTML as it is. In the JavaScript pane, change the headline to Park Cleanup Day and the note to Saturday at 9am.",
    starter: {
      html: '<h1 id="headline">Welcome</h1>\n<p class="note">Loading…</p>',
      js: "// Find the two elements and change their text here\n",
    },
    checks: [
      { type: "dom", selector: "#headline", text: "Welcome", hint: "Leave the HTML saying Welcome — the point is to change it with JavaScript." },
      { type: "dom", selector: "#headline", text: "Park Cleanup Day", live: true, label: "the headline" },
      { type: "dom", selector: ".note", text: "Saturday at 9am", live: true, label: "the note" },
    ],
    hint: 'The headline has an id, the note has a class. `document.querySelector(".note")` finds the note; then set its `textContent`.',
    solution: {
      js: 'document.getElementById("headline").textContent = "Park Cleanup Day";\ndocument.querySelector(".note").textContent = "Saturday at 9am";',
    },
    explain: "Find, then change: that two-step pattern is most of what JavaScript does to a page. Note the id lookup has no `#` but the class selector needs its `.`.",
  },

  /* -------------------------------------------- 6.2 Clicks, events and forms */
  {
    id: "web-6-2-a", lesson: "6.2", kind: "mcq",
    prompt: "What goes wrong with this line?",
    code: 'button.addEventListener("click", sayHi());',
    options: [
      "`sayHi` runs once straight away while the page loads, and clicking does nothing",
      "Nothing — it works",
      "`sayHi` runs twice on every click",
      "It's a syntax error, so the page won't load",
    ],
    answer: 0,
    explain: "The brackets call `sayHi` right now and hand its return value — `undefined` — to `addEventListener`. Pass the function itself, `sayHi` with no brackets, and the browser calls it for you on each click. It's tempting because everywhere else, brackets are how you use a function.",
  },
  {
    id: "web-6-2-b", lesson: "6.2", kind: "mcq",
    prompt: "A sign-up form's submit handler shows a thank-you message, but it flashes up and vanishes as the page reloads. Which line, first in the handler, fixes it?",
    options: ["`event.preventDefault();`", "`return;`", "`event.stop();`", "`form.reload = false;`"],
    answer: 0,
    explain: "Sending a form reloads the page by default, wiping whatever your code just did. `preventDefault()` cancels that default action. A bare `return` is tempting, but it only ends your function — the browser still goes ahead and reloads.",
  },
  {
    id: "web-6-2-c", lesson: "6.2", kind: "code", panes: ["html", "js"],
    prompt: "Make the Add one button work: each click should add 1 to `count` and show the new number in the `#count` span. The checker will click it three times.",
    starter: {
      html: '<button id="add">Add one</button>\n<p>Count: <span id="count">0</span></p>',
      js: 'let count = 0;\nconst button = document.querySelector("#add");\n\n// When the button is clicked, add 1 to count\n// and show it in the #count span\n',
    },
    actions: [
      { do: "click", selector: "#add" },
      { do: "click", selector: "#add" },
      { do: "click", selector: "#add" },
    ],
    checks: [
      { type: "dom", selector: "#count", text: "0", hint: "Leave the 0 in the HTML — JavaScript should be what changes it." },
      { type: "dom", selector: "#count", text: "3", live: true, label: "the count" },
    ],
    hint: 'Use `button.addEventListener("click", function () { ... })`. Inside: add 1 to `count`, then set the span\'s `textContent` to `count`.',
    solution: {
      js: 'let count = 0;\nconst button = document.querySelector("#add");\nconst display = document.querySelector("#count");\n\nbutton.addEventListener("click", function () {\n  count = count + 1;\n  display.textContent = count;\n});',
    },
    explain: "The variable remembers the number between clicks; the span only shows it. Changing `count` alone doesn't touch the page — you have to write it into the span every time.",
  },
  {
    id: "web-6-2-d", lesson: "6.2", kind: "code", panes: ["html", "js"],
    prompt: "When the form is sent, stop the page reloading and show Thanks, followed by the name typed in, then an exclamation mark, in `#thanks`. If someone types Maya, it should say: Thanks, Maya!",
    starter: {
      html: '<form id="signup">\n  <label for="name">Your name</label>\n  <input id="name">\n  <button>Sign up</button>\n</form>\n<p id="thanks"></p>',
      js: 'const form = document.querySelector("#signup");\n\nform.addEventListener("submit", function (event) {\n  // 1. Stop the page from reloading\n  // 2. Read the name and show the thank-you message\n});\n',
    },
    actions: [
      { do: "input", selector: "#name", value: "Maya" },
      { do: "submit", selector: "#signup" },
    ],
    checks: [
      { type: "dom", selector: "#thanks", text: "Thanks, Maya!", live: true, label: "the thanks message" },
      { type: "source", contains: "preventDefault", hint: "Call `event.preventDefault()` first, or a real form reloads the page and your message vanishes." },
    ],
    hint: 'Read the box with `document.querySelector("#name").value`, then join it: `"Thanks, " + name + "!"`.',
    solution: {
      js: 'const form = document.querySelector("#signup");\n\nform.addEventListener("submit", function (event) {\n  event.preventDefault();\n  const name = document.querySelector("#name").value;\n  document.querySelector("#thanks").textContent = "Thanks, " + name + "!";\n});',
    },
    explain: "Listening for `submit` on the form catches both the button and the Enter key. `preventDefault()` keeps the page in place so the message stays, and `.value` is how you read what was typed.",
  },

  /* ------------------------------------------------ 6.3 Mini project */
  {
    id: "web-6-3-a", lesson: "6.3", kind: "mcq",
    prompt: "What happens when this page loads?",
    code: '<head>\n  <script>\n    document.querySelector("#answer").textContent = "Yes!";\n  </script>\n</head>\n<body>\n  <p id="answer">Maybe</p>\n</body>',
    options: [
      "The paragraph says Yes!",
      "The script runs before the paragraph exists, gets `null` and crashes — the paragraph still says Maybe",
      "The browser waits until the paragraph exists, then runs the script",
      "The paragraph disappears",
    ],
    answer: 1,
    explain: "The browser reads the page top to bottom and runs a script the moment it reaches it. At that point the `<p>` hasn't been read yet, so the lookup returns `null`. It's tempting to think the page loads first and scripts run after — that's only true when the script sits at the end of `<body>`.",
  },
  {
    id: "web-6-3-b", lesson: "6.3", kind: "mcq",
    prompt: "The CSS says `.hidden { display: none; }`. After this script runs, can you see the answer?",
    code: '<p id="answer" class="hidden">Tins and pasta</p>\n\n<script>\n  const answer = document.querySelector("#answer");\n  answer.classList.toggle("hidden");\n  answer.classList.toggle("hidden");\n</script>',
    options: [
      "No — the first toggle removes `hidden` and the second adds it back",
      "Yes — toggle only ever removes a class",
      "Yes — the class can't be added twice, so the second toggle does nothing",
      "No — toggle deletes the paragraph",
    ],
    answer: 0,
    explain: "`toggle` flips the class: removes it if it's there, adds it if it isn't. Two toggles put you back where you started. That's exactly what makes it right for a show/hide button — each click flips it.",
  },
  {
    id: "web-6-3-c", lesson: "6.3", kind: "code", panes: ["html", "css", "js"],
    prompt: "This food bank page has an FAQ answer hidden by the `hidden` class. Make the What can I donate? button show the answer when it is clicked. The checker clicks it once. (Bonus: use `classList.toggle` and a second click hides it again.)",
    starter: {
      html: '<header>\n  <h1>Eastside Food Bank</h1>\n</header>\n<section id="faq">\n  <h2>FAQ</h2>\n  <button id="faq-toggle">What can I donate?</button>\n  <p id="answer" class="hidden">Tins, pasta, rice and toiletries.</p>\n</section>',
      css: "body { font-family: sans-serif; padding: 1rem; }\nheader { border-bottom: 3px solid seagreen; }\n.hidden { display: none; }",
      js: 'const toggle = document.querySelector("#faq-toggle");\nconst answer = document.querySelector("#answer");\n\n// When toggle is clicked, add or remove the "hidden" class on answer\n',
    },
    actions: [{ do: "click", selector: "#faq-toggle" }],
    checks: [
      { type: "dom", selector: "#answer.hidden", exists: true, label: "an answer paragraph that starts hidden", hint: 'Keep `class="hidden"` on the answer in your HTML so it starts hidden — the button is what should reveal it.' },
      { type: "dom", selector: "#answer", style: "display", equals: "block", label: "the answer paragraph" },
    ],
    hint: 'Inside a click listener on `toggle`, one line does it: `answer.classList.toggle("hidden");`',
    solution: {
      js: 'const toggle = document.querySelector("#faq-toggle");\nconst answer = document.querySelector("#answer");\n\ntoggle.addEventListener("click", function () {\n  answer.classList.toggle("hidden");\n});',
    },
    explain: "The CSS decides what hidden looks like and the JavaScript decides when it applies. `toggle` handles both directions, so the same click shows the answer and then hides it again.",
  },
];
