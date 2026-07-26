import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LabHero from "../components/lab/LabHero";
import ActiveBuilds from "../components/lab/ActiveBuilds";
import EngineeringLog from "../components/lab/EngineeringLog";
import LearningTerminal from "../components/lab/LearningTerminal";
import ProjectArchive from "../components/lab/ProjectArchive";

function LabCTA() {
  return (
    <section className="section lab-cta-section">
      <motion.div
        className="lab-cta"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p>Looking for the polished versions?</p>
        <Link to="/projects" className="lab-cta-link">
          <span>View featured projects</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </motion.div>
    </section>
  );
}

function LabPage() {
  return (
    <main className="page">
      <LabHero />
      <ActiveBuilds />
      <EngineeringLog />
      <LearningTerminal />
      <ProjectArchive />
      <LabCTA />
    </main>
  );
}

export default LabPage;
