import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const row = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function Contact() {
  return (
    <section className="section contact-wrap">
      <motion.div
        className="contact-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.p className="contact-tag" variants={row}>
          Open to internships & roles · collaborations · cool ideas
        </motion.p>
        <motion.h2 variants={row}>Let's Connect</motion.h2>
        <motion.p variants={row}>
          Whether it's internships, collaborations, interesting ideas, or simply
          talking about web development, UI, AI, or project-building, I'm always
          happy to connect.
        </motion.p>

        <motion.div className="contact-grid" variants={row}>
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
        </motion.div>

        <motion.div className="contact-buttons" variants={row}>
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
          <a
            href="https://devfolio.co/@Farhaan_2k5"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Devfolio
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Contact;
