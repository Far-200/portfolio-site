import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

function Projects() {
  const projects = [
    {
      title: "Cortex AI Assistant",
      desc: "A full-stack AI chatbot built with React and Express, featuring markdown rendering, code-friendly responses, and smart follow-up interactions.",
      tech: ["React", "Express", "Node.js", "Gemini API"],
      route: "/projects/cortex-ai",
      github: "https://github.com/Far-200/cortex-ai-assistant",
    },
    {
      title: "Password Strength & Crack Time Estimator",
      desc: "A security-focused tool that evaluates password strength and estimates crack time using entropy-based logic.",
      tech: ["React", "JavaScript", "CSS"],
      route: "/projects/password-estimator",
      github:
        "https://github.com/Far-200/Password-Strength-Crack-Time-Estimator",
    },
    {
      title: "Developer JSON Formatter Tool",
      desc: "A clean utility for formatting, validating, minifying, and testing JSON and API responses for developer workflows.",
      tech: ["React", "JavaScript", "CSS", "API Testing"],
      route: "/projects/devtool",
      github: "https://github.com/Far-200/DevTool",
    },
    {
      title: "Data Leak Prevention System",
      desc: "A security-focused system designed to detect and prevent sensitive information leaks using monitoring and rule-based detection logic.",
      tech: ["Python", "Security", "Monitoring"],
      route: "/projects/dlp",
      github: "https://github.com/Far-200/DLP",
    },
  ];

  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>Featured Projects</h2>
        <p>A few things I’ve built instead of resting like a normal human.</p>
      </motion.div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            className="project-card"
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <h3>{project.title}</h3>
            <p>{project.desc}</p>

            <div className="chip-wrap">
              {project.tech.map((tech) => (
                <span className="chip chip-purple" key={tech}>
                  {tech}
                </span>
              ))}
            </div>

            <div
              className="hero-buttons project-actions"
              style={{ marginTop: "1rem" }}
            >
              {project.route && (
                <Link to={project.route} className="project-link">
                  View Project →
                </Link>
              )}

              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="project-link github-link"
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github size={18} strokeWidth={2.2} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
