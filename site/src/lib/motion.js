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

// Canonical V4 editorial easing — the curve already used throughout
// the legacy site's motion, kept as the one easing V4 standardizes on.
export const EASE = [0.16, 1, 0.3, 1];

/* ── Section reveal ───────────────────────────────────────────────
   Default entrance for sections/blocks scrolling into view. */
export const sectionReveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* Opacity-only fallback — use in place of sectionReveal/staggerItem
   when prefersReducedMotion is true. */
export const fadeOnly = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

/* ── Stagger container ────────────────────────────────────────────
   Wrap a group of staggerItem children. Restrained on purpose. */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
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
  transition: { duration: 0.5, ease: EASE },
};
