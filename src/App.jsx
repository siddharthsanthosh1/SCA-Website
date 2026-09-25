import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Branches from "./pages/Branches";
import Curriculum from "./pages/Curriculum";
import StartingABranch from "./pages/StartingABranch";
import Volunteer from "./pages/Volunteer";
import Hackathon from "./pages/Hackathon";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/programs" element={<Branches />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/starting-a-branch" element={<StartingABranch />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
