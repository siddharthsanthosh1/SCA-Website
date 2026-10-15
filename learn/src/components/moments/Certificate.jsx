import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { useProgress } from "../../lib/progress";
import { allLessons } from "../../data/courses";
import Pip from "../pip/Pip";

/* The course certificate. Kids put these on the fridge; parents see what the
   program did. The name is typed here and printed — it isn't saved anywhere. */

export function completedOn(progress, course) {
  const done = progress.course(course.id).completedLessons || {};
  const times = allLessons(course).map((l) => done[l.id]).filter(Boolean);
  return times.length ? new Date(Math.max(...times)) : new Date();
}

export default function Certificate({ course }) {
  const { user } = useAuth();
  const progress = useProgress();
  const [name, setName] = useState(user?.displayName || "");
  const date = completedOn(progress, course).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="certificate-wrap">
      <section className="certificate" aria-label={`Certificate for ${course.title}`}>
        {progress.fun && <Pip mood="cheering" size={70} equipped={progress.equipped} animate={false} />}
        <span className="certificate__eyebrow">Certificate of completion</span>
        <p>This is to say that</p>
        <label className="sr-only" htmlFor={`cert-name-${course.id}`}>Name on the certificate</label>
        <input
          id={`cert-name-${course.id}`}
          className="certificate__name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name"
          autoComplete="name"
          maxLength={60}
        />
        <p>finished every lesson in</p>
        <p className="certificate__course">{course.title}</p>
        <p className="small muted">{course.topics.length} topics · {allLessons(course).length} lessons</p>
        <div className="certificate__foot">
          <span>Student Code Alliance</span>
          <span>{date}</span>
        </div>
      </section>
      <div className="row no-print" style={{ justifyContent: "center", marginTop: 12 }}>
        <button className="btn btn--kid" onClick={() => window.print()}>Print certificate</button>
      </div>
    </div>
  );
}
