import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { CURRENTLY_BUILDING } from "../data/labData";
import profileImage from "../assets/profile.jpg";
import {
  staggerContainer,
  staggerItem,
  fadeOnly,
  useReducedMotion,
} from "../lib/motion";

const GITHUB_URL = "https://github.com/Far-200";

// The margin note that sits beside "broke". Change the copy here.
const HERO_NOTE = "// again.";

// "broke" is the one word in the headline that carries a private note.
// Hover or keyboard focus reveals it (CSS, see v4-hero.css). A click or
// tap pins it open, which is how touch gets it, and a pointer-down
// anywhere else lets it go again.
//
// The sentence stays intact for assistive tech: the note is aria-hidden
// (so it never becomes part of the heading's name) and is offered as the
// button's description instead. It is non-essential; nothing here is
// needed to understand the page.
function BrokeNote() {
  const [pinned, setPinned] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!pinned) return undefined;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setPinned(false);
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [pinned]);

  return (
    <span
      className="v4-hero-note-wrap"
      ref={wrapRef}
      data-pinned={pinned || undefined}
    >
      <button
        type="button"
        className="v4-hero-broke"
        aria-expanded={pinned}
        aria-describedby="hero-note"
        onClick={() => setPinned((open) => !open)}
      >
        broke
      </button>
      .
      <span className="v4-hero-note" id="hero-note" aria-hidden="true">
        {HERO_NOTE}
      </span>
    </span>
  );
}

// Margin notes for the portrait, shown one per visit and cycled in order.
const PORTRAIT_NOTES = [
  "// usually less serious",
  "// probably debugging something",
  "// yes, that's me",
  "// still building",
];

// Pointer must have been out for at least this long before the next note
// counts as a new visit, so a pointer sitting on the photo's edge can't
// flick through the list.
const NOTE_REENTRY_MS = 250;

// The photo plus its note. The note is decorative and hover-only: the
// image is not made focusable (that would be a fake button for a joke),
// the note is aria-hidden, and on touch / coarse pointers it is not shown
// at all (see v4-hero.css), so nobody has to discover a tap gimmick.
//
// One note per clean entry: pointerenter fires once when the pointer comes
// in from outside, so moving around inside never changes the text. The
// text is chosen at entry time, while the note is still hidden.
function PortraitFrame() {
  const [noteIndex, setNoteIndex] = useState(0);
  const nextNote = useRef(0);
  const leftAt = useRef(Number.NEGATIVE_INFINITY);

  const handleEnter = (e) => {
    if (e.pointerType === "touch") return;
    if (e.timeStamp - leftAt.current < NOTE_REENTRY_MS) return;
    setNoteIndex(nextNote.current % PORTRAIT_NOTES.length);
    nextNote.current += 1;
  };

  return (
    <div
      className="v4-hero-portrait-frame"
      onPointerEnter={handleEnter}
      onPointerLeave={(e) => {
        leftAt.current = e.timeStamp;
      }}
    >
      <img
        src={profileImage}
        alt="Farhaan Khan portrait"
        className="v4-hero-portrait-img"
        width={800}
        height={800}
        decoding="async"
        fetchPriority="high"
      />
      <span className="v4-hero-portrait-note" aria-hidden="true">
        {PORTRAIT_NOTES[noteIndex]}
      </span>
    </div>
  );
}

function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const container = prefersReducedMotion ? fadeOnly : staggerContainer;
  const item = prefersReducedMotion ? fadeOnly : staggerItem;

  return (
    <section className="v4-hero section">
      <Motion.div
        className="v4-hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Motion.p className="v4-hero-identity" variants={item}>
          Farhaan Khan
        </Motion.p>

        <Motion.h1 className="v4-hero-headline" variants={item}>
          I build things, then figure out why they <BrokeNote />
        </Motion.h1>

        <Motion.p className="v4-hero-supporting" variants={item}>
          CSE student building developer tools, full-stack applications, and
          AI-assisted systems.
        </Motion.p>

        <Motion.div className="v4-hero-ctas" variants={item}>
          <Link to="/work" className="v4-hero-cta-primary">
            View selected work
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="v4-hero-cta-secondary"
          >
            GitHub ↗
          </a>
        </Motion.div>

        <Motion.div className="v4-hero-building" variants={item}>
          <span className="v4-hero-building-label">Currently building</span>
          <span className="v4-hero-building-value">{CURRENTLY_BUILDING}</span>
        </Motion.div>
      </Motion.div>

      <Motion.div
        className="v4-hero-portrait"
        variants={prefersReducedMotion ? fadeOnly : staggerItem}
        initial="hidden"
        animate="show"
      >
        <PortraitFrame />
      </Motion.div>
    </section>
  );
}

export default Hero;
