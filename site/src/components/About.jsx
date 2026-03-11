import { motion } from "framer-motion";
import aboutPhoto from "../assets/about-photo.jpg";

function About() {
  return (
    <section className="section">
      <motion.div
        className="about-layout"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="content-section about-expanded">
          <p className="section-tag">Who I am</p>
          <h2>About Me</h2>

          <p>
            I’m Farhaan Khan, a Computer Science student who enjoys building
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
            Right now, I’m focused on improving as a developer through
            consistent project-building, better UI thinking, stronger full-stack
            fundamentals, and a growing interest in AI and security-inspired
            systems.
          </p>

          <p className="about-bridge">
            I’m especially interested in growing through real projects,
            improving my full-stack workflow, and building a portfolio that
            reflects both skill and momentum.
          </p>

          <div className="about-highlights">
            <div className="about-highlight-card">
              <h3>What I build</h3>
              <p>
                Web apps, dev tools, portfolio projects, and AI-flavored
                systems.
              </p>
            </div>

            <div className="about-highlight-card">
              <h3>What I value</h3>
              <p>
                Clean UI, practical features, modular code, and growth through
                shipping.
              </p>
            </div>

            <div className="about-highlight-card">
              <h3>Current goal</h3>
              <p>
                Becoming internship-ready with a stronger portfolio and real
                project depth.
              </p>
            </div>
          </div>
        </div>

        <div className="about-photo-card">
          <img
            src={aboutPhoto}
            alt="Farhaan Khan casual portrait"
            className="about-photo"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default About;
