import { motion } from "framer-motion";
import { FaGithub, FaRobot, FaLock, FaBolt, FaChrome } from "react-icons/fa";
import { SiJavascript, SiGooglechrome } from "react-icons/si";
import { Link } from "react-router-dom";

function PromptRouterPage() {
  const features = [
    "Real-time AI model recommendation while typing",
    "Works on Claude, ChatGPT, and Gemini",
    "Rule-based prompt classification engine",
    "Detects selected model and warns about overkill",
    "Attachment-aware suggestions without reading files",
    "100% local privacy-first Chrome extension",
  ];

  const stack = [
    { name: "Vanilla JavaScript", icon: <SiJavascript /> },
    { name: "Chrome Extension", icon: <FaChrome /> },
    { name: "Manifest V3", icon: <SiGooglechrome /> },
    { name: "Local Rule Engine", icon: <FaRobot /> },
  ];

  const learnings = [
    "Building browser extensions using Manifest V3 and content scripts",
    "Observing dynamic AI chat UIs using MutationObserver",
    "Designing a local prompt classifier without APIs or backend calls",
    "Handling privacy-sensitive workflows where user prompts never leave the browser",
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
        <h1>PromptRouter</h1>
        <p className="project-detail-subtext">
          A privacy-first Chrome extension that recommends the right AI model
          for your prompt in real time, so you stop burning premium models on
          tiny tasks.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/prompt-model-suggester"
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
            PromptRouter watches the prompt box on supported AI platforms and
            suggests whether a lightweight, balanced, or premium model is the
            better fit for the task.
          </p>

          <p>
            The extension runs completely inside the browser. It analyzes text
            locally, detects visible attachment hints, reads the currently
            selected model from the page UI, and shows a floating recommendation
            widget without sending prompts anywhere.
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
            <FaBolt style={{ marginRight: "0.5rem" }} />
            Routing prompts to the right model tier
          </div>
          <div className="project-feature-card">
            <FaLock style={{ marginRight: "0.5rem" }} />
            Keeping prompt analysis fully local and private
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
          Next upgrades would include stronger prompt classification rules,
          better model detection across UI changes, improved provider support,
          cleaner onboarding, and a more polished Chrome Web Store-ready
          experience.
        </p>
      </motion.div>
    </section>
  );
}

export default PromptRouterPage;
