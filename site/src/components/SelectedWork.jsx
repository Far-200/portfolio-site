import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";
import { FLAGSHIP_PROJECTS } from "../data/projects";
import ProjectVisual from "./ProjectVisual";
import { sectionReveal, fadeOnly, useReducedMotion } from "../lib/motion";

function WorkEntry({ project, index, prefersReducedMotion }) {
  const number = String(index + 1).padStart(2, "0");
  const entryClass = `v4-work-entry${project.media ? " v4-work-entry--media" : ""}`;

  return (
    <motion.article
      className={entryClass}
      variants={prefersReducedMotion ? fadeOnly : sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="v4-work-entry-text">
        <p className="v4-work-eyebrow">
          <span className="v4-work-index">{number}</span>
          <span className="v4-work-eyebrow-sep" aria-hidden="true">/</span>
          <span className="v4-work-category">{project.category}</span>
          <span className="v4-work-eyebrow-sep" aria-hidden="true">/</span>
          <span className="v4-work-status">{project.status}</span>
        </p>

        <h3 className="v4-work-title">{project.title}</h3>

        <p className="v4-work-problem">{project.problem}</p>

        <div className="v4-work-block">
          <p className="v4-work-block-label">Built</p>
          <p className="v4-work-block-text">{project.built}</p>
          {project.technicalNote && (
            <p className="v4-work-note">{project.technicalNote}</p>
          )}
        </div>

        <p className="v4-work-tech">{project.tech.join(" · ")}</p>

        {project.builtBecause && (
          <p className="v4-work-built-because">
            <span className="v4-work-built-because-label">
              built because →
            </span>{" "}
            {project.builtBecause}
          </p>
        )}

        <div className="v4-work-links">
          {project.internalRoute && (
            <Link
              to={project.internalRoute}
              className="v4-work-link"
              aria-label={`View case study — ${project.title}`}
            >
              View Case Study
              <ArrowUpRight
                size={13}
                strokeWidth={2.25}
                className="v4-work-link-arrow"
                aria-hidden="true"
              />
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="v4-work-link"
              aria-label={`${project.title} on GitHub`}
            >
              <Github size={14} strokeWidth={2} aria-hidden="true" />
              GitHub
              <ArrowUpRight
                size={13}
                strokeWidth={2.25}
                className="v4-work-link-arrow"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </div>

      <ProjectVisual
        project={project}
        index={index}
        prefersReducedMotion={prefersReducedMotion}
      />
    </motion.article>
  );
}

function SelectedWork() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="work" className="v4-work section">
      <motion.div
        className="v4-work-header"
        variants={prefersReducedMotion ? fadeOnly : sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="v4-work-heading">Selected Work</h2>
        <p className="v4-work-subheading">03 Projects / Built, Broken, Iterated</p>
      </motion.div>

      <div className="v4-work-list">
        {FLAGSHIP_PROJECTS.map((project, index) => (
          <WorkEntry
            key={project.id}
            project={project}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

export default SelectedWork;
