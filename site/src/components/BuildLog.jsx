import { motion as Motion } from "framer-motion";
import { BUILD_LOG } from "../data/buildLog";
import { getProjectBySlug } from "../data/projects";
import BuildLogEntry from "./BuildLogEntry";
import {
  EASE,
  sectionReveal,
  staggerContainer,
  useReducedMotion,
} from "../lib/motion";

const timelineAssembly = {
  hidden: {},
  show: {},
};

const timelineDraw = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

const entryReveal = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

// Groups entries by year for display. Every current entry happens to
// be 2026, but this keeps the section correct once older ones exist.
function groupByYear(entries) {
  const groups = [];
  for (const entry of entries) {
    const group = groups.find((g) => g.year === entry.year);
    if (group) {
      group.entries.push(entry);
    } else {
      groups.push({ year: entry.year, entries: [entry] });
    }
  }
  return groups;
}

function BuildLog() {
  const prefersReducedMotion = useReducedMotion();
  const yearGroups = groupByYear(BUILD_LOG);

  return (
    <section id="log" className="v4-log section">
      <Motion.div
        className="v4-log-header"
        variants={prefersReducedMotion ? undefined : sectionReveal}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "show"}
        viewport={{ once: true }}
      >
        <h2 className="v4-log-heading">Build Log</h2>
        <p className="v4-log-subheading">
          Things changed, shipped, broken and learned.
        </p>
      </Motion.div>

      {yearGroups.map((group) => (
        <div
          className="v4-log-year-group"
          key={group.year}
        >
          <h3 className="v4-log-year" id={`v4-log-year-${group.year}`}>
            {group.year}
          </h3>
          <Motion.div
            className="v4-log-timeline"
            variants={prefersReducedMotion ? undefined : timelineAssembly}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.15 }}
          >
            <Motion.span
              className="v4-log-timeline-line"
              variants={prefersReducedMotion ? undefined : timelineDraw}
              aria-hidden="true"
            />
            <Motion.ol
              className="v4-log-list"
              aria-labelledby={`v4-log-year-${group.year}`}
              variants={prefersReducedMotion ? undefined : staggerContainer}
            >
              {group.entries.map((entry) => (
                <Motion.li
                  className="v4-log-row"
                  key={entry.id}
                  variants={prefersReducedMotion ? undefined : entryReveal}
                >
                  <BuildLogEntry
                    date={entry.date}
                    year={entry.year}
                    type={entry.type}
                    title={entry.title}
                    description={entry.description}
                    project={
                      entry.projectId ? getProjectBySlug(entry.projectId) : null
                    }
                  />
                </Motion.li>
              ))}
            </Motion.ol>
          </Motion.div>
        </div>
      ))}
    </section>
  );
}

export default BuildLog;
