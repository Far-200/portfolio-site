import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, ArrowRight } from "lucide-react";
import { ARCHIVE_STATUSES, PROJECT_ARCHIVE } from "../../data/labData";

function ArchiveCard({ project }) {
  return (
    <motion.article
      className="archive-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="archive-card-top">
        <span className={`archive-status archive-status--${project.status.toLowerCase()}`}>
          {project.status}
        </span>
      </div>

      <h3>{project.title}</h3>
      <p className="archive-summary">{project.summary}</p>

      <div className="chip-wrap">
        {project.tech.slice(0, 3).map((t) => (
          <span className="chip" key={t}>
            {t}
          </span>
        ))}
      </div>

      {(project.internalRoute || project.github) && (
        <div className="archive-actions">
          {project.internalRoute && (
            <Link to={project.internalRoute} className="project-link">
              <span>View Project</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="github-link"
              aria-label={`${project.title} on GitHub`}
            >
              <Github size={14} strokeWidth={2} />
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}

function ProjectArchive() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return PROJECT_ARCHIVE;
    return PROJECT_ARCHIVE.filter((p) => p.status === activeFilter);
  }, [activeFilter]);

  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Archive</p>
        <h2>Project Archive</h2>
        <p>Everything built, being built, or currently misbehaving.</p>
      </motion.div>

      <div className="archive-filters" role="group" aria-label="Filter projects by status">
        {ARCHIVE_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`archive-filter${activeFilter === status ? " archive-filter--active" : ""}`}
            aria-pressed={activeFilter === status}
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <motion.div className="archive-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ArchiveCard project={project} key={project.id} />
            ))
          ) : (
            <motion.p
              className="archive-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Nothing here yet — try a different filter.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export default ProjectArchive;
