// ── Shared Framer Motion primitives for V4 components ──────────────
// A small, fixed motion vocabulary instead of one-off variants per
// component. New V4 components should reach for these first.
//
// Reduced motion: use Framer Motion's own `useReducedMotion()` hook
// (re-exported below) and swap to `fadeOnly` instead of building a
// parallel reduced-motion system. Example:
//
//   import { motion } from "framer-motion";
//   import { sectionReveal, fadeOnly, useReducedMotion } from "../lib/motion";
//
//   function Example() {
//     const prefersReducedMotion = useReducedMotion();
//     return (
//       <motion.section
//         variants={prefersReducedMotion ? fadeOnly : sectionReveal}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         {/* ... */}
//       </motion.section>
//     );
//   }
//
// For hover/tap targets (plain objects, not variants), skip passing
// them at all when prefersReducedMotion is true:
//
//   <motion.img whileHover={prefersReducedMotion ? undefined : mediaHover} />

export { useReducedMotion } from "framer-motion";

// Canonical V4 editorial easing — the one curve every V4 transition
// uses (JS here, and --v4-ease in v4-tokens.css for CSS).
export const EASE = [0.16, 1, 0.3, 1];

// The whole duration vocabulary, mirroring --v4-duration-* in CSS:
//   fast  colour / opacity nudges
//   base  short movement: route enter, menus, small entries
//   slow  scroll reveals and the nav's first appearance
export const DURATION = { fast: 0.15, base: 0.32, slow: 0.56 };

// One scroll-reveal trigger for every route. `margin` holds the reveal
// until an element is a little way into the viewport, and `amount`
// keeps tall blocks from waiting for their far edge, so content fades
// in already on screen instead of popping in at the bottom edge.
export const revealViewport = {
  once: true,
  amount: 0.1,
  margin: "0px 0px -6% 0px",
};

/* ── Section reveal ───────────────────────────────────────────────
   Default entrance for sections/blocks scrolling into view. */
export const sectionReveal = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/* Opacity-only fallback — use in place of sectionReveal/staggerItem
   when prefersReducedMotion is true. */
export const fadeOnly = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

/* ── Stagger container ────────────────────────────────────────────
   Wrap a group of staggerItem children. Restrained on purpose. */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const staggerItem = sectionReveal;

/* ── Interactive control response ─────────────────────────────────
   For buttons, nav links, small controls — tiny movement only.
   Use directly as whileHover / whileTap targets. */
export const controlHover = { y: -1, scale: 1.01 };
export const controlTap = { scale: 0.99 };

/* ── Project / media hover ────────────────────────────────────────
   Subtle zoom for project thumbnails and case-study media.
   Use directly as a whileHover target. */
export const mediaHover = {
  scale: 1.02,
  transition: { duration: DURATION.slow, ease: EASE },
};
