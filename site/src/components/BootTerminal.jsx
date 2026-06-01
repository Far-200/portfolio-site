import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// First line is typed character-by-character.
// Remaining lines slide in sequentially.
const FIRST_LINE = "farhaan@portfolio:~$ sudo apt install weirdly-useful-tools";

const BOOT_LINES = [
  { text: "[sudo] password accepted", delay: 520, style: "muted" },
  { text: "installing devtools...", delay: 900, style: "muted" },
  { text: "building portfolio-v3...", delay: 1200, style: "muted" },
  { text: "running npm run build", delay: 1480, style: "muted" },
  { text: "✓ build complete", delay: 1900, style: "success" },
  { text: "opening /home/farhaan/portfolio", delay: 2180, style: "muted" },
  { text: "launching interface...", delay: 2460, style: "muted" },
];

const DONE_AT = 2950; // ms before fade starts
const FADE_MS = 380; // matches CSS transition

// Typing speed for the first command line
const TYPE_INTERVAL = 38; // ms per character

function BootTerminal({ onDone }) {
  const [typed, setTyped] = useState(""); // first line typed chars
  const [typingDone, setTypingDone] = useState(false); // first line finished
  const [visibleCount, setVisibleCount] = useState(0); // how many BOOT_LINES shown
  const [exiting, setExiting] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }

    // ── Phase 1: type the first command character by character ──
    let charIndex = 0;
    const typeNext = () => {
      charIndex += 1;
      setTyped(FIRST_LINE.slice(0, charIndex));
      if (charIndex < FIRST_LINE.length) {
        const t = setTimeout(typeNext, TYPE_INTERVAL);
        timersRef.current.push(t);
      } else {
        setTypingDone(true);
      }
    };
    const startType = setTimeout(typeNext, 120);
    timersRef.current.push(startType);

    // ── Phase 2: reveal remaining lines on schedule ──
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
      }, line.delay);
      timersRef.current.push(t);
    });

    // ── Phase 3: fade out, then unmount ──
    const exitT = setTimeout(() => setExiting(true), DONE_AT);
    const doneT = setTimeout(() => onDone(), DONE_AT + FADE_MS);
    timersRef.current.push(exitT, doneT);

    return () => timersRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor shows on last active line
  const showCursorOnCmd = !typingDone;
  const showCursorOnLast =
    typingDone && visibleCount < BOOT_LINES.length && !exiting;
  const lastVisible = visibleCount - 1;

  return (
    <div
      className={`boot-overlay${exiting ? " boot-overlay--exit" : ""}`}
      aria-hidden="true"
    >
      {/* Terminal window card — visually matches DeveloperTerminal */}
      <div className="boot-window">
        {/* Title bar */}
        <div className="boot-window-bar">
          <span className="dev-terminal-dot dev-terminal-dot--red" />
          <span className="dev-terminal-dot dev-terminal-dot--yellow" />
          <span className="dev-terminal-dot dev-terminal-dot--green" />
          <span className="boot-window-title">farhaan@portfolio — boot</span>
        </div>

        {/* Output body */}
        <div className="boot-window-body">
          {/* First line — typewriter */}
          <p className="boot-line boot-line--cmd">
            {typed}
            {showCursorOnCmd && (
              <span className="boot-cursor" aria-hidden="true">
                ▋
              </span>
            )}
          </p>

          {/* Remaining lines — slide in one by one */}
          {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
            <motion.p
              key={i}
              className={`boot-line${
                line.style === "success" ? " boot-line--success" : ""
              }${line.style === "muted" ? " boot-line--muted" : ""}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {line.text}
              {showCursorOnLast && i === lastVisible && (
                <span className="boot-cursor" aria-hidden="true">
                  ▋
                </span>
              )}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Skip button — bottom-right, always on top */}
      <button
        className="boot-skip"
        onClick={() => {
          timersRef.current.forEach(clearTimeout);
          onDone();
        }}
      >
        skip
      </button>
    </div>
  );
}

export default BootTerminal;
