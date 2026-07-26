import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { ACTIVE_BUILDS } from "../../data/labData";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function BuildCard({ build, index }) {
  return (
    <motion.article
      className="build-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <span className={`build-status build-status--${build.statusTone}`}>
        {build.status}
      </span>

      <h3>{build.title}</h3>
      <p className="build-desc">{build.description}</p>

      <div className="build-focus">
        <p className="build-focus-label">Current focus</p>
        <p className="build-focus-text">{build.focus}</p>
      </div>

      <div className="chip-wrap">
        {build.tech.map((t) => (
          <span className="chip chip-purple" key={t}>
            {t}
          </span>
        ))}
      </div>

      {(build.github || build.demo) && (
        <div className="build-actions">
          {build.github && (
            <a
              href={build.github}
              target="_blank"
              rel="noreferrer"
              className="build-link"
              aria-label={`${build.title} repository on GitHub`}
            >
              <Github size={14} strokeWidth={2} />
              <span>GitHub</span>
            </a>
          )}
          {build.demo && (
            <a
              href={build.demo}
              target="_blank"
              rel="noreferrer"
              className="build-link"
              aria-label={`${build.title} demo`}
            >
              <ExternalLink size={14} strokeWidth={2} />
              <span>Demo</span>
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}

function ActiveBuilds() {
  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Right now</p>
        <h2>Currently Building</h2>
        <p>What's actively taking shape, in various states of "done".</p>
      </motion.div>

      <div className="build-grid">
        {ACTIVE_BUILDS.map((build, index) => (
          <BuildCard build={build} index={index} key={build.id} />
        ))}
      </div>
    </section>
  );
}

export default ActiveBuilds;
