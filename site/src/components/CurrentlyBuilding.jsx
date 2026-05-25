import { motion } from "framer-motion";

const items = [
  {
    title: "Portfolio Website",
    text: "Designing a clean developer portfolio with modern UI, routing, animations, and better project storytelling.",
  },
  {
    title: "Small Projects Sprint",
    text: "Building project after project to improve frontend confidence, consistency, and real-world development flow.",
  },
  {
    title: "Full-Stack + AI Growth",
    text: "Exploring React, FastAPI, developer tools, and AI/security-inspired projects to become placement and internship ready.",
  },
];

function CurrentlyBuilding() {
  return (
    <section className="section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <p className="section-tag">What I'm building now</p>
        <h2>Currently Building</h2>
        <p>
          A quick look at what I'm focused on right now as I keep improving
          through projects, design, and hands-on development.
        </p>
      </motion.div>

      <div className="building-grid">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            className="building-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <p className="building-card-num">{String(index + 1).padStart(2, "0")}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CurrentlyBuilding;
