import { motion } from "framer-motion";
import {
  FaPython, FaJs, FaReact, FaHtml5, FaCss3Alt,
  FaNodeJs, FaGitAlt, FaGithub, FaDocker,
} from "react-icons/fa";
import { VscCode } from "react-icons/vsc";
import { SiCplusplus, SiFastapi, SiTailwindcss, SiMysql } from "react-icons/si";

const skillGroups = [
  {
    title: "Languages",
    items: [
      { name: "Python",     icon: <FaPython /> },
      { name: "JavaScript", icon: <FaJs /> },
      { name: "C/C++",      icon: <SiCplusplus /> },
      { name: "SQL",        icon: <SiMysql /> },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React",    icon: <FaReact /> },
      { name: "HTML",     icon: <FaHtml5 /> },
      { name: "CSS",      icon: <FaCss3Alt /> },
      { name: "Tailwind", icon: <SiTailwindcss /> },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "FastAPI", icon: <SiFastapi /> },
      { name: "Node.js", icon: <FaNodeJs /> },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git",    icon: <FaGitAlt /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "VS Code",icon: <VscCode /> },
      { name: "Docker", icon: <FaDocker /> },
    ],
  },
];

function Skills() {
  return (
    <section className="section skills-section-compact">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Stack</p>
        <h2>Skills & Tech Stack</h2>
        <p>
          The tools, languages, and frameworks I use to build projects that
          actually do stuff instead of just looking emotional.
        </p>
      </motion.div>

      <div className="skills-grid">
        {skillGroups.map((group, index) => (
          <motion.div
            className="glass-card skill-card"
            key={group.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h3>{group.title}</h3>
            <div className="skill-logo-grid">
              {group.items.map((item) => (
                <div className="skill-logo-item" key={item.name}>
                  <div className="skill-icon">{item.icon}</div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
