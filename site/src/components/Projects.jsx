import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/projects";

// Every project with a real case-study route — reproduces the same
// four entries this page has always shown (Think Before Code and
// FlowTrace don't have case-study pages yet, so they naturally sit
// this one out until Phase 4/6 builds those).
const projects = PROJECTS.filter((p) => Boolean(p.internalRoute));

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
    <Motion.div
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
      <p>{project.summary}</p>

      {/* Built Because micro-section */}
      {project.builtBecause && (
        <p className="project-built-because">
          <span className="project-built-label">built because →</span>{" "}
          {project.builtBecause}
        </p>
      )}

      <div className="chip-wrap">
        {project.tech.map((t) => (
          <Motion.span
            className="chip chip-purple chip--interactive"
            key={t}
            whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
          >
            {t}
          </Motion.span>
        ))}
      </div>

      <div className="project-actions">
        {project.internalRoute && (
          <Link
            to={project.internalRoute}
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
    </Motion.div>
  );
}

function Projects() {
  return (
    <section className="section">
      <Motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Work</p>
        <h2>Featured Projects</h2>
        <p>A few things I've built instead of resting like a normal human.</p>
      </Motion.div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
