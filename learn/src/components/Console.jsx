export default function Console({ output, error, status, placeholder = "Press Run to see what your code does." }) {
  const empty = !output && !error && !status;
  return (
    <div className={"console" + (error ? " console--err" : "")} aria-live="polite">
      {status && <span className="console__empty">{status}</span>}
      {!status && empty && <span className="console__empty">{placeholder}</span>}
      {output}
      {error && (output ? "\n" : "") + error}
    </div>
  );
}
