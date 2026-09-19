import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mediaHover } from "../lib/motion";

// Right-hand visual for each flagship entry in Selected Work. Every
// project here is HTML/CSS only — no fake screenshots, no SVG, no
// canvas. Which diagram renders is a small, closed branch on project
// id (three known flagships, not a generic framework); real media
// (currently only Folder Structure Visualizer) always takes priority
// over a diagram when project.media is set.

const SOCRATIC_STEPS = [
  "decode the problem",
  "explain your reasoning",
  "receive a hint",
  "implement",
];

function SocraticLoopVisual() {
  return (
    <div className="v4-work-diagram">
      <p className="v4-work-visual-tag">Socratic Loop</p>
      <ol className="v4-work-loop">
        {SOCRATIC_STEPS.map((step, i) => (
          <li className="v4-work-loop-step" key={step}>
            <span className="v4-work-loop-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="v4-work-loop-text">{step}</span>
          </li>
        ))}
      </ol>
      <p className="v4-work-visual-footer">answer withheld until needed</p>
    </div>
  );
}

function FlowTraceVisual() {
  return (
    <div className="v4-work-diagram">
      <p className="v4-work-visual-tag">Execution Pipeline</p>

      <div className="v4-work-code-group">
        <p className="v4-work-code-label">source</p>
        <pre className="v4-work-code">{"int x = 2;\nx = x + 3;"}</pre>
      </div>

      <p className="v4-work-pipeline-step">↓ parse</p>

      <div className="v4-work-code-group">
        <p className="v4-work-code-label">ast</p>
        <pre className="v4-work-code">
          {"Assignment\n  Identifier: x\n  BinaryExpression"}
        </pre>
      </div>

      <p className="v4-work-pipeline-step">↓ execute</p>

      <div className="v4-work-code-group">
        <p className="v4-work-code-label">state</p>
        <pre className="v4-work-code">{"x: 2 → 5"}</pre>
      </div>
    </div>
  );
}

function ScreenshotVisual({ project, prefersReducedMotion }) {
  const ImageWrap = project.internalRoute ? Link : "div";
  const wrapProps = project.internalRoute
    ? {
        to: project.internalRoute,
        "aria-label": `View case study — ${project.title}`,
      }
    : {};

  return (
    <div className="v4-work-screenshot">
      <ImageWrap className="v4-work-screenshot-frame" {...wrapProps}>
        <motion.img
          src={project.media.src}
          alt={project.media.alt}
          loading="lazy"
          decoding="async"
          width={1600}
          height={1000}
          whileHover={prefersReducedMotion ? undefined : mediaHover}
        />
      </ImageWrap>
      <p className="v4-work-visual-caption">ASCII tree → project scaffold</p>
    </div>
  );
}

function ProjectVisual({ project, prefersReducedMotion }) {
  if (project.media) {
    return (
      <div className="v4-work-visual-frame v4-work-visual-frame--media">
        <ScreenshotVisual
          project={project}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    );
  }

  return (
    <div className="v4-work-visual-frame">
      {project.id === "think-before-code" && <SocraticLoopVisual />}
      {project.id === "flowtrace" && <FlowTraceVisual />}
    </div>
  );
}

export default ProjectVisual;
