import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import CortexAIPage from "./pages/project-pages/FolderStructure";
import PasswordCrackEsti from "./pages/project-pages/PasswordCrackEsti";
import DevJTool from "./pages/project-pages/DevJTool";
import DLPPage from "./pages/project-pages/DLPPage";

function App() {
  const glowRef = useRef(null);

  useEffect(() => {
    const moveGlow = (e) => {
      if (!glowRef.current) return;

      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveGlow);

    return () => {
      window.removeEventListener("mousemove", moveGlow);
    };
  }, []);

  return (
    <div className="app-shell">
      <div ref={glowRef} className="cursor-glow" />

      <NavBar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects/cortex-ai" element={<CortexAIPage />} />
        <Route
          path="/projects/password-estimator"
          element={<PasswordCrackEsti />}
        />
        <Route path="/projects/devtool" element={<DevJTool />} />
        <Route path="/projects/dlp" element={<DLPPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
