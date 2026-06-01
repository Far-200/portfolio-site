import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Rotating footer quips — cycles every 3.5s
const FOOTER_LINES = [
  "turning caffeine into commits",
  "debugging life choices",
  "shipping weirdly useful tools",
  "convincing CSS to cooperate",
  "npm install hope",
];

function RotatingFooter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % FOOTER_LINES.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="dev-terminal-footer">
      <span className="dev-terminal-prompt">{">"}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="dev-terminal-footer-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {FOOTER_LINES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function DeveloperTerminal() {
  return (
    <motion.div
      className="dev-terminal"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title bar */}
      <div className="dev-terminal-bar">
        <span className="dev-terminal-dot dev-terminal-dot--red" />
        <span className="dev-terminal-dot dev-terminal-dot--yellow" />
        <span className="dev-terminal-dot dev-terminal-dot--green" />
        <span className="dev-terminal-title">farhaan@portfolio — status</span>
      </div>

      {/* Body */}
      <div className="dev-terminal-body">
        <p className="dev-terminal-cmd">
          <span className="dev-terminal-prompt">farhaan@portfolio:~$</span>
          {" status"}
          <span className="dev-terminal-blink" aria-hidden="true">
            ▋
          </span>
        </p>

        <div className="dev-terminal-section">
          <p className="dev-terminal-label">Currently Building:</p>
          <p className="dev-terminal-item">
            <span className="dev-terminal-arrow">{">"}</span> PromptRouter
            heuristics
          </p>
          <p className="dev-terminal-item">
            <span className="dev-terminal-arrow">{">"}</span> FlowTrace
            execution engine
          </p>
          <p className="dev-terminal-item">
            <span className="dev-terminal-arrow">{">"}</span> AI-assisted
            tooling
          </p>
        </div>

        <div className="dev-terminal-section">
          <p className="dev-terminal-label">Last Deploy:</p>
          <p className="dev-terminal-item dev-terminal-item--success">
            <span className="dev-terminal-check">✓</span> portfolio-v3 shipped
          </p>
        </div>

        <div className="dev-terminal-section">
          <p className="dev-terminal-label">System Mood:</p>
          <p className="dev-terminal-item dev-terminal-item--mood">
            stable-ish
          </p>
        </div>

        <div className="dev-terminal-divider" />
        <RotatingFooter />
      </div>
    </motion.div>
  );
}

export default DeveloperTerminal;
