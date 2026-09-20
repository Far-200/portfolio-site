import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ResumeChooserProvider } from "./components/ResumeChooser";
import BusinessCardShell from "./components/business-card/BusinessCardShell";

function CardRoute() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  if (pathname !== location.pathname) {
    return <Navigate to={{ pathname, search: location.search, hash: location.hash }} replace />;
  }
  return <BusinessCardShell />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ResumeChooserProvider>
        <Routes>
          <Route path="/skills" element={<Navigate to="/about#toolkit" replace />} />
          <Route path="/contact" element={<Navigate to="/about#contact" replace />} />
          <Route path="/projects" element={<Navigate to="/work" replace />} />
          <Route path="/projects/cortex-ai" element={<Navigate to="/projects/folder-structure-visualizer" replace />} />
          <Route path="*" element={<CardRoute />} />
        </Routes>
      </ResumeChooserProvider>
    </MotionConfig>
  );
}
