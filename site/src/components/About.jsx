import { motion as Motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useResumeChooser } from "./ResumeChooser";
import {
  fadeOnly,
  sectionReveal,
  revealViewport,
  useReducedMotion,
} from "../lib/motion";

const BUILD_AREAS = [
  {
    title: "Developer tools",
    description:
      "Focused utilities that make technical workflows easier to understand and use.",
  },
  {
    title: "Full-stack applications",
    description:
      "Interfaces backed by real data, APIs, and end-to-end product thinking.",
  },
  {
    title: "AI-assisted systems",
    description:
      "Learning and productivity tools where AI supports reasoning instead of replacing it.",
  },
];

const PROCESS = ["Understand", "Build", "Break", "Debug", "Ship", "Document"];

const WORKING_WITH = [
  { label: "Languages", value: "JavaScript, Python, C/C++" },
  { label: "Frontend", value: "React, HTML, CSS, Tailwind" },
  { label: "Backend", value: "Node.js" },
  { label: "Tooling", value: "Git, GitHub, VS Code" },
];

const STRENGTHENING = [
  { label: "Backend APIs", value: "FastAPI" },
  { label: "Data", value: "SQL" },
  { label: "Infrastructure", value: "Docker" },
];

const CURRENT_FOCUS = [
  {
    label: "Backend",
    value: "API boundaries, data models, and stronger full-stack foundations",
  },
  {
    label: "Problem solving",
    value: "C/C++ fundamentals and deliberate reasoning before implementation",
  },
  {
    label: "Practice",
    value: "Shipping smaller tools and documenting what each build teaches me",
  },
];

function Reveal({ className, children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Motion.div
      className={className}
      variants={prefersReducedMotion ? fadeOnly : sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      {children}
    </Motion.div>
  );
}

function About() {
  const { open: openResume } = useResumeChooser();
  return (
    <>
      <section
        className="v4-about-section v4-about-intro section"
        aria-labelledby="about-title"
      >
        <Reveal className="v4-about-intro-inner">
          <p className="v4-about-eyebrow">About</p>
          <h1 className="v4-about-title" id="about-title">
            I build useful software, then learn from what breaks.
          </h1>

          <div className="v4-about-intro-copy">
            <p>
              I&apos;m Farhaan Khan, a Computer Science student focused on
              developer tools, full-stack applications, and AI-assisted
              systems where interface decisions and underlying logic both
              matter.
            </p>
            <p>
              I learn best by building. I start with a problem, make a working
              version, and use the bugs, constraints, and unanswered questions
              to decide what to learn next.
            </p>
          </div>
        </Reveal>
      </section>

      <section
        className="v4-about-section v4-about-practice section"
        aria-label="What I build and how I work"
      >
        <Reveal className="v4-about-practice-inner">
          <article className="v4-about-practice-column">
            <p className="v4-about-section-label">Practice</p>
            <h2 className="v4-about-section-heading">What I build</h2>
            <dl className="v4-about-build-list">
              {BUILD_AREAS.map((area) => (
                <div className="v4-about-build-row" key={area.title}>
                  <dt>{area.title}</dt>
                  <dd>{area.description}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="v4-about-practice-column v4-about-process-column">
            <p className="v4-about-section-label">Process</p>
            <h2 className="v4-about-section-heading">How I work</h2>
            <ol className="v4-about-process-list">
              {PROCESS.map((step, index) => (
                <li key={step}>
                  <span className="v4-about-process-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </Reveal>
      </section>

      <section
        className="v4-about-section v4-about-toolkit section"
        id="toolkit"
        aria-labelledby="toolkit-title"
      >
        <Reveal className="v4-about-toolkit-inner">
          <header className="v4-about-section-header">
            <div>
              <p className="v4-about-section-label">Toolkit</p>
              <h2 className="v4-about-section-heading" id="toolkit-title">
                Tools I use to make things real
              </h2>
            </div>
            <p className="v4-about-section-intro">
              A practical stack shaped by projects, with a clear distinction
              between tools I already use and areas I am developing more
              deeply.
            </p>
          </header>

          <div className="v4-about-toolkit-levels">
            <section aria-labelledby="working-with-title">
              <h3 className="v4-about-toolkit-level" id="working-with-title">
                Working with
              </h3>
              <dl className="v4-about-toolkit-list">
                {WORKING_WITH.map((group) => (
                  <div className="v4-about-toolkit-row" key={group.label}>
                    <dt>{group.label}</dt>
                    <dd>{group.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="strengthening-title">
              <h3 className="v4-about-toolkit-level" id="strengthening-title">
                Currently learning / strengthening
              </h3>
              <dl className="v4-about-toolkit-list">
                {STRENGTHENING.map((group) => (
                  <div className="v4-about-toolkit-row" key={group.label}>
                    <dt>{group.label}</dt>
                    <dd>{group.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </Reveal>
      </section>

      <section
        className="v4-about-section v4-about-now section"
        aria-labelledby="now-title"
      >
        <Reveal className="v4-about-split-inner">
          <header>
            <p className="v4-about-section-label">Current focus</p>
            <h2 className="v4-about-section-heading" id="now-title">
              Now
            </h2>
          </header>

          <div>
            <p className="v4-about-now-copy">
              I&apos;m strengthening the parts of engineering that turn a good
              interface into a complete, maintainable system.
            </p>
            <dl className="v4-about-now-list">
              {CURRENT_FOCUS.map((item) => (
                <div className="v4-about-now-row" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section
        className="v4-about-section v4-about-contact section"
        id="contact"
        aria-labelledby="contact-title"
      >
        <Reveal className="v4-about-split-inner v4-about-contact-inner">
          <header>
            <p className="v4-about-section-label">Contact</p>
            <h2 className="v4-about-section-heading" id="contact-title">
              Start a conversation
            </h2>
          </header>

          <div>
            <p className="v4-about-contact-copy">
              I&apos;m open to internships, thoughtful collaborations, and
              conversations about developer tools, full-stack work, and
              learning-focused software.
            </p>
            <div className="v4-about-contact-links">
              <a href="mailto:hello.farhaankhan@gmail.com">
                <span>Email</span>
                <span>
                  hello.farhaankhan@gmail.com
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </a>
              <a
                href="https://github.com/Far-200"
                target="_blank"
                rel="noreferrer"
              >
                <span>GitHub</span>
                <span>
                  @Far-200
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/farhaan-khan-dev/"
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <span>
                  farhaan-khan-dev
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </a>
              <button type="button" onClick={openResume}>
                <span>Resume</span>
                <span>
                  ATS or Visual PDF
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default About;
