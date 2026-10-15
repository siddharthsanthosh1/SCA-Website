/* ---------------------------------------------------------------------------
   Check engine for runnable exercises.

   A question lists `checks`; all of them must pass. Each check returns a
   student-readable message when it fails, so the feedback says what was wrong
   rather than just "incorrect".

   `dom` checks grade the web runner. Structural ones (exists, count, text,
   attr) read `doc`, the student's HTML parsed with DOMParser. Computed-style
   checks — and any check marked `live: true`, for pages whose JavaScript
   changes the DOM — need the rendered frame, so the caller probes the frame
   first and passes the answers in as `live`, keyed by check. That keeps this
   function synchronous and the existing callers untouched.

   `layout` grades how elements actually sit on screen ("column" or "row")
   rather than which CSS put them there, and `viewport` asks for that (or a
   computed style) on a screen of that many pixels — so a media query is
   graded by what it does, whether it's written max-width or mobile-first,
   in px or em.
   --------------------------------------------------------------------------- */

const norm = (s) =>
  String(s ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

const squash = (s) => norm(s).toLowerCase().replace(/\s+/g, " ");

const COMMENTS = {
  python: { line: "#", quotes: "'\"" },
  js: { line: "//", block: ["/*", "*/"], quotes: "'\"`" },
  css: { block: ["/*", "*/"], quotes: "'\"" },
  html: { block: ["<!--", "-->"], quotes: "" },
};

/** Remove comments, so a `source` check isn't passed by writing the word in
    one (`# while` is not a while loop). Strings are skipped over, so a `#` or
    `//` inside quotes stays. */
export function stripComments(src, lang) {
  const c = COMMENTS[lang];
  const s = String(src ?? "");
  if (!c) return s;
  let out = "";
  for (let i = 0; i < s.length; ) {
    const ch = s[i];
    if (c.quotes.includes(ch)) {
      let j = i + 1;
      while (j < s.length && s[j] !== ch && (ch === "`" || s[j] !== "\n")) j += s[j] === "\\" ? 2 : 1;
      out += s.slice(i, j + 1);
      i = j + 1;
    } else if (c.line && s.startsWith(c.line, i)) {
      const end = s.indexOf("\n", i);
      i = end === -1 ? s.length : end;
    } else if (c.block && s.startsWith(c.block[0], i)) {
      const end = s.indexOf(c.block[1], i + c.block[0].length);
      i = end === -1 ? s.length : end + c.block[1].length;
      out += " ";
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

/* Plain-English names for the tags beginners meet, so a failure reads
   "Your page needs an `<h1>` heading" rather than quoting a selector. */
const TAG_NAMES = {
  h1: "an `<h1>` heading", h2: "an `<h2>` heading", h3: "an `<h3>` heading",
  p: "a `<p>` paragraph", a: "an `<a>` link", img: "an `<img>` image",
  ul: "a `<ul>` list", ol: "an `<ol>` numbered list", li: "a `<li>` list item",
  div: "a `<div>`", section: "a `<section>`", header: "a `<header>`", footer: "a `<footer>`",
  nav: "a `<nav>`", main: "a `<main>`", article: "an `<article>`",
  form: "a `<form>`", input: "an `<input>`", label: "a `<label>`", button: "a `<button>`",
  title: "a `<title>`", strong: "a `<strong>`", em: "an `<em>`", table: "a `<table>`",
};

const describe = (c) => c.label || TAG_NAMES[c.selector] || `an element matching \`${c.selector}\``;
const bare = (what) => what.replace(/^(an?|the) /i, "");
const plural = (what, n) =>
  n === 1 ? bare(what) : / matching /.test(what) ? bare(what).replace("element", "elements") : bare(what) + "s";
const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");

function domCheck(c, { doc, live }) {
  const what = describe(c);
  const probe = live?.get(c);
  const where = c.viewport ? `On a screen ${c.viewport}px wide, your` : "Your";
  if ((c.style !== undefined || c.layout !== undefined || c.live) && !probe)
    return "The preview didn't answer in time. If your JavaScript has a loop, check that it can finish, then try again.";
  if (probe?.error) return `\`${c.selector}\` isn't a selector the browser understands.`;

  let count, text, attrs;
  if (probe) {
    ({ count, text, attrs } = probe);
  } else {
    if (!doc) return "This browser can't check web pages.";
    let els;
    try {
      els = Array.from(doc.querySelectorAll(c.selector));
    } catch {
      return `\`${c.selector}\` isn't a selector the browser understands.`;
    }
    count = els.length;
    text = els[0]?.textContent?.trim() ?? "";
    attrs = c.attr ? els.map((el) => el.getAttribute(c.attr)) : undefined;
  }

  if (c.exists === false) return count === 0 ? null : c.hint || `Your page shouldn't have ${what} any more.`;
  if (c.count !== undefined && count !== c.count)
    return c.hint || `Your page should have ${c.count} ${plural(what, c.count)}. It has ${count}.`;
  if (count === 0) return c.hint || `Your page needs ${what}.`;

  if (c.text !== undefined && squash(text) !== squash(c.text))
    return c.hint || `Your ${bare(what)} should say "${c.text}". Right now it says "${text || "nothing"}".`;

  if (c.attr !== undefined) {
    const missing = attrs.filter((v) => v === null || (c.present && !String(v).trim())).length;
    const owner = count > 1 ? `Every ${bare(what)} on your page` : `Your ${bare(what)}`;
    if (c.present && missing)
      return c.hint || `${owner} needs ${article(c.attr)} \`${c.attr}\` attribute${c.attr === "alt" ? " that describes the picture" : ""}.`;
    if (c.equals !== undefined && !attrs.every((v) => squash(v) === squash(c.equals)))
      return c.hint || `The \`${c.attr}\` of your ${bare(what)} should be "${c.equals}".`;
    const words = (v) => String(v ?? "").trim().split(/\s+/).filter(Boolean).length;
    if (c.minWords !== undefined && attrs.some((v) => words(v) < c.minWords))
      return c.hint || `${owner} needs ${article(c.attr)} \`${c.attr}\` of at least ${c.minWords} words.`;
  }

  if (c.layout !== undefined && probe.arrangement !== c.layout) {
    const want = c.layout === "column" ? "stacked in a column" : "side by side in a row";
    const now = { column: "stacked in a column", row: "side by side", mixed: "partly side by side" }[probe.arrangement] || "not laid out yet";
    return c.hint || `${where} ${plural(what, 2)} should be ${want}. Right now they're ${now}.`;
  }

  if (c.style !== undefined && !probe.matches)
    return c.hint || `${where} ${bare(what)} should have \`${c.style}: ${c.equals}\`. Right now it's \`${probe.actual || "not set"}\`.`;

  return null;
}

export function runChecks(checks, { source, output, doc = null, live = null }) {
  for (const c of checks) {
    switch (c.type) {
      case "stdout": {
        if (c.equals !== undefined && norm(output) !== norm(c.equals))
          return { pass: false, message: `Expected the output to be:\n${norm(c.equals)}\n\nYou printed:\n${norm(output) || "(nothing)"}` };
        if (c.contains !== undefined && !squash(output).includes(squash(c.contains)))
          return { pass: false, message: `Your output should include "${c.contains}".` };
        if (c.matches !== undefined && !new RegExp(c.matches, "i").test(norm(output)))
          return { pass: false, message: c.hint || "The output isn't in the shape we expected yet." };
        if (c.lines !== undefined && norm(output).split("\n").filter(Boolean).length !== c.lines)
          return { pass: false, message: `Expected ${c.lines} line${c.lines === 1 ? "" : "s"} of output.` };
        break;
      }
      case "source": {
        if (c.contains !== undefined && !source.toLowerCase().includes(String(c.contains).toLowerCase()))
          return { pass: false, message: c.hint || `Your code should use \`${c.contains}\`.` };
        if (c.excludes !== undefined && source.toLowerCase().includes(String(c.excludes).toLowerCase()))
          return { pass: false, message: c.hint || `Try solving it without \`${c.excludes}\`.` };
        if (c.matches !== undefined && !new RegExp(c.matches, "i").test(source))
          return { pass: false, message: c.hint || "Your code doesn't use the thing this lesson is practising yet." };
        break;
      }
      case "dom": {
        const message = domCheck(c, { doc, live });
        if (message) return { pass: false, message };
        break;
      }
      default:
        break;
    }
  }
  return { pass: true, message: null };
}

/** Fill-in-the-blank comparison: forgiving about spacing (including around
    operators, so `i += 1` matches `i+=1`) and quote style.
    Capitals are ignored unless `caseSensitive` — Python, Java, C++ and
    JavaScript care about them, so `scanner` must not pass for `Scanner`. */
export function matchesFill(given, accepted, { caseSensitive = false } = {}) {
  const clean = (s) => {
    const t = String(s ?? "")
      .trim()
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .replace(/ ?([-+*/%=<>!&|^~]) ?/g, "$1");
    return caseSensitive ? t : t.toLowerCase();
  };
  const g = clean(given);
  return accepted.some((a) => clean(a) === g || clean(a).replace(/"/g, "'") === g.replace(/"/g, "'"));
}
