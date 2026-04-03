import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import folderVisualizerPreview from "../../assets/folder-visualiser-preview.png";
import folderVisualizerSearch from "../../assets/folder-visualiser-search.png";
import folderVisualizerPlacement from "../../assets/folder-visualiser-placement.png";

function FolderStructurePage() {
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

  const screenshots = [
    {
      image: folderVisualizerPreview,
      title: "Main Interface",
      description:
        "The primary workspace for building and previewing folder structures.",
    },
    {
      image: folderVisualizerSearch,
      title: "Smart Search & Highlight",
      description:
        "Search across deeply nested files and highlight matching results instantly.",
    },
    {
      image: folderVisualizerPlacement,
      title: "Scaffold Presets & Placement",
      description:
        "Generate starter structures and place them exactly where you want.",
    },
  ];

  const [selectedShot, setSelectedShot] = useState(null);

  return (
    <section className="section project-detail-page">
      <motion.div
        className="project-detail-hero"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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

          <Link to="/projects" className="btn btn-secondary">
            Back to Projects
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="project-section-block glass-card project-gallery-block"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Project Gallery</h2>
        <p className="project-gallery-subtext">
          A closer look at the tool in action.
        </p>

        <div className="project-gallery-tiles">
          {screenshots.map((shot, index) => (
            <motion.button
              key={shot.title}
              type="button"
              className="project-gallery-tile"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedShot(shot)}
            >
              <div className="project-gallery-tile-image-wrap">
                <img
                  src={shot.image}
                  alt={shot.title}
                  className="project-gallery-tile-image"
                />
                <h3 className="tile-title">{shot.title}</h3>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedShot && (
          <motion.div
            className="project-gallery-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedShot(null)}
          >
            <motion.div
              className="project-gallery-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="project-gallery-modal-close"
                onClick={() => setSelectedShot(null)}
                aria-label="Close preview"
              >
                ×
              </button>

              <div className="project-gallery-modal-image-wrap">
                <img
                  src={selectedShot.image}
                  alt={selectedShot.title}
                  className="project-gallery-modal-image"
                />
              </div>

              <div className="project-gallery-modal-content">
                <h3>{selectedShot.title}</h3>
                <p>{selectedShot.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="project-detail-grid">
        <motion.div
          className="project-detail-main glass-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
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
        </motion.div>

        <motion.div
          className="project-detail-side glass-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          viewport={{ once: true }}
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
        </motion.div>
      </div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Key Features</h2>
        <div className="project-feature-grid">
          {features.map((feature) => (
            <div className="project-feature-card" key={feature}>
              {feature}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>What I Learned</h2>
        <ul className="project-learnings">
          {learnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="project-section-block glass-card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <h2>Next Improvements</h2>
        <p>
          Strong future upgrades would include live tree editing, more preset
          templates, drag-and-drop node management, custom starter kits, and a
          downloadable config system for different frameworks and languages.
        </p>
      </motion.div>
    </section>
  );
}

export default FolderStructurePage;
