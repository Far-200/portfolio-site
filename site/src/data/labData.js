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
    id: "flowtrace",
    name: "FlowTrace",
    stage: "Experimental",
    summary:
      "A C-like execution visualizer that shows how program state changes while code runs.",
    focus:
      "Building a custom AST/interpreter pipeline that executes C-like code and exposes its state for visualisation.",
    tech: getProjectBySlug("flowtrace").tech,
    github: getProjectBySlug("flowtrace").github,
  },
  {
    id: "attendance-analytics",
    name: "Attendance Analytics",
    stage: "Learning",
    summary:
      "Attendance summary reporting with an API layer and early predictive modelling on top of it.",
    focus: null,
    tech: [],
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

// Everything else: smaller shipped utilities and earlier-stage experiments
// that aren't Selected Work flagships or in active development.
export const LAB_UTILITIES = [
  {
    id: "aptivision",
    title: "AptiVision",
    summary:
      "Visual aptitude trainer, with a FastAPI + SQLite backend in design.",
    github: "https://github.com/Far-200/aptivision",
  },
  {
    id: "astra",
    title: "Astra",
    stage: "Experimental",
    summary:
      "Expressive browser companion with mascot transformations and state-driven behaviour.",
  },
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
    github: u.github ?? project?.github ?? null,
    internalRoute: project?.internalRoute ?? null,
  };
});
