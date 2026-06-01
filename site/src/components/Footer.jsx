import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const SiDevfolio = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M11.91 0l7.39 4.265v8.528l-7.39 4.266-7.39-4.266V4.265L11.91 0zm0 2.274L6.684 5.291v6.033l5.226 3.016 5.226-3.016V5.291L11.91 2.274zM11.91 18.066l5.226-3.016v1.944l-5.226 3.017-5.226-3.017v-1.944l5.226 3.016z" />
  </svg>
);

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
            <a href="mailto:farhaabkhanff@gmail.com" aria-label="Email">
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
            <a
              href="https://devfolio.co/@Farhaan_2k5"
              target="_blank"
              rel="noreferrer"
              aria-label="Devfolio"
            >
              <SiDevfolio />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Farhaan Khan</p>
        <p className="footer-console">console.log(portfolio.isLive)</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
