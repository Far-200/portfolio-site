import { motion } from "framer-motion";
import { BUILD_LOG } from "../data/buildLog";
import { getProjectBySlug } from "../data/projects";
import BuildLogEntry from "./BuildLogEntry";
import { sectionReveal, fadeOnly, useReducedMotion } from "../lib/motion";

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
      <motion.div
        className="v4-log-header"
        variants={prefersReducedMotion ? fadeOnly : sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="v4-log-heading">Build Log</h2>
        <p className="v4-log-subheading">
          Things changed, shipped, broken and learned.
        </p>
      </motion.div>

      {yearGroups.map((group) => (
        <div className="v4-log-year-group" key={group.year}>
          <p className="v4-log-year" aria-hidden="true">
            {group.year}
          </p>
          <ol className="v4-log-list">
            {group.entries.map((entry) => (
              <li className="v4-log-row" key={entry.id}>
                <BuildLogEntry
                  date={entry.date}
                  type={entry.type}
                  title={entry.title}
                  description={entry.description}
                  project={
                    entry.projectId ? getProjectBySlug(entry.projectId) : null
                  }
                />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

export default BuildLog;
