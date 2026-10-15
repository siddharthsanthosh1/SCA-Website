/* ---------------------------------------------------------------------------
   Python runner — Pyodide (CPython compiled to WebAssembly).

   Everything happens in the student's browser: no server, no cost, no code
   leaving the machine. The runtime is ~10 MB and is fetched from the jsDelivr
   CDN the first time a student opens a Python exercise, then cached by the
   browser.
   --------------------------------------------------------------------------- */

const PYODIDE_VERSION = "0.26.4";

/* Where the Python runtime is fetched from.
   Default: the jsDelivr CDN — nothing to host, and it caches well.
   Self-hosting: copy node_modules/pyodide into public/pyodide and set
   VITE_PYODIDE_URL=/pyodide/ in .env.local. Worth doing only if a school
   network blocks jsDelivr, since it adds ~14 MB to every deploy. */
const CDN =
  import.meta.env.VITE_PYODIDE_URL ||
  `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/* Student code runs in a Web Worker, never on the page's own thread. Python
   has no way to be interrupted from outside, so `while True:` would otherwise
   freeze the whole tab — the editor, the Sparks save, everything. The worker
   is terminated by a watchdog instead, and a fresh one loads on the next run
   (from the browser cache, so it's quick).

   Every run gets its own namespace, so `list = [1, 2]` or a function left over
   from an earlier exercise can't leak into the next one. */
const RUN_TIMEOUT_MS = 8000;

const WORKER = `
let py = null;
const SHIM = ${JSON.stringify(`
import sys, builtins
class _Out:
    # Capped, so print() in an endless loop can't fill the memory before the
    # watchdog stops it.
    def __init__(self): self.buf = []; self.size = 0
    def write(self, s):
        if self.size < 200000:
            self.buf.append(s)
            self.size += len(s)
        return len(s)
    def flush(self): pass
_out = _Out()
_err = _Out()
sys.stdout = _out
sys.stderr = _err
_inputs = list(__sca_inputs__)
def _input(prompt=""):
    if prompt: _out.write(str(prompt))
    if not _inputs:
        raise EOFError("input() was called again, but the test has no more answers to type. Check that your loop can end.")
    val = _inputs.pop(0)
    _out.write(str(val) + "\\n")
    return val
builtins.input = _input

import traceback
def _run(src, ns):
    # Formats its own traceback: Pyodide's error message comes back empty
    # once stdout/stderr are redirected from a separate namespace.
    try:
        exec(compile(src, "<exec>", "exec"), ns)
    except SystemExit:
        pass
    except BaseException as e:
        tb = traceback.TracebackException.from_exception(e)
        tb.stack = traceback.StackSummary.from_list([f for f in tb.stack if f.name not in ("_run", "_input")])
        return "".join(tb.format())
`)};
self.onmessage = async (e) => {
  const { type, indexURL, source, stdin } = e.data;
  if (type === "load") {
    try {
      importScripts(indexURL + "pyodide.js");
      py = await self.loadPyodide({ indexURL });
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "loadError", error: String(err && err.message || err) });
    }
    return;
  }
  const dict = py.globals.get("dict");
  const shimNs = dict();
  const ns = dict();
  dict.destroy();
  ns.set("__name__", "__main__");
  try {
    shimNs.set("__sca_inputs__", py.toPy(stdin));
    await py.runPythonAsync(SHIM, { globals: shimNs });
    const run = shimNs.get("_run");
    const trace = run(source, ns);
    run.destroy();
    const read = (name) => String(py.runPython("''.join(" + name + ".buf)", { globals: shimNs }));
    self.postMessage({ type: "result", ok: trace == null, output: read("_out"), warnings: trace == null ? read("_err") : "", error: trace == null ? null : String(trace) });
  } catch (err) {
    let out = "";
    try { out = String(py.runPython("''.join(_out.buf)", { globals: shimNs })); } catch {}
    self.postMessage({ type: "result", ok: false, output: out, error: String(err && err.message || err) });
  } finally {
    try { py.runPython("import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"); } catch {}
    shimNs.destroy();
    ns.destroy();
  }
};
`;

let worker = null; // { w, ready: Promise }

/* Absolute, so it also works from inside the blob worker for a self-hosted /pyodide/. */
const indexURL = () => new URL(CDN.replace(/\/?$/, "/"), location.href).href;

function startWorker(onStatus) {
  const url = URL.createObjectURL(new Blob([WORKER], { type: "text/javascript" }));
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  const ready = new Promise((resolve, reject) => {
    w.onmessage = (e) => {
      if (e.data.type === "ready") resolve();
      else if (e.data.type === "loadError") reject(new Error("Could not download Python. Check your internet connection."));
    };
    w.onerror = () => reject(new Error("Could not download Python. Check your internet connection."));
  });
  const entry = { w, ready };
  ready.catch(() => {
    if (worker === entry) worker = null;
    w.terminate();
  });
  onStatus?.("Downloading Python… this happens once.");
  w.postMessage({ type: "load", indexURL: indexURL() });
  return entry;
}

/** Start Python loading in the background. `onStatus` reports progress for the UI. */
export async function loadPython(onStatus) {
  worker ||= startWorker(onStatus);
  await worker.ready;
  onStatus?.("");
  return worker;
}

/* Show the last few lines — the full Pyodide trace is mostly noise for a kid. */
function trimTrace(raw) {
  const lines = raw.trimEnd().split("\n");
  const start = lines.findIndex((l) => l.includes('File "<exec>"'));
  return (start >= 0 ? lines.slice(start) : lines.slice(-4)).join("\n");
}

/**
 * Run Python source and capture what it printed. `output` is stdout only —
 * what exercises are graded on; warnings Python wrote to stderr come back
 * separately so they can be shown without failing an exact-output check.
 * `stdin` feeds input(); once it runs out, input() raises EOFError rather
 * than returning "" forever (which turns a wrong loop into an endless one).
 * @returns {Promise<{ok: boolean, output: string, error: string|null}>}
 */
export async function runPython(source, { stdin = [], onStatus } = {}) {
  let entry;
  try {
    entry = await loadPython(onStatus);
  } catch (err) {
    return { ok: false, output: "", error: err.message };
  }

  return new Promise((resolve) => {
    const { w } = entry;
    const watchdog = setTimeout(() => {
      // The only way to stop running Python is to throw the worker away.
      w.terminate();
      if (worker === entry) worker = null;
      resolve({
        ok: false,
        output: "",
        error: "Your code ran for too long and was stopped. A loop that never ends is the usual cause.",
      });
    }, RUN_TIMEOUT_MS);

    w.onmessage = (e) => {
      if (e.data.type !== "result") return;
      clearTimeout(watchdog);
      const { ok, output, warnings, error } = e.data;
      resolve({ ok, output, warnings: warnings || "", error: error && trimTrace(error) });
    };
    w.postMessage({ type: "run", source, stdin });
  });
}
