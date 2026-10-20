import { FaGithub, FaEnvelope } from "react-icons/fa";
import { motion as Motion } from "framer-motion";
import SocialProfileLink from "./SocialProfileLink";
import githubProfile from "../assets/github_pfp.jpg";
import twitterProfile from "../assets/twitter_profile.jpg";
import {
  sectionReveal,
  fadeOnly,
  revealViewport,
  useReducedMotion,
} from "../lib/motion";

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="6.4" cy="6.1" r="1.15" />
    <path d="M6.4 10.1v7.9" />
    <path d="M10.6 18v-7.9m0 3c0-2.4 1.9-3.6 3.7-3.6 1.9 0 3.5 1.2 3.5 3.7V18" />
  </svg>
);

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
  const prefersReducedMotion = useReducedMotion();

  return (
    <Motion.footer
      className="footer"
      variants={prefersReducedMotion ? fadeOnly : sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      <div className="footer-container">
        <div className="footer-brand">
          <h3>FK</h3>
          <p>Building practical projects and clean web experiences.</p>
        </div>

        <div className="footer-links-block">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="mailto:hello.farhaankhan@gmail.com" aria-label="Email">
              <FaEnvelope />
            </a>
            <SocialProfileLink
              href="https://github.com/Far-200"
              label="GitHub"
              handle="@Far-200"
              profileName="Far-200"
              profileImage={githubProfile}
              ariaLabel="GitHub"
            >
              <FaGithub />
            </SocialProfileLink>
            <SocialProfileLink
              href="https://www.linkedin.com/in/farhaan-khan-dev/"
              label="LinkedIn"
              handle="farhaan-khan-dev"
              profileName="Farhaan Khan"
              ariaLabel="LinkedIn"
            >
              <LinkedInIcon />
            </SocialProfileLink>
            <SocialProfileLink
              href="https://x.com/PotatoBuiltThis"
              label="X / Twitter"
              handle="@PotatoBuiltThis"
              profileName="SaucyPotato"
              profileImage={twitterProfile}
              ariaLabel="X / Twitter"
            >
              <XIcon />
            </SocialProfileLink>
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
    </Motion.footer>
  );
}

export default Footer;
