import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { DURATION, EASE, useReducedMotion } from "./lib/motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ResumeChooserProvider } from "./components/ResumeChooser";
import AmbientBackground from "./components/AmbientBackground";
import { getProjectBySlug } from "./data/projects";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import LogPage from "./pages/LogPage";
import AboutPage from "./pages/AboutPage";
import LabPage from "./pages/LabPage";
import NotFoundPage from "./pages/NotFoundPage";
import FolderStructurePage from "./pages/project-pages/FolderStructure";
import PasswordCrackEsti from "./pages/project-pages/PasswordCrackEsti";
import DevJTool from "./pages/project-pages/DevJTool";
import PromptRouterPage from "./pages/project-pages/PromptRouterPage";

// ── Page entry transition ──
// Enter-only on purpose: the new route mounts immediately (no exit
// animation / mode="wait"), so navigation is never delayed and scroll
// resets while the new page is already in place. Keep it short.
const pageEnter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.base, ease: EASE },
};
const pageEnterReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DURATION.fast },
};

const DEFAULT_TITLE = "Farhaan Khan | Developer Portfolio";
const PAGE_TITLES = {
  "/": DEFAULT_TITLE,
  "/work": "Work | Farhaan Khan",
  "/log": "Build Log | Farhaan Khan",
  "/lab": "Lab | Farhaan Khan",
  "/about": "About | Farhaan Khan",
};

function titleFor(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const project = getProjectBySlug(pathname.replace("/projects/", ""));
  if (project?.internalRoute === pathname) {
    return `${project.title} | Farhaan Khan`;
  }
  return "Page not found | Farhaan Khan";
}

function AnimatedRoutes() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const enter = prefersReducedMotion ? pageEnterReduced : pageEnter;

  useEffect(() => {
    document.title = titleFor(location.pathname);
  }, [location.pathname]);

  return (
    <Motion.div
      key={location.pathname}
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
    >
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/log" element={<LogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/skills"
          element={<Navigate to="/about#toolkit" replace />}
        />
        <Route path="/projects" element={<Navigate to="/work" replace />} />
        <Route path="/lab" element={<LabPage />} />
        <Route
          path="/contact"
          element={<Navigate to="/about#contact" replace />}
        />
        <Route
          path="/projects/folder-structure-visualizer"
          element={<FolderStructurePage />}
        />
        {/* Legacy slug — this project used to be routed under an old
              project identity ("cortex-ai"). Redirect rather than break
              links that already point at it. */}
        <Route
          path="/projects/cortex-ai"
          element={
            <Navigate to="/projects/folder-structure-visualizer" replace />
          }
        />
        <Route
          path="/projects/password-estimator"
          element={<PasswordCrackEsti />}
        />
        <Route path="/projects/devtool" element={<DevJTool />} />
        <Route path="/projects/prompt-router" element={<PromptRouterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Motion.div>
  );
}

// ── Root App ──
function App() {
  return (
    <ResumeChooserProvider>
      <div className="app-shell">
        <AmbientBackground />

        <NavBar />
        <ScrollToTop />
        <AnimatedRoutes />
        <Footer />
      </div>
    </ResumeChooserProvider>
  );
}

export default App;
