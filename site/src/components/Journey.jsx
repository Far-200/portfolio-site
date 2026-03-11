import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaRocket,
  FaBrain,
} from "react-icons/fa";

function Journey() {
  const journeyItems = [
    {
      icon: <FaGraduationCap />,
      title: "CSE Student",
      text: "I’m currently studying Computer Science and building my skills through practical development, consistent learning, and hands-on projects.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Project-First Learning",
      text: "I learn best by building. Instead of just collecting tutorials, I turn ideas into working projects to improve design sense, logic, and coding confidence.",
    },
    {
      icon: <FaBrain />,
      title: "Current Focus",
      text: "Right now I’m sharpening my frontend, full-stack, and problem-solving skills while exploring AI-powered systems, developer tools, and cleaner UI design.",
    },
    {
      icon: <FaRocket />,
      title: "Internship Goal",
      text: "My goal is to become internship-ready with a stronger portfolio, better technical depth, and real projects that show I can build and ship useful things.",
    },
  ];

  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="section-tag">Education & growth</p>
        <h2>My Journey</h2>
        <p>
          A quick snapshot of where I am, how I learn, and what I’m working
          toward as I grow into a stronger developer.
        </p>
      </motion.div>

      <div className="journey-grid">
        {journeyItems.map((item, index) => (
          <motion.div
            key={item.title}
            className="journey-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
          >
            <div className="journey-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Journey;
