import { motion } from "framer-motion";
import { FaGithub, FaReact, FaShieldAlt, FaCopy } from "react-icons/fa";
import { SiVite, SiTailwindcss, SiJavascript } from "react-icons/si";
import { Link } from "react-router-dom";

function PasswordCrackEsti() {
  const features = [
    "Password strength analysis",
    "Brute-force crack time estimation",
    "Secure password generator",
    "Copy to clipboard support",
    "Character validation feedback",
    "Clean responsive UI",
  ];

  const stack = [
    { name: "React", icon: <FaReact /> },
    { name: "Vite", icon: <SiVite /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss /> },
    { name: "JavaScript", icon: <SiJavascript /> },
  ];

  const learnings = [
    "Breaking password quality into meaningful visual feedback",
    "Using entropy-style logic to estimate crack time more practically",
    "Designing a responsive UI for security tooling",
    "Building a small utility project that feels polished and useful",
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
        <h1>Password Strength & Crack Time Estimator</h1>
        <p className="project-detail-subtext">
          A frontend security tool built to analyze password strength, estimate
          brute-force crack time, generate stronger passwords, and give clearer
          feedback through a clean responsive interface.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/Password-Strength-Crack-Time-Estimator"
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
            This project focuses on helping users understand password quality in
            a more useful way than a simple “weak” or “strong” label. It checks
            password characteristics, estimates brute-force crack time, and also
            gives users the option to generate stronger passwords instantly.
          </p>

          <p>
            It was built as part of a small daily project challenge, with a
            strong focus on clean UI, practical utility, and beginner-friendly
            security feedback.
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
            <FaShieldAlt style={{ marginRight: "0.5rem" }} />
            Security-oriented user feedback
          </div>
          <div className="project-feature-card">
            <FaCopy style={{ marginRight: "0.5rem" }} />
            Quick usability with generator + copy flow
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
          Strong next upgrades would include better attack model explanations,
          more detailed entropy breakdowns, password history checks, common
          password detection, and live visual comparisons between weak and
          stronger password patterns.
        </p>
      </motion.div>
    </section>
  );
}

export default PasswordCrackEsti;
