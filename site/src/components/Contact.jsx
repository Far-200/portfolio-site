import { motion } from "framer-motion";

function Contact() {
  return (
    <section className="section contact-wrap">
      <motion.div
        className="contact-section"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="contact-tag">
          Open to internships • collaborations • cool ideas
        </p>
        <h2>Let’s Connect</h2>

        <p>
          Whether it’s internships, collaborations, interesting ideas, or simply
          talking about web development, UI, AI, or project-building, I’m always
          happy to connect.
        </p>

        <div className="contact-grid">
          <div className="contact-info-card">
            <h3>Reach out for</h3>
            <ul>
              <li>Internship opportunities</li>
              <li>Project collaborations</li>
              <li>Frontend or full-stack discussions</li>
              <li>Developer tool and AI project ideas</li>
            </ul>
          </div>

          <div className="contact-info-card">
            <h3>Currently looking for</h3>
            <ul>
              <li>Hands-on development experience</li>
              <li>Strong portfolio projects</li>
              <li>Learning-driven teams</li>
              <li>Opportunities to grow as a builder</li>
            </ul>
          </div>
        </div>

        <div className="hero-buttons contact-buttons">
          <a href="mailto:farhaabkhanff@gmail.com" className="btn btn-primary">
            Email Me
          </a>

          <a
            href="https://github.com/Far-200"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/farhaan-khan-dev"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
