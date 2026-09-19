// ── The Lab — content source ──
// Lab holds what Selected Work and the Build Log don't: builds still in
// progress, the current learning focus, and smaller shipped utilities.
//
// ACTIVE_BUILDS is also the single source of truth for "currently
// building" anywhere on the site (see CURRENTLY_BUILDING below — the
// Hero reads it from here).
//
// github/internalRoute for entries that also have a projects.js record
// are read from there instead of typed again here, so the two files
// can't drift out of sync on those fields.

import { getProjectBySlug } from "./projects";

export const ACTIVE_BUILDS = [
  {
    id: "aptivision",
    name: "AptiVision",
    stage: "Building",
    summary:
      "Visual aptitude trainer now being expanded toward a real full-stack architecture.",
    focus:
      "Designing data models, API boundaries, module endpoints, and the first FastAPI + SQLite foundation.",
    tech: ["React", "FastAPI", "SQLite"],
    github: "https://github.com/Far-200/aptivision",
  },
  {
    id: "astra",
    name: "Astra",
    stage: "Experimental",
    summary:
      "Expressive browser companion with mascot transformations and state-driven behaviour.",
    focus:
      "Building the mascot state machine, transformation sequences, idle behaviour, and reduced-motion support.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: null,
  },
  {
    id: "think-before-code",
    name: "Think Before Code",
    stage: "Maintained",
    summary:
      "Socratic software-engineering skill suite that makes learners reason before reaching for generated code.",
    focus:
      "Maintaining ten coaching skills across problem decoding, DSA, debugging, testing, review, specification, and pattern transfer.",
    tech: ["Claude Skills", "Developer Education"],
    github: getProjectBySlug("think-before-code").github,
  },
];

export const CURRENTLY_BUILDING = ACTIVE_BUILDS.map((b) => b.name).join(" · ");

export const LEARNING_FOCUS = [
  {
    heading: "Backend engineering",
    items: [
      "FastAPI fundamentals",
      "API and data-model design",
      "SQLite foundations",
      "Authentication later",
      "PostgreSQL after the local foundation is understood",
    ],
  },
  {
    heading: "Problem solving",
    items: [
      "C++ fundamentals",
      "Two pointers",
      "Dry running before coding",
      "Building understanding without becoming an AI clipboard",
    ],
  },
];

// Smaller shipped work that isn't one of the Selected Work flagships.
export const LAB_UTILITIES = [
  {
    id: "prompt-router",
    title: "PromptRouter",
    summary: "Privacy-first Chrome extension that recommends a suitable AI model locally.",
  },
  {
    id: "password-estimator",
    title: "Password Strength & Crack Time Estimator",
    summary: "Browser-based password analysis using entropy and estimated crack-time logic.",
  },
  {
    id: "god-of-code",
    title: "God of Code",
    summary:
      "Gamified debugging tutor with realms, quests, progressive hints, XP, and NULL the Raven.",
  },
  {
    id: "devtool",
    title: "Developer JSON Formatter Tool",
    summary: "Utility for formatting, validating, minifying, and inspecting JSON.",
  },
].map((u) => {
  const project = getProjectBySlug(u.id);
  return {
    ...u,
    github: project?.github ?? null,
    internalRoute: project?.internalRoute ?? null,
  };
});
