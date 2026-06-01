import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Folder Structure Visualizer",
    desc: "Converts typed or pasted folder layouts into clean visual trees with ZIP scaffold export — a real developer utility you can use today.",
    tech: ["React", "JavaScript", "Vite", "ZIP Export"],
    route: "/projects/cortex-ai",
    github: "https://github.com/Far-200/folder-structure-visualizer",
    builtBecause: "manually creating 70 files was painful",
  },
  {
    title: "Password Strength & Crack Time Estimator",
    desc: "Security-focused tool that evaluates password strength and estimates crack time using entropy-based logic. No backend, runs fully in browser.",
    tech: ["React", "JavaScript", "CSS"],
    route: "/projects/password-estimator",
    github: "https://github.com/Far-200/Password-Strength-Crack-Time-Estimator",
    builtBecause: "most password checkers just say 'strong' with zero math",
  },
  {
    title: "Developer JSON Formatter Tool",
    desc: "Clean utility for formatting, validating, minifying, and testing JSON and API responses — built for developer workflow speed.",
    tech: ["React", "JavaScript", "CSS", "API Testing"],
    route: "/projects/devtool",
    github: "https://github.com/Far-200/DevTool",
    builtBecause: "copy-pasting JSON into random websites felt wrong",
  },
  {
    title: "PromptRouter",
    desc: "Privacy-first Chrome extension that recommends the right AI model for your prompt in real time — 100% local, no API calls, no data sent.",
    tech: ["JavaScript", "Chrome Extension", "Manifest V3", "AI UX"],
    route: "/projects/prompt-router",
    github: "https://github.com/Far-200/prompt-model-suggester",
    builtBecause: "people use expensive AI models for tiny prompts",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectCard({ project, index }) {
  return (
    <motion.div
      className="project-card project-card--enhanced"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      whileHover="hovered"
    >
      {/* Glowing border overlay — appears on hover via CSS */}
      <span className="project-card-glow" aria-hidden="true" />

      <span className="project-num">{String(index + 1).padStart(2, "0")}</span>
      <h3>{project.title}</h3>
      <p>{project.desc}</p>

      {/* Built Because micro-section */}
      {project.builtBecause && (
        <p className="project-built-because">
          <span className="project-built-label">built because →</span>{" "}
          {project.builtBecause}
        </p>
      )}

      <div className="chip-wrap">
        {project.tech.map((t) => (
          <motion.span
            className="chip chip-purple chip--interactive"
            key={t}
            whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
          >
            {t}
          </motion.span>
        ))}
      </div>

      <div className="project-actions">
        {project.route && (
          <Link
            to={project.route}
            className="project-link project-link--premium"
          >
            <span>View Project</span>
            <ArrowRight
              size={13}
              strokeWidth={2.5}
              className="project-link-arrow"
            />
          </Link>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="github-link"
          aria-label={`${project.title} on GitHub`}
        >
          <Github size={15} strokeWidth={2} />
        </a>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Work</p>
        <h2>Featured Projects</h2>
        <p>A few things I've built instead of resting like a normal human.</p>
      </motion.div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
