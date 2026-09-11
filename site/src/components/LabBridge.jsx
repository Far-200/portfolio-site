import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECT_ARCHIVE } from "../data/labData";
import { sectionReveal, fadeOnly, useReducedMotion } from "../lib/motion";

// A different layer of work than Selected Work's three flagships —
// smaller/earlier-stage entries already tracked in labData.js.
const PREVIEW_IDS = ["aptivision", "astra-archive", "prompt-router"];
const PREVIEWS = PREVIEW_IDS.map((id) =>
  PROJECT_ARCHIVE.find((p) => p.id === id),
);

function LabBridge() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="v4-lab-bridge section">
      <motion.div
        className="v4-lab-bridge-inner"
        variants={prefersReducedMotion ? fadeOnly : sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <p className="v4-lab-bridge-tag">Beyond Selected Work</p>
        <h2 className="v4-lab-bridge-heading">From the Lab</h2>
        <p className="v4-lab-bridge-copy">
          Smaller tools, experiments, unfinished ideas, and things currently
          misbehaving.
        </p>

        <ul className="v4-lab-bridge-list">
          {PREVIEWS.map((item) => (
            <li className="v4-lab-bridge-item" key={item.id}>
              <span className="v4-lab-bridge-item-status">{item.status}</span>
              <div className="v4-lab-bridge-item-body">
                <p className="v4-lab-bridge-item-title">{item.title}</p>
                <p className="v4-lab-bridge-item-summary">{item.summary}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/lab" className="v4-lab-bridge-cta">
          Enter the Lab
          <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}

export default LabBridge;
