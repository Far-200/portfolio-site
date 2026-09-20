import { motion as Motion } from "framer-motion";
import { DURATION, EASE, revealViewport } from "../../lib/motion";
import {
  FaGithub,
  FaReact,
  FaJsSquare,
  FaFileArchive,
  FaFolderOpen,
} from "react-icons/fa";
import { SiVite } from "react-icons/si";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getProjectBySlug } from "../../data/projects";

function FolderStructurePage({ embedded = false }) {
  const features = [
    "Paste or type folder structures manually with indentation support",
    "Generate clean project trees for different stack templates",
    "Supports common starter structures like React, Vite, Node, Express, and Tailwind setups",
    "Parses user input into structured folder and file hierarchies",
    "Exports the generated structure as a ZIP file",
    "Skips unnecessary folders like node_modules, dist, build, and coverage during export",
    "Simple visual workflow for planning projects before writing actual code",
  ];

  const stack = [
    { name: "React", icon: <FaReact /> },
    { name: "JavaScript", icon: <FaJsSquare /> },
    { name: "Vite", icon: <SiVite /> },
    { name: "ZIP Export", icon: <FaFileArchive /> },
    { name: "Folder Parsing Logic", icon: <FaFolderOpen /> },
  ];

  const learnings = [
    "Building logic that converts plain text indentation into a structured folder tree",
    "Handling dynamic nested data and recursive rendering in a clean way",
    "Exporting folder structures as downloadable ZIP files for real-world usability",
    "Designing a tool that solves an actual developer planning problem instead of being just another flashy UI",
  ];

  return (
    <section className="section project-detail-page v4-project">
      {!embedded && (
      <Motion.div
        className="project-detail-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
      >
        <p className="section-tag">Project Spotlight</p>
        <h1>Folder Structure Visualizer</h1>
        <p className="project-detail-subtext">
          A developer tool that turns typed or pasted folder layouts into a
          clean visual structure and lets users export the result as a ZIP-ready
          project scaffold.
        </p>

        <div className="hero-buttons project-detail-actions">
          <a
            href="https://github.com/Far-200/folder-structure-visualizer"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <FaGithub />
            <span>View Repository</span>
          </a>

          <a
            href="https://foldervisualiser.farhaankhan.dev"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            <FaExternalLinkAlt />
            <span>Live Demo ↗</span>
          </a>

          <Link to="/work" className="btn btn-secondary">
            Back to Work
          </Link>
        </div>
      </Motion.div>)}

      <Motion.div
        className="project-section-block glass-card project-gallery-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Project Demo</h2>
        <p className="project-gallery-subtext">See the tool in action.</p>

        <div className="project-video-wrap">
          <video
            src="/videos/fsv-demo.mp4"
            poster={getProjectBySlug("folder-structure-visualizer").media.src}
            aria-label="Folder Structure Visualizer demonstration"
            muted
            playsInline
            preload="none"
            controls
            className="project-demo-video"
          />
        </div>
      </Motion.div>

      <div className="project-detail-grid">
        <Motion.div
          className="project-detail-main glass-card"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          viewport={revealViewport}
        >
          <h2>Overview</h2>
          <p>
            Folder Structure Visualizer helps developers quickly plan project
            layouts without manually creating every folder and file from
            scratch. Users can type a structure themselves or work from a basic
            scaffold idea, and the app turns that into a readable visual tree.
          </p>

          <p>
            The project focuses on developer workflow speed. Instead of wasting
            time making folders one by one like a sleep-deprived file clerk, the
            tool helps users sketch a project structure fast and export it in a
            way that is actually useful.
          </p>
        </Motion.div>

        <Motion.div
          className="project-detail-side glass-card"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE, delay: 0.08 }}
          viewport={revealViewport}
        >
          <h2>Tech Stack</h2>

          <div className="project-stack-list">
            {stack.map((item) => (
              <div className="project-stack-item" key={item.name}>
                <span className="project-stack-icon">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </Motion.div>
      </div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Key Features</h2>
        <div className="project-feature-grid">
          {features.map((feature) => (
            <div className="project-feature-card" key={feature}>
              {feature}
            </div>
          ))}
        </div>
      </Motion.div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>What I Learned</h2>
        <ul className="project-learnings">
          {learnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Motion.div>

      <Motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Next Improvements</h2>
        <p>
          Strong future upgrades would include live tree editing, more preset
          templates, drag-and-drop node management, custom starter kits, and a
          downloadable config system for different frameworks and languages.
        </p>
      </Motion.div>
    </section>
  );
}

export default FolderStructurePage;
