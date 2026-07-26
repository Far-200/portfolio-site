import { motion } from "framer-motion";
import { LEARNING_FOCUS } from "../../data/labData";

function LearningTerminal() {
  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Learning</p>
        <h2>Current Learning Quest</h2>
        <p>What's actually being worked through right now, tracked honestly.</p>
      </motion.div>

      <motion.div
        className="learn-terminal"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="learn-terminal-bar">
          <span className="dev-terminal-dot dev-terminal-dot--red" />
          <span className="dev-terminal-dot dev-terminal-dot--yellow" />
          <span className="dev-terminal-dot dev-terminal-dot--green" />
          <span className="dev-terminal-title">
            farhaan@portfolio — current-focus
          </span>
        </div>

        <div className="learn-terminal-body">
          <p className="learn-terminal-cmd">
            <span className="dev-terminal-prompt">
              farhaan@portfolio:~/lab$
            </span>{" "}
            cat current-focus.txt
          </p>

          <div className="learn-terminal-groups">
            {LEARNING_FOCUS.map((group) => (
              <div className="learn-group" key={group.heading}>
                <p className="learn-group-heading">{group.heading}</p>
                <ul className="learn-group-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="dev-terminal-divider" />
          <p className="learn-terminal-footer">
            // learning in public, debugging in private
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default LearningTerminal;
