import { lazy, Suspense } from "react";

/* CodeMirror is ~200 KB, so it only loads when a student opens an exercise. */
const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

function Fallback({ value }) {
  return (
    <div className="editor">
      <div className="editor__bar">
        <span>Loading editor…</span>
      </div>
      <pre className="codeblock" style={{ borderRadius: 0, margin: 0 }}>
        {value || " "}
      </pre>
    </div>
  );
}

export default function Editor({ value, onChange, language = "python", label = "Your code", readOnly = false }) {
  return (
    <Suspense fallback={<Fallback value={value} />}>
      <LoadedEditor value={value} onChange={onChange} language={language} label={label} readOnly={readOnly} />
    </Suspense>
  );
}

function LoadedEditor({ value, onChange, language, label, readOnly }) {
  const [ext, setExt] = useLangExtension(language);
  return (
    <div className="editor">
      <div className="editor__bar">
        <span>{label}</span>
        <span className="mono" style={{ textTransform: "lowercase" }}>
          {language}
        </span>
      </div>
      <CodeMirror
        value={value}
        height="auto"
        minHeight="140px"
        maxHeight="380px"
        extensions={ext}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          autocompletion: false,
          bracketMatching: true,
          closeBrackets: true,
        }}
        onChange={onChange}
      />
    </div>
  );
}

/* Load only the grammar the course needs. */
import { useEffect, useState } from "react";
function useLangExtension(language) {
  const [ext, setExt] = useState([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        if (language === "javascript" || language === "js") {
          const { javascript } = await import("@codemirror/lang-javascript");
          if (live) setExt([javascript()]);
        } else if (language === "python") {
          const { python } = await import("@codemirror/lang-python");
          if (live) setExt([python()]);
        } else {
          // HTML and CSS: no grammar is installed for them, and plain text is
          // better than borrowing the wrong language's colours.
          if (live) setExt([]);
        }
      } catch {
        if (live) setExt([]);
      }
    })();
    return () => {
      live = false;
    };
  }, [language]);
  return [ext, setExt];
}
