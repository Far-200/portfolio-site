import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Boot sequence lines — each has the text and delay (ms) before it appears
const BOOT_LINES = [
  {
    text: "farhaan@portfolio:~$ sudo apt install weirdly-useful-tools",
    delay: 0,
  },
  { text: "[sudo] password accepted", delay: 420 },
  { text: "installing devtools...", delay: 780 },
  { text: "building portfolio-v3...", delay: 1100 },
  { text: "running npm run build", delay: 1380 },
  { text: "✓ build complete", delay: 1820 },
  { text: "opening /home/farhaan/portfolio", delay: 2100 },
  { text: "launching interface...", delay: 2420 },
];

// Total duration before fade-out begins (ms)
const DONE_AT = 2900;
// Fade-out duration matches CSS transition
const FADE_MS = 400;

function BootTerminal({ onDone }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip immediately
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      onDone();
      return;
    }

    // Schedule each line appearance
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
      }, line.delay);
      timersRef.current.push(t);
    });

    // Schedule fade-out
    const exitTimer = setTimeout(() => setExiting(true), DONE_AT);
    timersRef.current.push(exitTimer);

    // After fade completes, call onDone
    const doneTimer = setTimeout(() => onDone(), DONE_AT + FADE_MS);
    timersRef.current.push(doneTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className={`boot-overlay${exiting ? " boot-overlay--exit" : ""}`}
      aria-hidden="true"
    >
      <div className="boot-terminal">
        {/* Lines revealed one-by-one */}
        {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
          <motion.p
            key={i}
            className={`boot-line${line.text.startsWith("✓") ? " boot-line--success" : ""}${line.text.startsWith("[sudo]") || line.text.startsWith("installing") || line.text.startsWith("building") || line.text.startsWith("running") || line.text.startsWith("opening") || line.text.startsWith("launching") ? " boot-line--muted" : ""}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {line.text}
            {/* Show blinking cursor only on the last visible line */}
            {i === visibleCount - 1 && !exiting && (
              <span className="boot-cursor" aria-hidden="true">
                ▋
              </span>
            )}
          </motion.p>
        ))}
      </div>

      {/* Skip button */}
      <button
        className="boot-skip"
        onClick={() => {
          timersRef.current.forEach(clearTimeout);
          onDone();
        }}
      >
        skip
      </button>
    </motion.div>
  );
}

export default BootTerminal;
