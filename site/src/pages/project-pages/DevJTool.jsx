import { motion as Motion } from "framer-motion";
import { DURATION, EASE, revealViewport } from "../../lib/motion";
import { FaGithub, FaReact, FaCode, FaExchangeAlt } from "react-icons/fa";
import { SiVite, SiJavascript, SiJson } from "react-icons/si";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

function DevJTool({ embedded = false }) {
  const features = [
    "JSON formatter for readable structured output",
    "JSON minifier for compact payloads",
    "Copy JSON to clipboard",
    "Safe clear with confirmation",
    "API request tester",
    "Response status indicator",
    "Response time measurement",
    "Pretty JSON response viewer",
  ];

  const stack = [
    { name: "React", icon: <FaReact /> },
    { name: "Vite", icon: <SiVite /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "CSS", icon: <FaCode /> },
  ];

  const learnings = [
    "Designing small developer tools that solve practical workflow problems",
    "Handling JSON formatting, validation, and cleanup in a user-friendly way",
    "Displaying API responses more clearly with readable structure and useful feedback",
    "Building utility-style UI where usability matters more than visual noise",
  ];

  return (
    <section className="section project-detail-page v4-project">
      {!embedded && (
      <Motion.div
        className="project-detail-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
      >
        <p className="section-tag">Project Spotlight</p>
        <h1>DevTool — JSON Formatter & API Tester</h1>
        <p className="project-detail-subtext">
          A lightweight developer utility built for formatting JSON, testing
          APIs, and making raw responses easier to read, inspect, and work with.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/DevTool"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <FaGithub />
            <span>View Repository</span>
          </a>

          <a
            href="https://devtool.farhaankhan.dev"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            <FaExternalLinkAlt />
            <span>Live Demo ↗</span>
          </a>

          <Link to="/work" className="btn btn-secondary">
            Back to Work
          </Link>
        </div>
      </Motion.div>)}

      <div className="project-detail-grid">
        <Motion.div
          className="project-detail-main glass-card"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          viewport={revealViewport}
        >
          <h2>Overview</h2>
          <p>
            DevTool is built for developers who frequently work with JSON data
            and API responses. Instead of jumping between multiple tools, this
            project combines formatting, minifying, copying, and basic API
            testing in one compact interface.
          </p>

          <p>
            The goal of the project is simple: make common developer tasks feel
            faster, cleaner, and less annoying during debugging or testing.
          </p>
        </Motion.div>

        <Motion.div
          className="project-detail-side glass-card"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE, delay: 0.08 }}
          viewport={revealViewport}
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
        </Motion.div>
      </div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Key Features</h2>
        <div className="project-feature-grid">
          {features.map((feature) => (
            <div className="project-feature-card" key={feature}>
              {feature}
            </div>
          ))}
        </div>
      </Motion.div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Project Focus</h2>
        <div className="project-feature-grid">
          <div className="project-feature-card">
            <SiJson style={{ marginRight: "0.5rem" }} />
            Cleaner JSON readability and validation
          </div>
          <div className="project-feature-card">
            <FaExchangeAlt style={{ marginRight: "0.5rem" }} />
            Faster API inspection and response testing
          </div>
        </div>
      </Motion.div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>What I Learned</h2>
        <ul className="project-learnings">
          {learnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Motion.div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Next Improvements</h2>
        <p>
          Strong next upgrades would be custom request methods and headers,
          better error highlighting, collapsible JSON nodes, saved request
          history, and side-by-side request/response comparison for smoother
          debugging.
        </p>
      </Motion.div>
    </section>
  );
}

export default DevJTool;
