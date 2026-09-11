import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import profileImage from "../assets/profile.jpg";
import {
  staggerContainer,
  staggerItem,
  fadeOnly,
  useReducedMotion,
} from "../lib/motion";

const GITHUB_URL = "https://github.com/Far-200";

// Hero-only — labData's ACTIVE_BUILDS and projects.js both model
// finished/ongoing project identity, not this present-tense status
// strip, so it stays a local constant rather than being derived.
const CURRENTLY_BUILDING = "Think Before Code · Attendance Analytics · site-3d";

function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const container = prefersReducedMotion ? fadeOnly : staggerContainer;
  const item = prefersReducedMotion ? fadeOnly : staggerItem;

  return (
    <section className="v4-hero section">
      <motion.div
        className="v4-hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className="v4-hero-identity" variants={item}>
          Farhaan Khan
        </motion.p>

        <motion.h1 className="v4-hero-headline" variants={item}>
          I build things, then figure out why they broke.
        </motion.h1>

        <motion.p className="v4-hero-supporting" variants={item}>
          CSE student building developer tools, full-stack applications, and
          AI-assisted systems.
        </motion.p>

        <motion.div className="v4-hero-ctas" variants={item}>
          <Link to="/#work" className="v4-hero-cta-primary">
            View selected work
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="v4-hero-cta-secondary"
          >
            GitHub ↗
          </a>
        </motion.div>

        <motion.div className="v4-hero-building" variants={item}>
          <span className="v4-hero-building-label">Currently building</span>
          <span className="v4-hero-building-value">{CURRENTLY_BUILDING}</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="v4-hero-portrait"
        variants={prefersReducedMotion ? fadeOnly : staggerItem}
        initial="hidden"
        animate="show"
      >
        <img
          src={profileImage}
          alt="Farhaan Khan portrait"
          className="v4-hero-portrait-img"
        />
      </motion.div>
    </section>
  );
}

export default Hero;
