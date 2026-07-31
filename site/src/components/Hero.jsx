import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";
import githubProfile from "../assets/Mewoth.jpg";
import DeveloperTerminal from "./DeveloperTerminal";
import SocialProfileLink from "./SocialProfileLink";

// Typewriter cycling status lines — the personality layer
const STATUS_LINES = [
  "building weirdly useful tools",
  "shipping developer tools",
  "debugging life choices",
  "turning caffeine into commits",
  "making things people actually use",
];

function TypewriterStatus() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pause | erasing

  useEffect(() => {
    const full = STATUS_LINES[lineIndex];

    if (phase === "typing") {
      if (displayed.length < full.length) {
        const t = setTimeout(
          () => setDisplayed(full.slice(0, displayed.length + 1)),
          48,
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pause"), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("erasing"), 300);
      return () => clearTimeout(t);
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setLineIndex((i) => (i + 1) % STATUS_LINES.length);
          setPhase("typing");
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase, lineIndex]);

  return (
    <span className="typewriter-text">
      <span className="typewriter-prefix">// </span>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true">
        |
      </span>
    </span>
  );
}

// Framer motion variants
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const photoVariant = {
  hidden: { opacity: 0, x: 28, scale: 0.97 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
  },
};

function Hero() {
  return (
    <section className="hero section">
      {/* ── Left column ── */}
      <motion.div
        className="hero-left"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className="badge" variants={item}>
          Building wierdly useful softwares since 2023
        </motion.p>

        <motion.h1 variants={item}>
          Building tools
          <span>developers actually use</span>
        </motion.h1>

        <motion.div className="hero-typewriter" variants={item}>
          <TypewriterStatus />
        </motion.div>

        <motion.p className="hero-text" variants={item}>
          Building developer tools, full-stack apps, and AI-assisted systems
          that people might actually use instead of abandoning after the GitHub
          push.
        </motion.p>

        <motion.div className="hero-buttons" variants={item}>
          <Link to="/projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link to="/skills" className="btn btn-secondary">
            Skills
          </Link>
          <SocialProfileLink
            href="https://github.com/Far-200"
            label="GitHub"
            handle="@Far-200"
            profileName="Far-200"
            profileImage={githubProfile}
            className="hero-social-link"
          >
            <span className="btn btn-secondary">GitHub</span>
          </SocialProfileLink>
        </motion.div>

        <motion.div className="hero-stats" variants={item}>
          <div className="hero-stat-card">
            <h3>4+</h3>
            <p>Deployed Projects</p>
          </div>
          <div className="hero-stat-card">
            <h3>Full-Stack</h3>
            <p>React · Node · APIs</p>
          </div>
          <div className="hero-stat-card">
            <h3>AI + Tools</h3>
            <p>Practical systems</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right column ── */}
      <motion.div
        className="hero-right"
        variants={photoVariant}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="hero-photo-card"
          whileHover={{
            y: -6,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <img
            src={profileImage}
            alt="Farhaan Khan portrait"
            className="hero-photo"
          />
          <div className="hero-status">Open to Internships &amp; Roles</div>
        </motion.div>

        <a
          href="/resume/Farhaan_Khan_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="resume-cta"
        >
          View Resume ↗
        </a>

        {/* Developer Terminal — replaces GitHub heatmap */}
        <DeveloperTerminal />
      </motion.div>
    </section>
  );
}

export default Hero;
