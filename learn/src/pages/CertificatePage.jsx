import { Link, Navigate, useParams } from "react-router-dom";
import { getCourse } from "../data/courses";
import { useProgress } from "../lib/progress";
import { isCourseDone } from "../lib/sparks";
import Certificate from "../components/moments/Certificate";

/* A finished course's certificate, to print again whenever it's wanted.
   Shown in Fun mode and plain mode alike — it's for the fridge. */
export default function CertificatePage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const progress = useProgress();
  if (!course) return <Navigate to="/me" replace />;
  const done = isCourseDone(progress.state, course);

  return (
    <main className="shell certificate-page" style={{ paddingBlock: "clamp(24px, 5vw, 44px) 72px", maxWidth: 760 }}>
      <Link to="/me" className="small muted no-print">← My progress</Link>
      {done ? (
        <div className="certificate-wrap" style={{ marginTop: 16 }}>
          <Certificate course={course} />
        </div>
      ) : (
        <div className="card stack" style={{ gap: 10, marginTop: 16 }}>
          <h1 className="h2">Not yet</h1>
          <p>Finish every lesson in {course.title} and its certificate will be here, ready to print.</p>
          <Link className="btn btn--kid" to={`/course/${course.id}`} style={{ alignSelf: "flex-start" }}>Go to {course.title}</Link>
        </div>
      )}
    </main>
  );
}
