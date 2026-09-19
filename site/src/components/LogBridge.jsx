import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BUILD_LOG } from "../data/buildLog";
import {
  sectionReveal,
  fadeOnly,
  revealViewport,
  useReducedMotion,
} from "../lib/motion";

const RECENT_ENTRIES = BUILD_LOG.slice(0, 2);

function LogBridge() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="v4-log-bridge section" aria-labelledby="log-bridge-title">
      <Motion.div
        className="v4-log-bridge-inner"
        variants={prefersReducedMotion ? fadeOnly : sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
      >
        <header className="v4-log-bridge-header">
          <p className="v4-log-bridge-label">Latest from the log</p>
          <h2 className="v4-log-bridge-heading" id="log-bridge-title">
            Build notes
          </h2>
        </header>

        <ol className="v4-log-bridge-list">
          {RECENT_ENTRIES.map((entry) => (
            <li className="v4-log-bridge-item" key={entry.id}>
              <p className="v4-log-bridge-meta">
                <span>{entry.date}</span>
                <span className="v4-log-bridge-meta-separator" aria-hidden="true">
                  ·
                </span>
                <span>{entry.type}</span>
              </p>
              <div className="v4-log-bridge-entry">
                <h3 className="v4-log-bridge-title">{entry.title}</h3>
                <p className="v4-log-bridge-description">
                  {entry.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link to="/log" className="v4-log-bridge-cta">
          View build log
          <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </Motion.div>
    </section>
  );
}

export default LogBridge;
