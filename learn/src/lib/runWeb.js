/* ---------------------------------------------------------------------------
   Web runner.

   The student's HTML, CSS and JS are stitched into one document and rendered
   in an <iframe srcdoc sandbox="allow-scripts">. Without allow-same-origin the
   frame gets an opaque origin, so its scripts can't reach this page, its
   cookies, localStorage or Firebase — and this page can't reach into the frame
   either. Everything crosses the boundary as postMessage:

     frame → page   console output, uncaught errors, "ready"
     page  → frame  "probe" requests for live DOM facts and computed styles,
                    which is the only way to grade CSS from outside the frame

   A small harness is injected ahead of the student's code to do that work.
   --------------------------------------------------------------------------- */

import { FORMAT_VALUE } from "./runJavascript.js";

export const PANES = ["html", "css", "js"];

export const PANE_LABELS = { html: "HTML", css: "CSS", js: "JavaScript" };

/* A loop with no exit freezes the preview, and the preview re-renders while the
   student is typing — `while (i < 5) {}` is valid code for a second before the
   `i++` goes in. So every loop condition gets a guard call: `while (c)` becomes
   `while (__scaLoop() && (c))`, and `for (a; c; b)` becomes
   `for (a; __scaLoop() && (c); b)`. Guarding the condition rather than the
   body also covers loops without braces (`while (x) i++;`), `for (;;)` and
   `do … while`. The guard remembers when the current task started and gives
   up after LOOP_LIMIT_MS; the setTimeout that resets it only runs once the
   task has finished, which a stuck loop never does. */
const LOOP_LIMIT_MS = 1500;

/* Characters after which a `/` starts a regex literal rather than a division. */
const REGEX_AFTER = /[(,=:[!&|?{};+\-*%<>~^]/;

/** Insert a guard call into the condition of every for / while / do-while loop. */
export function guardLoops(src) {
  const s = String(src ?? "");
  let out = "";
  let i = 0;
  const isIdent = (ch) => /[A-Za-z0-9_$]/.test(ch || "");

  // The last non-space character already copied — decides regex vs division.
  const lastCode = () => {
    const m = out.match(/(\S)\s*$/);
    return m ? m[1] : "";
  };
  const lastWord = () => (out.match(/([A-Za-z_$][\w$]*)\s*$/) || [])[1];

  // End index (exclusive) of a string, template literal, comment or regex
  // literal starting at s[k], or -1 if none starts there.
  const nonCodeEnd = (k, prevCh, prevWord) => {
    const ch = s[k];
    if (ch === "/" && s[k + 1] === "/") {
      const end = s.indexOf("\n", k);
      return end === -1 ? s.length : end;
    }
    if (ch === "/" && s[k + 1] === "*") {
      const end = s.indexOf("*/", k + 2);
      return end === -1 ? s.length : end + 2;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = k + 1;
      while (j < s.length && s[j] !== ch) j += s[j] === "\\" ? 2 : 1;
      return j + 1;
    }
    if (ch === "/" && (prevCh === "" || REGEX_AFTER.test(prevCh) || /^(return|typeof|case|in|of|new|delete|void|throw)$/.test(prevWord || ""))) {
      let j = k + 1;
      let cls = false;
      while (j < s.length && s[j] !== "\n") {
        if (s[j] === "\\") j += 2;
        else if (s[j] === "[") (cls = true), j++;
        else if (s[j] === "]") (cls = false), j++;
        else if (s[j] === "/" && !cls) break;
        else j++;
      }
      if (s[j] !== "/") return -1; // not a regex after all
      j++;
      while (isIdent(s[j])) j++; // flags
      return j;
    }
    return -1;
  };

  // From s[i] (just after a keyword), read a balanced (...) group. Returns its
  // inner text and the top-level `;` positions, or null if there isn't one.
  const readParens = () => {
    let j = i;
    while (j < s.length && /\s/.test(s[j])) j++;
    if (s[j] !== "(") return null;
    const open = j;
    const semis = [];
    let depth = 0;
    let prevCh = "(";
    for (; j < s.length; j++) {
      const end = nonCodeEnd(j, prevCh, "");
      if (end !== -1) {
        prevCh = "x";
        j = end - 1;
        continue;
      }
      const ch = s[j];
      if ("([{".includes(ch)) depth++;
      else if (")]}".includes(ch) && --depth === 0) break;
      else if (ch === ";" && depth === 1) semis.push(j - open - 1);
      if (!/\s/.test(ch)) prevCh = ch;
    }
    if (j >= s.length) return null; // unbalanced while typing: leave it alone
    const lead = s.slice(i, open);
    const inner = s.slice(open + 1, j);
    i = j + 1;
    return { lead, inner, semis };
  };

  const guard = (cond) => (cond.trim() ? `__scaLoop() && (${cond})` : "__scaLoop()");

  while (i < s.length) {
    const end = nonCodeEnd(i, lastCode(), lastWord());
    if (end !== -1) {
      out += s.slice(i, end);
      i = end;
      continue;
    }
    const prev = s[i - 1];
    // `.for` / `.while` are property names, not loops.
    const kw = !isIdent(prev) && prev !== "." && /^(for|while)(?![\w$])/.exec(s.slice(i, i + 6));
    if (kw) {
      const word = kw[1];
      i += word.length;
      out += word;
      const p = readParens();
      if (!p) continue;
      if (word === "while" && p.inner.trim()) out += `${p.lead}(${guard(p.inner)})`;
      else if (word === "for" && p.semis.length === 2) {
        const [a, b] = p.semis;
        out += `${p.lead}(${p.inner.slice(0, a)};${guard(p.inner.slice(a + 1, b))};${p.inner.slice(b + 1)})`;
      } else out += `${p.lead}(${p.inner})`; // for…of / for…in: always finite over a fixed list
      continue;
    }
    out += s[i];
    i++;
  }
  return out;
}

/* Runs inside the frame. Kept as a plain string so nothing from this module's
   scope can leak in. `__CHANNEL__` and `__NONCE__` are replaced per render. */
const HARNESS = `
(function () {
  var CHANNEL = "__CHANNEL__";
  var NONCE = "__NONCE__";
  var send = function (msg) {
    msg.channel = CHANNEL; msg.nonce = NONCE;
    try { parent.postMessage(msg, "*"); } catch (e) {}
  };
  ${FORMAT_VALUE}
  var show = function (args) {
    return Array.prototype.map.call(args, function (a) { return __scaFormat(a, 0, []); }).join(" ");
  };
  // A loop that logs runs thousands of times before the loop guard stops it,
  // and every line costs the page a re-render — so stop sending after a few
  // hundred, or the page itself grinds to a halt.
  var LOG_LIMIT = 500;
  var logged = 0;
  ["log", "info", "warn", "error", "debug"].forEach(function (k) {
    console[k] = function () {
      logged++;
      if (logged <= LOG_LIMIT) send({ kind: "log", level: k, text: show(arguments) });
      else if (logged === LOG_LIMIT + 1) send({ kind: "log", level: "warn", text: "… stopped showing output after " + LOG_LIMIT + " lines." });
    };
  });
  // Modals are blocked in a sandboxed frame, so route them to the console
  // instead of failing silently.
  window.alert = function (m) { console.log(String(m)); };
  window.prompt = function (q) { if (q) console.log(String(q)); return ""; };
  window.confirm = function () { return false; };

  var started = 0;
  window.__scaLoop = function () {
    var now = Date.now();
    if (!started) { started = now; setTimeout(function () { started = 0; }, 0); }
    if (now - started > ${LOOP_LIMIT_MS}) {
      started = 0;
      throw new Error("Your loop ran for too long and was stopped. Check that something inside it eventually makes the condition false.");
    }
    return true;
  };

  window.addEventListener("error", function (e) {
    var where = e.lineno ? " (line " + e.lineno + ")" : "";
    send({ kind: "error", text: (e.message || "Something went wrong.") + where });
  });
  window.addEventListener("unhandledrejection", function (e) {
    send({ kind: "error", text: String(e.reason && e.reason.message || e.reason) });
  });

  // Exercises use pictures that don't exist (<img src="volunteers.jpg">), and
  // the site has no image files on purpose. A missing picture becomes a grey
  // box labelled with its alt text instead of a broken-image icon. Only the
  // rendered frame changes; the student's HTML (what's graded) doesn't.
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG" || img.getAttribute("data-sca-missing")) return;
    img.setAttribute("data-sca-missing", "1");
    var label = String(img.getAttribute("alt") || img.getAttribute("src") || "picture").slice(0, 48)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">' +
      '<rect width="100%" height="100%" fill="#e9eef5"/>' +
      '<text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="15" fill="#5b6b7f" ' +
      'text-anchor="middle" dominant-baseline="middle">' + label + '</text></svg>';
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }, true);

  // A link click would navigate the frame away from the student's page.
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#") return;
    e.preventDefault();
    send({ kind: "log", level: "info", text: "(Links don't open inside the preview. On a real site this would go to " + href + ")" });
  });

  // Normalise an expected CSS value through the browser so "red" matches
  // "rgb(255, 0, 0)" and "1rem" matches "16px".
  var normalise = function (prop, value) {
    var probe = document.createElement("div");
    // Border and outline widths compute to 0 unless there's a style to draw.
    probe.style.borderStyle = "solid"; probe.style.outlineStyle = "solid";
    probe.style.setProperty(prop, value);
    if (!probe.style.getPropertyValue(prop)) return null;
    probe.style.position = "absolute"; probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    var out = getComputedStyle(probe).getPropertyValue(prop);
    probe.remove();
    return out;
  };

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.channel !== CHANNEL || d.kind !== "probe") return;
    // A probe for a particular screen width waits until this frame really is
    // that wide. A sandboxed frame learns its size from the page a moment
    // after it loads, and measuring before then sees a 0px-wide screen.
    if (!d.width) return answer(d);
    var since = Date.now();
    (function sized() {
      if (window.innerWidth === d.width || Date.now() - since > 1500) answer(d);
      else setTimeout(sized, 16);
    })();
  });

  function answer(d) {
    var actionError = null;
    (d.actions || []).forEach(function (act) {
      if (actionError) return;
      var el = null;
      try { el = document.querySelector(act.selector); } catch (err) {}
      if (!el) {
        actionError = "The checker tried to " + (act.do === "click" ? "click" : "use") + " \`" + act.selector + "\` but your page doesn't have one.";
        return;
      }
      try {
        if (act.do === "click") el.click();
        else if (act.do === "input") {
          el.value = act.value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (act.do === "submit") {
          el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
      } catch (err) {
        send({ kind: "error", text: String(err && err.message || err) });
      }
    });
    var results = d.queries.map(function (q) {
      var els;
      try { els = document.querySelectorAll(q.selector); }
      catch (err) { return { error: "bad selector" }; }
      var first = els[0];
      var r = { count: els.length };
      if (first) {
        r.text = (first.textContent || "").trim();
        if (q.attr) r.attrs = Array.prototype.map.call(els, function (el) { return el.getAttribute(q.attr); });
        // How the matched elements actually sit on screen, whatever CSS put
        // them there: "column" (each below the last), "row" (each to the
        // right of the last, overlapping vertically), or "mixed".
        if (q.layout) {
          var rects = Array.prototype.map.call(els, function (el) { return el.getBoundingClientRect(); });
          var column = rects.length > 1, row = rects.length > 1;
          for (var i = 1; i < rects.length; i++) {
            var a = rects[i - 1], b = rects[i];
            if (b.top < a.bottom - 1) column = false;
            if (b.left < a.right - 1 || b.top >= a.bottom || b.bottom <= a.top) row = false;
          }
          r.arrangement = column ? "column" : row ? "row" : "mixed";
        }
        if (q.style) {
          r.actual = getComputedStyle(first).getPropertyValue(q.style).trim();
          if (q.equals !== undefined) {
            var want = normalise(q.style, String(q.equals));
            r.matches = r.actual.toLowerCase() === String(q.equals).toLowerCase() || (want !== null && want.trim() === r.actual);
          }
        }
      }
      return r;
    });
    send({ kind: "probe-result", id: d.id, results: results, actionError: actionError });
  }

  window.addEventListener("load", function () { send({ kind: "ready" }); });
})();
`;

// Stop student text from closing our <style> or <script> early.
const escapeTag = (s, tag) => String(s ?? "").replace(new RegExp(`</(${tag})`, "gi"), "<\\/$1");

/**
 * Assemble the document the preview frame renders.
 * The shape is exactly <style>{css}</style> … {html}<script>{js}</script>,
 * with the harness first in <head> so it is listening before student code runs.
 */
export function buildDocument({ html = "", css = "", js = "" }, { channel, nonce }) {
  const harness = HARNESS.replace("__CHANNEL__", channel).replace("__NONCE__", nonce);
  const script = js.trim() ? `<script>${escapeTag(guardLoops(js), "script")}</script>` : "";
  return (
    "<!doctype html><html><head>" +
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<script>${harness}</script>` +
    `<style>${escapeTag(css, "style")}</style>` +
    `</head><body>${html}${script}</body></html>`
  );
}

/** Parse the student's markup the way the browser will, for structural checks. */
export function parseDocument({ html = "" }) {
  if (typeof DOMParser === "undefined") return null;
  return new DOMParser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
}

/** Every check that needs the live frame rather than the parsed markup. */
export const needsLiveFrame = (c) =>
  c.type === "dom" && (c.style !== undefined || c.layout !== undefined || c.live === true);

export const randomId = () => Math.random().toString(36).slice(2, 10);
