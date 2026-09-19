import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  ACTIVE_BUILDS,
  LEARNING_FOCUS,
  LAB_UTILITIES,
} from "../data/labData";
import { sectionReveal, fadeOnly, useReducedMotion } from "../lib/motion";

function Reveal({ children, ...rest }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <Motion.section
      variants={prefersReducedMotion ? fadeOnly : sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      {...rest}
    >
      {children}
    </Motion.section>
  );
}

function LabPage() {
  return (
    <main className="page v4-lab-page">
      <header className="v4-lab-header section">
        <h1 className="v4-lab-title">Lab</h1>
        <p className="v4-lab-lede">
          Work in progress, experiments, and the things I&rsquo;m learning to
          build them properly. Finished work lives in{" "}
          <Link to="/work">Work</Link>; what changed and when is in the{" "}
          <Link to="/log">Build Log</Link>.
        </p>
      </header>

      <Reveal className="v4-lab-section section" aria-labelledby="lab-now">
        <h2 className="v4-lab-heading" id="lab-now">
          Currently building
        </h2>
        <ul className="v4-lab-builds">
          {ACTIVE_BUILDS.map((build) => (
            <li className="v4-lab-build" key={build.id}>
              <div className="v4-lab-build-head">
                <span className="v4-lab-stage">{build.stage}</span>
                <h3 className="v4-lab-build-name">{build.name}</h3>
              </div>
              <div className="v4-lab-build-body">
                <p className="v4-lab-build-summary">{build.summary}</p>
                <p className="v4-lab-build-focus">
                  <span>Focus</span> {build.focus}
                </p>
                <p className="v4-lab-tech">{build.tech.join(" · ")}</p>
                {build.github && (
                  <a
                    className="v4-lab-link"
                    href={build.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="v4-lab-section section" aria-labelledby="lab-learning">
        <h2 className="v4-lab-heading" id="lab-learning">
          Learning
        </h2>
        <div className="v4-lab-learning">
          {LEARNING_FOCUS.map((group) => (
            <div key={group.heading}>
              <h3 className="v4-lab-subheading">{group.heading}</h3>
              <ul className="v4-lab-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="v4-lab-section section" aria-labelledby="lab-also">
        <h2 className="v4-lab-heading" id="lab-also">
          Also built
        </h2>
        <ul className="v4-lab-utilities">
          {LAB_UTILITIES.map((item) => (
            <li className="v4-lab-utility" key={item.id}>
              <div>
                <h3 className="v4-lab-utility-title">{item.title}</h3>
                <p className="v4-lab-utility-summary">{item.summary}</p>
              </div>
              <div className="v4-lab-utility-links">
                {item.internalRoute && (
                  <Link to={item.internalRoute} className="v4-lab-link">
                    View project <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
                {item.github && (
                  <a
                    className="v4-lab-link"
                    href={item.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </main>
  );
}

export default LabPage;
