import { motion as Motion } from "framer-motion";
import SocialProfileLink from "./SocialProfileLink";
import githubProfile from "../assets/github_pfp.jpg";
import twitterProfile from "../assets/twitter_profile.jpg";

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
      <Motion.div
        className="contact-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Motion.p className="contact-tag" variants={row}>
          Open to internships & roles · collaborations · cool ideas
        </Motion.p>
        <Motion.h2 variants={row}>Let's Connect</Motion.h2>
        <Motion.p variants={row}>
          Whether it's internships, collaborations, interesting ideas, or simply
          talking about web development, UI, AI, or project-building, I'm always
          happy to connect.
        </Motion.p>

        <Motion.div className="contact-grid" variants={row}>
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
        </Motion.div>

        <Motion.div className="contact-buttons" variants={row}>
          <a
            href="mailto:hello.farhaankhan@gmail.com"
            className="btn btn-primary"
          >
            Email Me
          </a>
          <SocialProfileLink
            href="https://github.com/Far-200"
            label="GitHub"
            handle="@Far-200"
            profileName="Far-200"
            profileImage={githubProfile}
            className="contact-social-link"
          >
            <span className="btn btn-secondary">GitHub</span>
          </SocialProfileLink>
          <SocialProfileLink
            href="https://www.linkedin.com/in/farhaan-khan-dev/"
            label="LinkedIn"
            handle="farhaan-khan-dev"
            profileName="Farhaan Khan"
            className="contact-social-link"
          >
            <span className="btn btn-secondary">LinkedIn</span>
          </SocialProfileLink>
          <SocialProfileLink
            href="https://x.com/PotatoBuiltThis"
            label="X / Twitter"
            handle="@PotatoBuiltThis"
            profileName="SaucyPotato"
            profileImage={twitterProfile}
            className="contact-social-link"
          >
            <span className="btn btn-secondary">X / Twitter</span>
          </SocialProfileLink>
          <a
            href="https://devfolio.co/@Farhaan_2k5"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Devfolio
          </a>
        </Motion.div>
      </Motion.div>
    </section>
  );
}

export default Contact;
