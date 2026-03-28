import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="footer-container">
        <div className="footer-brand">
          <h3>FK</h3>
          <p>Building practical projects and clean web experiences.</p>
        </div>

        <div className="footer-links-block">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-links-block">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="mailto:yourmail@example.com" aria-label="Email">
              <FaEnvelope />
            </a>
            <a
              href="https://github.com/Far-200"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/farhaan-khan-dev/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Farhaan Khan</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
