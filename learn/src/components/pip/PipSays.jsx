import Pip from "./Pip";
import { useProgress } from "../../lib/progress";

/* Pip with a speech bubble. Pip is aria-hidden; the line is real text. */
export default function PipSays({ mood = "idle", line, size = 64, className = "", children }) {
  const { equipped } = useProgress();
  return (
    <div className={"pipsays " + className}>
      <Pip mood={mood} size={size} equipped={equipped} />
      {(line || children) && (
        <div className="pipsays__bubble">
          {line && <p>{line}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
