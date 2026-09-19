import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { CURRENTLY_BUILDING } from "../data/labData";
import profileImage from "../assets/profile.jpg";
import {
  staggerContainer,
  staggerItem,
  fadeOnly,
  useReducedMotion,
} from "../lib/motion";

const GITHUB_URL = "https://github.com/Far-200";

function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const container = prefersReducedMotion ? fadeOnly : staggerContainer;
  const item = prefersReducedMotion ? fadeOnly : staggerItem;

  return (
    <section className="v4-hero section">
      <Motion.div
        className="v4-hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Motion.p className="v4-hero-identity" variants={item}>
          Farhaan Khan
        </Motion.p>

        <Motion.h1 className="v4-hero-headline" variants={item}>
          I build things, then figure out why they broke.
        </Motion.h1>

        <Motion.p className="v4-hero-supporting" variants={item}>
          CSE student building developer tools, full-stack applications, and
          AI-assisted systems.
        </Motion.p>

        <Motion.div className="v4-hero-ctas" variants={item}>
          <Link to="/work" className="v4-hero-cta-primary">
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
        </Motion.div>

        <Motion.div className="v4-hero-building" variants={item}>
          <span className="v4-hero-building-label">Currently building</span>
          <span className="v4-hero-building-value">{CURRENTLY_BUILDING}</span>
        </Motion.div>
      </Motion.div>

      <Motion.div
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
      </Motion.div>
    </section>
  );
}

export default Hero;
