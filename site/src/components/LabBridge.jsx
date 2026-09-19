import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ACTIVE_BUILDS, LAB_UTILITIES } from "../data/labData";
import {
  sectionReveal,
  fadeOnly,
  revealViewport,
  useReducedMotion,
} from "../lib/motion";

// Work that isn't one of Selected Work's flagships, from labData.js.
const PREVIEWS = [
  ACTIVE_BUILDS.find((b) => b.id === "attendance-analytics"),
  LAB_UTILITIES.find((u) => u.id === "astra"),
].map((item) => ({
  id: item.id,
  name: item.name ?? item.title,
  stage: item.stage,
  summary: item.summary,
}));

function LabBridge() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="v4-lab-bridge section"
      aria-labelledby="lab-bridge-title"
    >
      <Motion.div
        className="v4-lab-bridge-inner"
        variants={prefersReducedMotion ? fadeOnly : sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        <header className="v4-lab-bridge-header">
          <p className="v4-lab-bridge-tag">Beyond Selected Work</p>
          <h2 className="v4-lab-bridge-heading" id="lab-bridge-title">
            From the Lab
          </h2>
          <p className="v4-lab-bridge-copy">
            Smaller tools, experiments, unfinished ideas, and things currently
            misbehaving.
          </p>
        </header>

        <ul className="v4-lab-bridge-list">
          {PREVIEWS.map((item) => (
            <li className="v4-lab-bridge-item" key={item.id}>
              <span className="v4-lab-bridge-item-status">{item.stage}</span>
              <div className="v4-lab-bridge-item-body">
                <h3 className="v4-lab-bridge-item-title">{item.name}</h3>
                <p className="v4-lab-bridge-item-summary">{item.summary}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/lab" className="v4-lab-bridge-cta">
          Enter the Lab
          <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </Motion.div>
    </section>
  );
}

export default LabBridge;
