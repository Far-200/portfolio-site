import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BootTerminal from "./components/BootTerminal";
import AmbientBackground from "./components/AmbientBackground";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import LabPage from "./pages/LabPage";
import ContactPage from "./pages/ContactPage";
import CortexAIPage from "./pages/project-pages/FolderStructure";
import PasswordCrackEsti from "./pages/project-pages/PasswordCrackEsti";
import DevJTool from "./pages/project-pages/DevJTool";
import PromptRouterPage from "./pages/project-pages/PromptRouterPage";

// ── Page transition variants ──
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects/cortex-ai" element={<CortexAIPage />} />
          <Route
            path="/projects/password-estimator"
            element={<PasswordCrackEsti />}
          />
          <Route path="/projects/devtool" element={<DevJTool />} />
          <Route
            path="/projects/prompt-router"
            element={<PromptRouterPage />}
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Root App ──
// Boot animation runs once per browser session (sessionStorage key: "booted").
// To disable permanently: set VITE_SKIP_BOOT=true in your .env file and
// add `if (import.meta.env.VITE_SKIP_BOOT) return true;` at top of shouldBoot.
function shouldBoot() {
  try {
    if (sessionStorage.getItem("booted")) return false;
  } catch {
    return false;
  }
  return true;
}

function App() {
  const [booting, setBooting] = useState(shouldBoot);

  const handleBootDone = () => {
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      /* noop */
    }
    setBooting(false);
  };

  return (
    <div className="app-shell">
      <AmbientBackground />

      {/* Boot overlay — only on first session load */}
      <AnimatePresence>
        {booting && <BootTerminal onDone={handleBootDone} />}
      </AnimatePresence>

      <NavBar />
      <ScrollToTop />
      <AnimatedRoutes />
      <Footer />
    </div>
  );
}

export default App;
