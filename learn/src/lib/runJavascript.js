/* ---------------------------------------------------------------------------
   JavaScript runner.

   The student's code runs inside a Web Worker built from a blob, so it has no
   access to the page, the DOM, cookies or Firebase. A watchdog terminates the
   worker if the code runs too long, which is what happens the first time a kid
   writes `while (true)`.
   --------------------------------------------------------------------------- */

const TIMEOUT_MS = 4000;

/* How console.log turns a value into text, the way a browser console does:
   `undefined`, `NaN` and `Infinity` print as themselves (JSON.stringify would
   print nothing or `null`, which contradicts the lessons), strings inside
   arrays and objects are quoted, and circular objects don't throw.
   A plain ES5 string, because it is also pasted into the web preview frame. */
export const FORMAT_VALUE = `
function __scaFormat(v, depth, seen) {
  if (typeof v === "string") return depth ? JSON.stringify(v) : v;
  if (v === null) return "null";
  if (typeof v === "undefined") return "undefined";
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "bigint") return String(v) + "n";
  if (typeof v === "boolean" || typeof v === "symbol") return String(v);
  if (typeof v === "function") return "function " + (v.name || "") + "()";
  if (typeof Element !== "undefined" && v instanceof Element) return "<" + v.tagName.toLowerCase() + ">";
  if (seen.indexOf(v) >= 0) return "[Circular]";
  if (depth > 3) return Array.isArray(v) ? "[Array]" : "{...}";
  seen = seen.concat([v]);
  try {
    if (Array.isArray(v)) {
      return "[" + v.map(function (x) { return __scaFormat(x, depth + 1, seen); }).join(", ") + "]";
    }
    if (v instanceof Error) return v.name + ": " + v.message;
    if (v instanceof Date) return v.toISOString();
    var keys = Object.keys(v);
    var body = keys.map(function (k) { return (/^[A-Za-z_$][\\w$]*$/.test(k) ? k : JSON.stringify(k)) + ": " + __scaFormat(v[k], depth + 1, seen); });
    return keys.length ? "{" + body.join(", ") + "}" : "{}";
  } catch (e) {
    return String(v);
  }
}
`;

const HARNESS = `
  ${FORMAT_VALUE}
  const lines = [];
  const LOG_LIMIT = 2000;
  const show = (...args) => {
    if (lines.length < LOG_LIMIT) lines.push(args.map((a) => __scaFormat(a, 0, [])).join(" "));
    else if (lines.length === LOG_LIMIT) lines.push("… stopped showing output after " + LOG_LIMIT + " lines.");
  };
  self.console = { log: show, info: show, warn: show, error: show, debug: show };

  self.onmessage = (e) => {
    const { source, inputs } = e.data;
    let queue = Array.isArray(inputs) ? inputs.slice() : [];
    self.prompt = (q) => {
      if (q) show(String(q));
      const v = queue.length ? queue.shift() : "";
      show(String(v));
      return v;
    };
    self.alert = (m) => show(String(m));
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(source)();
      if (result !== undefined) show(result);
      self.postMessage({ ok: true, output: lines.join("\\n"), error: null });
    } catch (err) {
      self.postMessage({
        ok: false,
        output: lines.join("\\n"),
        error: (err && err.name ? err.name + ": " : "") + (err && err.message ? err.message : String(err)),
      });
    }
  };
`;

/**
 * Run JavaScript source in a sandboxed worker.
 * @returns {Promise<{ok: boolean, output: string, error: string|null}>}
 */
export function runJavascript(source, { stdin = [] } = {}) {
  return new Promise((resolve) => {
    let worker;
    let url;
    try {
      url = URL.createObjectURL(new Blob([HARNESS], { type: "text/javascript" }));
      worker = new Worker(url);
    } catch {
      resolve({ ok: false, output: "", error: "This browser can't run code sandboxes." });
      return;
    }

    const done = (payload) => {
      clearTimeout(watchdog);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(payload);
    };

    const watchdog = setTimeout(
      () =>
        done({
          ok: false,
          output: "",
          error:
            "Your code ran for too long and was stopped. A loop that never ends is the usual cause.",
        }),
      TIMEOUT_MS
    );

    worker.onmessage = (e) => done(e.data);
    worker.onerror = (e) => done({ ok: false, output: "", error: e.message || "Something went wrong." });
    worker.postMessage({ source, inputs: stdin });
  });
}
