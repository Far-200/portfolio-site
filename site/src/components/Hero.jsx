import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";

function Hero() {
  return (
    <section className="hero section">
      <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="badge">CSE Student • Full-Stack Builder • AI Explorer</p>

        <h1>
          Building projects
          <span>that feel real</span>
        </h1>

        <p className="hero-text">
          Hi, I'm Farhaan Khan. I build clean web apps, developer tools, and
          AI-flavored systems while surviving engineering like it’s a boss fight
          with zero save points.
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
            <p>Featured Projects</p>
          </div>
          <div className="hero-stat-card">
            <h3>Full-Stack</h3>
            <p>React • FastAPI • UI</p>
          </div>
          <div className="hero-stat-card">
            <h3>AI + Security</h3>
            <p>Builder mindset</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div className="hero-photo-card" whileHover={{ y: -6 }}>
          <img
            src={profileImage}
            alt="Farhaan Khan portrait"
            className="hero-photo"
          />
          <div className="hero-status">Open to Internships</div>
        </motion.div>

        <a
          href="/resume/Farhaan_Khan_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="resume-cta"
        >
          View Resume
        </a>
      </motion.div>
    </section>
  );
}

export default Hero;
