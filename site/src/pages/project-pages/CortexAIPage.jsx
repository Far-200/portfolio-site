import { motion } from "framer-motion";
import { FaGithub, FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiTailwindcss, SiGooglegemini } from "react-icons/si";
import { Link } from "react-router-dom";

function CortexAIPage() {
  const features = [
    "AI responses powered by Google Gemini",
    "Smart follow-up questions based on selected text",
    "Markdown rendering for readable responses",
    "Formatted code block support",
    "Copy response button for quick reuse",
    "Smooth chat UI with auto-scroll",
    "Send messages using Enter key",
  ];

  const stack = [
    { name: "React", icon: <FaReact /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss /> },
    { name: "Node.js", icon: <FaNodeJs /> },
    { name: "Express.js", icon: <SiExpress /> },
    { name: "Gemini API", icon: <SiGooglegemini /> },
  ];

  const learnings = [
    "Building a clean full-stack structure with separate client and server folders",
    "Handling AI requests through an Express backend instead of exposing secrets on the frontend",
    "Designing a chat UI that feels smooth, readable, and developer-friendly",
    "Rendering markdown and code responses in a more useful way for technical users",
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
        <h1>Cortex AI Assistant</h1>
        <p className="project-detail-subtext">
          A clean full-stack AI chatbot built with React and Express, designed
          for developer-friendly conversations, formatted responses, and smart
          follow-up interactions.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/cortex-ai-assistant"
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
            Cortex AI focuses on giving users a cleaner AI chat experience with
            readable markdown output, code-friendly responses, and contextual
            follow-up prompts. The frontend is built with React and Tailwind,
            while the backend uses Node.js and Express to connect securely with
            the Gemini API.
          </p>

          <p>
            The project is structured as a full-stack app with separate
            <strong> client</strong> and <strong>server</strong> folders, which
            makes it easier to manage UI and backend logic independently.
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
          This project has plenty of room to grow. Strong next upgrades would be
          conversation memory, chat history persistence, streaming responses,
          syntax highlighting, and deployment for real public use.
        </p>
      </motion.div>
    </section>
  );
}

export default CortexAIPage;
