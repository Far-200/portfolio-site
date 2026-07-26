import { motion } from "framer-motion";
import { ENGINEERING_LOG } from "../../data/labData";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDisplayDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

function EngineeringLog() {
  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Log</p>
        <h2>Engineering Log</h2>
        <p>A running record of what actually happened, in order.</p>
      </motion.div>

      <ol className="eng-log">
        {ENGINEERING_LOG.map((entry, index) => (
          <motion.li
            className="eng-log-entry"
            key={entry.date + entry.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="eng-log-meta">
              <time dateTime={entry.date} className="eng-log-date">
                {formatDisplayDate(entry.date)}
              </time>
              <span className="eng-log-tag">{entry.tag}</span>
            </div>
            <div className="eng-log-body">
              <p className="eng-log-title">{entry.title}</p>
              <p className="eng-log-detail">{entry.detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default EngineeringLog;
