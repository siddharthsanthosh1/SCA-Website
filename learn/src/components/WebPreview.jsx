import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Console from "./Console";
import { buildDocument, randomId } from "../lib/runWeb";

const DEBOUNCE_MS = 400;
const READY_TIMEOUT_MS = 3000;
const PROBE_TIMEOUT_MS = 2000;

/* Live preview of a student's page. Re-renders 400 ms after typing stops so a
   fast typist doesn't reload the frame on every key. The parent grades through
   the ref: renderNow() → wait for the frame to load → probe() for live facts. */
const WebPreview = forwardRef(function WebPreview({ code, title = "Preview of your page" }, ref) {
  const frame = useRef(null);
  const channel = useMemo(randomId, []);
  const [srcdoc, setSrcdoc] = useState("");
  const [log, setLog] = useState({ output: "", error: null });
  const nonce = useRef(null);
  const lines = useRef([]);
  const errors = useRef([]);
  const waiting = useRef(new Map());
  const timer = useRef(null);
  const first = useRef(true);
  const sized = useRef(new Map()); // nonce → offscreen frame for probeAt()

  const render = useCallback(
    (c) => {
      clearTimeout(timer.current);
      nonce.current = randomId();
      lines.current = [];
      errors.current = [];
      setLog({ output: "", error: null });
      setSrcdoc(buildDocument(c, { channel, nonce: nonce.current }));
      return nonce.current;
    },
    [channel]
  );

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => render(code), first.current ? 0 : DEBOUNCE_MS);
    first.current = false;
    return () => clearTimeout(timer.current);
  }, [code.html, code.css, code.js, render]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onMessage = (e) => {
      const d = e.data;
      if (!d || d.channel !== channel) return;
      const off = sized.current.get(d.nonce);
      if (off) {
        // An offscreen frame only answers "ready" and probes.
        if (e.source !== off.contentWindow) return;
        const key = d.kind === "ready" ? "ready:" + d.nonce : d.kind === "probe-result" ? "probe:" + d.id : null;
        if (key) waiting.current.get(key)?.(d);
        return;
      }
      if (e.source !== frame.current?.contentWindow) return;
      if (d.nonce !== nonce.current) return; // a message from a render we've replaced
      if (d.kind === "log") {
        lines.current.push(d.text);
        setLog((l) => ({ ...l, output: lines.current.join("\n") }));
      } else if (d.kind === "error") {
        errors.current.push(d.text);
        setLog((l) => ({ ...l, error: errors.current.join("\n") }));
      } else if (d.kind === "ready" || d.kind === "probe-result") {
        const key = d.kind === "ready" ? "ready:" + d.nonce : "probe:" + d.id;
        waiting.current.get(key)?.(d);
        waiting.current.delete(key);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [channel]);

  const wait = (key, ms) =>
    new Promise((resolve) => {
      const t = setTimeout(() => {
        waiting.current.delete(key);
        resolve(null);
      }, ms);
      waiting.current.set(key, (d) => {
        clearTimeout(t);
        resolve(d);
      });
    });

  useImperativeHandle(ref, () => ({
    /** Render immediately and resolve once the page has loaded (false on timeout). */
    async renderNow(c) {
      const n = render(c);
      return Boolean(await wait("ready:" + n, READY_TIMEOUT_MS));
    },
    /** Ask the frame about selectors after running `actions`; null if it never answers. */
    async probe(queries, actions = []) {
      const id = randomId();
      const reply = wait("probe:" + id, PROBE_TIMEOUT_MS);
      frame.current?.contentWindow?.postMessage({ channel, kind: "probe", id, queries, actions }, "*");
      const d = await reply;
      return d ? { results: d.results, actionError: d.actionError || null } : null;
    },
    /** Render the page offscreen at `width` px and probe it there, for
        checks about how it looks on a phone or a wide screen. */
    async probeAt(c, width, queries) {
      const off = document.createElement("iframe");
      off.setAttribute("sandbox", "allow-scripts");
      off.setAttribute("aria-hidden", "true");
      off.tabIndex = -1;
      Object.assign(off.style, { position: "fixed", left: "-10000px", top: "0", width: width + "px", height: "600px", border: "0", visibility: "hidden" });
      const n = randomId();
      sized.current.set(n, off);
      off.srcdoc = buildDocument(c, { channel, nonce: n });
      const ready = wait("ready:" + n, READY_TIMEOUT_MS);
      document.body.appendChild(off);
      try {
        if (!(await ready)) return null;
        const id = randomId();
        const reply = wait("probe:" + id, PROBE_TIMEOUT_MS);
        off.contentWindow?.postMessage({ channel, kind: "probe", id, queries, actions: [], width }, "*");
        const d = await reply;
        return d ? { results: d.results, actionError: d.actionError || null } : null;
      } finally {
        off.remove();
        sized.current.delete(n);
      }
    },
    output: () => lines.current.join("\n"),
    error: () => errors.current.join("\n") || null,
  }));

  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="webpreview">
        <div className="editor__bar">
          <span>Preview</span>
          <span className="small">updates as you type</span>
        </div>
        <iframe
          ref={frame}
          title={title}
          className="webpreview__frame"
          sandbox="allow-scripts"
          srcDoc={srcdoc}
        />
      </div>
      {(log.output || log.error) && (
        <Console output={log.output} error={log.error} placeholder="" />
      )}
    </div>
  );
});

export default WebPreview;
