import Inline from "./Inline";
import { ScratchScript } from "./Scratch";

/* Grey out comments in static samples — enough to read well without
   shipping a syntax highlighter for content the student never edits. The
   comment marker depends on the language: Python's `#` is a C++ `#include`,
   and a CSS `#id` selector, so each course (or a block's own `lang`) says
   which marker to look for. */
const COMMENT = { python: "#", html: "<!--", css: "/*", scratch: null };

function CodeSample({ code, lang }) {
  const marker = lang in COMMENT ? COMMENT[lang] : "//";
  const lines = String(code).split("\n");
  return (
    <pre className="codeblock">
      {lines.map((line, i) => {
        const at = marker ? line.indexOf(marker) : -1;
        const inString = at > -1 && (line.slice(0, at).split('"').length - 1) % 2 === 1;
        if (at > -1 && !inString) {
          return (
            <span key={i}>
              {line.slice(0, at)}
              <span className="cmt">{line.slice(at)}</span>
              {i < lines.length - 1 ? "\n" : ""}
            </span>
          );
        }
        return <span key={i}>{line + (i < lines.length - 1 ? "\n" : "")}</span>;
      })}
    </pre>
  );
}

export default function Blocks({ blocks, lang = "python" }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i}><Inline text={b.text} /></p>;
        if (b.t === "list")
          return (
            <ul key={i}>
              {b.items.map((item, j) => (
                <li key={j}><span><Inline text={item} /></span></li>
              ))}
            </ul>
          );
        if (b.t === "code")
          return (
            <div key={i} className="stack" style={{ gap: 8 }}>
              <CodeSample code={b.code} lang={b.lang || lang} />
              {b.caption && <p className="small muted" style={{ whiteSpace: "pre-line" }}>{b.caption}</p>}
            </div>
          );
        if (b.t === "scratch")
          return (
            <div key={i} className="stack" style={{ gap: 8 }}>
              <ScratchScript blocks={b.blocks} label={b.caption} />
              {b.caption && <p className="small muted" style={{ whiteSpace: "pre-line" }}>{b.caption}</p>}
            </div>
          );
        if (b.t === "callout")
          return (
            <div key={i} className={"callout" + (b.tone === "tip" ? " callout--tip" : b.tone === "warn" ? " callout--warn" : "")}>
              <div>
                {b.title && <b>{b.title}</b>}
                <Inline text={b.text} />
              </div>
            </div>
          );
        return null;
      })}
    </div>
  );
}
