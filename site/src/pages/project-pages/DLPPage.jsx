import { motion } from "framer-motion";
import { FaGithub, FaShieldAlt, FaLock, FaBug } from "react-icons/fa";
import { SiPython, SiFastapi, SiReact } from "react-icons/si";
import { Link } from "react-router-dom";

function DLPPage() {
  const features = [
    "Sensitive data monitoring workflow",
    "Leak detection logic for protected information",
    "Security-focused project structure",
    "Alert-oriented prevention mindset",
    "Clean project flow for future upgrades",
    "Foundation for larger enterprise-style security systems",
  ];

  const stack = [
    { name: "Python", icon: <SiPython /> },
    { name: "FastAPI / Backend", icon: <SiFastapi /> },
    { name: "React / Frontend", icon: <SiReact /> },
    { name: "Security Logic", icon: <FaShieldAlt /> },
  ];

  const learnings = [
    "Thinking about security projects beyond just UI and focusing on protection workflows",
    "Structuring a project around detection, prevention, and monitoring ideas",
    "Designing a system with future scope for stronger enterprise-style features",
    "Building a portfolio project that connects well with larger cybersecurity and AI security ideas",
  ];

  return (
    <section className="section project-detail-page">
      <motion.div
        className="project-detail-hero"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-tag">Project Spotlight</p>
        <h1>Data Leak Prevention System</h1>
        <p className="project-detail-subtext">
          A security-focused project built around the idea of detecting,
          monitoring, and preventing sensitive information leaks through a more
          protection-first workflow.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/DLP"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <FaGithub />
            <span>View Repository</span>
          </a>

          <Link to="/projects" className="btn btn-secondary">
            Back to Projects
          </Link>
        </div>
      </motion.div>

      <div className="project-detail-grid">
        <motion.div
          className="project-detail-main glass-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <h2>Overview</h2>
          <p>
            This project explores the core idea of data leak prevention by
            focusing on how sensitive information can be identified, monitored,
            and protected inside a software workflow.
          </p>

          <p>
            It acts as a strong security-themed project in my portfolio and also
            reflects my growing interest in building practical systems around
            cybersecurity, monitoring, and enterprise-inspired protection logic.
          </p>
        </motion.div>

        <motion.div
          className="project-detail-side glass-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          viewport={{ once: true }}
        >
          <h2>Tech Stack</h2>

          <div className="project-stack-list">
            {stack.map((item) => (
              <div className="project-stack-item" key={item.name}>
                <span className="project-stack-icon">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Key Features</h2>
        <div className="project-feature-grid">
          {features.map((feature) => (
            <div className="project-feature-card" key={feature}>
              {feature}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Project Focus</h2>
        <div className="project-feature-grid">
          <div className="project-feature-card">
            <FaLock style={{ marginRight: "0.5rem" }} />
            Preventing sensitive information exposure
          </div>
          <div className="project-feature-card">
            <FaBug style={{ marginRight: "0.5rem" }} />
            Detecting risky behavior and suspicious data flow
          </div>
        </div>
      </motion.div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>What I Learned</h2>
        <ul className="project-learnings">
          {learnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Next Improvements</h2>
        <p>
          Strong next upgrades would include deeper monitoring logic, better
          alerting, clearer dashboards, stronger rules for sensitive-data
          detection, and expansion toward a more enterprise-grade leak
          prevention workflow.
        </p>
      </motion.div>
    </section>
  );
}

export default DLPPage;
