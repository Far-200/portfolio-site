import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
});

function Hero() {
  return (
    <section className="hero section">
      <motion.div className="hero-left" {...fadeUp(0)}>
        <p className="badge">Building wierdly useful softwares since 2023</p>

        <h1>
          Building tools
          <span>developers actually use</span>
        </h1>

        <p className="hero-text">
          Building developer tools, full-stack apps, and AI-assisted systems
          that people might actually use instead of abandoning after the GitHub
          push.
        </p>

        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link to="/skills" className="btn btn-secondary">
            Skills
          </Link>
          <a
            href="https://github.com/Far-200"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat-card">
            <h3>4+</h3>
            <p>Deployed Projects</p>
          </div>
          <div className="hero-stat-card">
            <h3>Full-Stack</h3>
            <p>React · Node · APIs</p>
          </div>
          <div className="hero-stat-card">
            <h3>AI + Tools</h3>
            <p>Practical systems</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="hero-right" {...fadeUp(0.14)}>
        <div className="hero-photo-card">
          <img
            src={profileImage}
            alt="Farhaan Khan portrait"
            className="hero-photo"
          />
          <div className="hero-status">Open to Internships &amp; Roles</div>
        </div>

        <a
          href="/resume/Farhaan_Khan_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="resume-cta"
        >
          View Resume ↗
        </a>

        <div className="github-card">
          <div className="github-card-top">
            <span>GitHub Activity</span>
            <a
              href="https://github.com/Far-200"
              target="_blank"
              rel="noreferrer"
            >
              Far-200 ↗
            </a>
          </div>
          <img
            src="https://ghchart.rshah.org/10b981/Far-200"
            alt="Farhaan Khan GitHub contributions"
            className="github-heatmap"
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
