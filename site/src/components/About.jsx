import { motion } from "framer-motion";
import aboutPhoto from "../assets/about-photo.jpg";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const row = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function About({ showPhoto = true }) {
  return (
    <section className="section">
      <motion.div
        className={`about-layout ${!showPhoto ? "about-layout-single" : ""}`}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="content-section about-expanded" variants={row}>
          <p className="section-tag">Who I am</p>
          <h2>About Me</h2>

          <p>
            I'm Farhaan Khan, a Computer Science student who enjoys building
            full-stack applications, developer tools, and AI-powered systems
            that feel practical, modern, and actually useful.
          </p>
          <p>
            I like working on projects where clean frontend design meets real
            functionality — whether that means building React interfaces,
            integrating APIs, experimenting with FastAPI backends, or shaping
            ideas into projects that look polished and feel real.
          </p>
          <p>
            Right now, I'm focused on improving as a developer through
            consistent project-building, better UI thinking, stronger full-stack
            fundamentals, and a growing interest in AI and security-inspired
            systems.
          </p>
          <p className="about-bridge">
            I'm especially interested in growing through real projects,
            improving my full-stack workflow, and building a portfolio that
            reflects both skill and momentum.
          </p>

          <div className="about-highlights">
            {[
              {
                title: "What I build",
                text: "Web apps, dev tools, portfolio projects, and AI-flavored systems.",
              },
              {
                title: "What I value",
                text: "Clean UI, practical features, modular code, and growth through shipping.",
              },
              {
                title: "Current goal",
                text: "Becoming internship-ready with a stronger portfolio and real project depth.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="about-highlight-card"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
              >
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showPhoto && (
          <motion.div className="about-photo-card" variants={row}>
            <img
              src={aboutPhoto}
              alt="Farhaan Khan casual portrait"
              className="about-photo"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default About;
