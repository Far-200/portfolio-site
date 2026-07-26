import { motion } from "framer-motion";
import { LAB_SUMMARY } from "../../data/labData";

function LabHero() {
  return (
    <section className="section lab-hero">
      <motion.div
        className="lab-hero-inner"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lab-hero-top">
          <p className="section-tag">~/lab</p>
          <div className="lab-status" aria-hidden="false">
            <span className="lab-status-label">Lab status</span>
            <span className="lab-status-value">
              <span className="lab-status-dot" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>

        <h1>The Lab</h1>
        <p className="lab-hero-text">
          Experiments, active builds, engineering notes, and things currently
          refusing to compile.
        </p>

        <div className="lab-summary-strip">
          {LAB_SUMMARY.map((item) => (
            <div className="lab-summary-item" key={item.label}>
              <span className="lab-summary-value">{item.value}</span>
              <span className="lab-summary-label">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default LabHero;
