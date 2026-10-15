import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./lib/auth";
import { useProgress } from "./lib/progress";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Me from "./pages/Me";
import SignIn from "./pages/SignIn";

// The game layer's big pages load only when someone opens them, so a lesson's
// first paint carries none of Byteville's buildings or the Workshop catalogue.
const Workshop = lazy(() => import("./pages/Workshop"));
const Byteville = lazy(() => import("./pages/Byteville"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));

const Loading = () => (
  <main className="shell" style={{ paddingBlock: 48 }} aria-busy="true">
    <div className="skeleton" style={{ height: 28, width: 220 }} />
    <div className="skeleton" style={{ height: 240, marginTop: 20 }} />
  </main>
);

/* Everything except the sign-in page needs an account. A visitor who isn't
   signed in is sent to sign up, then brought back to the page they asked for.
   With no Firebase config (local development) there is nothing to sign in to,
   so the site stays open. */
function RequireAccount() {
  const { user, enabled, loading } = useAuth();
  const { status } = useProgress();
  const { pathname, search } = useLocation();
  if (!enabled) return <Outlet />;
  if (loading) return <Loading />;
  if (!user || user.isAnonymous) return <Navigate to="/signin" replace state={{ from: pathname + search }} />;
  // Wait for the account's progress too. If it can't load (offline), the
  // status becomes "error" and the page shows rather than spinning forever.
  if (status === "loading") return <Loading />;
  return <Outlet />;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <Header />
      <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<RequireAccount />}>
              <Route path="/" element={<Home />} />
              <Route path="/course/:courseId" element={<Course />} />
              <Route path="/course/:courseId/lesson/:lessonId" element={<Lesson />} />
              <Route path="/me" element={<Me />} />
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/byteville" element={<Byteville />} />
              <Route path="/certificate/:courseId" element={<CertificatePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
