// ── The Lab — central content source ──
// Keeping Lab content here instead of scattered across components,
// per the same data-driven pattern the rest of the site is heading toward.
//
// github/internalRoute for entries that also have a projects.js record
// are read from there instead of typed again here, so the two files
// can't drift out of sync on those fields. Everything else here (title,
// tech, status tone, focus copy, summaries) stays Lab-specific — Lab's
// voice and behaviour aren't meant to match the homepage 1:1.
//
// Aptivision, Astra, and God of Code have no projects.js record yet
// (no canonical GitHub/route facts were established for them in this
// phase) and stay fully local to this file. Migrating them is Phase 4.

import { getProjectBySlug } from "./projects";

export const LAB_SUMMARY = [
  { value: "03", label: "Active Builds" },
  { value: "10", label: "Coaching Skills" },
  { value: "Shipping", label: "Status" },
];

export const ACTIVE_BUILDS = [
  {
    id: "aptivision-backend",
    title: "AptiVision Backend",
    status: "Architecture / Learning",
    statusTone: "learning",
    description:
      "Turning the visual aptitude trainer from a polished frontend into a real full-stack system with persistent data, APIs, progress tracking, and backend-owned logic.",
    focus:
      "Designing data models, API boundaries, module endpoints, and the first FastAPI + SQLite foundation.",
    tech: ["React", "FastAPI", "SQLite", "API Design"],
    github: "https://github.com/Far-200/aptivision",
  },
  {
    id: "astra",
    title: "Astra",
    status: "Prototype",
    statusTone: "prototype",
    description:
      "A small desktop-companion experiment built around a blue screen gremlin that can transform between blob and mascot states.",
    focus:
      "Building the browser mascot state machine, transformation sequences, idle behaviour, reduced-motion support, and expressive interactions.",
    tech: ["JavaScript", "HTML", "CSS", "State Machines"],
    github: null,
  },
  {
    id: "think-before-code",
    title: "Think Before Code",
    status: "Maintained",
    statusTone: "maintained",
    description:
      "A Socratic software-engineering skill suite designed to make learners reason before reaching for generated code.",
    focus:
      "Maintaining ten coaching skills across problem decoding, DSA, debugging, testing, review, specification, and pattern transfer.",
    tech: ["Claude Skills", "Developer Education", "Socratic Learning", "Open Source"],
    github: getProjectBySlug("think-before-code").github,
    demo: "https://github.com/Far-200/think-before-code/tree/main/demo",
  },
];

// Chronological, newest first.
export const ENGINEERING_LOG = [
  {
    date: "2026-07-26",
    tag: "feat",
    title: "AptiVision backend architecture defined",
    detail:
      "Defined the AptiVision backend learning path around data modelling, API design, FastAPI, and SQLite.",
  },
  {
    date: "2026-07-25",
    tag: "build",
    title: "Astra mascot sequence integrated",
    detail:
      "Completed and integrated Astra's twelve-frame blob-to-gremlin mascot state sequence.",
  },
  {
    date: "2026-07-23",
    tag: "release",
    title: "Think Before Code v1.4.0 shipped",
    detail:
      "Released Think Before Code v1.4.0 with specification-coach, the suite's pre-implementation reasoning skill.",
  },
  {
    date: "2026-07-20",
    tag: "ship",
    title: "Portfolio redesign shipped",
    detail:
      "Shipped the latest portfolio redesign with terminal boot flow, project storytelling, and responsive layout improvements.",
  },
];

export const ARCHIVE_STATUSES = ["All", "Building", "Maintained", "Shipped", "Experimental"];

export const PROJECT_ARCHIVE = [
  {
    id: "aptivision",
    title: "AptiVision",
    status: "Building",
    summary:
      "Visual aptitude trainer now being expanded toward a real full-stack architecture.",
    tech: ["React", "Vite", "Tailwind", "FastAPI"],
    github: "https://github.com/Far-200/aptivision",
  },
  {
    id: "think-before-code-archive",
    title: "Think Before Code",
    status: "Maintained",
    summary: "Socratic engineering skill suite for reasoning before implementation.",
    tech: ["Claude Skills", "Markdown", "Open Source"],
    github: getProjectBySlug("think-before-code").github,
  },
  {
    id: "astra-archive",
    title: "Astra",
    status: "Experimental",
    summary:
      "Expressive browser companion with mascot transformations and state-driven behaviour.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: null,
  },
  {
    id: "god-of-code",
    title: "God of Code",
    status: "Shipped",
    summary:
      "Gamified debugging tutor with realms, quests, progressive hints, XP, and NULL the Raven.",
    tech: ["React", "Vite", "Tailwind"],
    github: null,
  },
  {
    id: "flowtrace",
    title: "FlowTrace",
    status: "Experimental",
    summary:
      "A visual C execution and reasoning tool focused on making program flow easier to understand.",
    tech: ["C", "Visualisation", "Developer Tooling"],
    github: getProjectBySlug("flowtrace").github,
  },
  {
    id: "folder-structure-visualizer",
    title: "Folder Structure Visualizer",
    status: "Shipped",
    summary:
      "Converts typed folder layouts into visual trees and exportable project scaffolds.",
    tech: ["React", "JavaScript", "ZIP Export"],
    github: getProjectBySlug("folder-structure-visualizer").github,
    internalRoute: getProjectBySlug("folder-structure-visualizer").internalRoute,
  },
  {
    id: "prompt-router",
    title: "PromptRouter",
    status: "Shipped",
    summary:
      "Privacy-first Chrome extension that recommends a suitable AI model locally.",
    tech: ["JavaScript", "Chrome Extension", "Manifest V3"],
    github: getProjectBySlug("prompt-router").github,
    internalRoute: getProjectBySlug("prompt-router").internalRoute,
  },
  {
    id: "password-estimator",
    title: "Password Strength & Crack Time Estimator",
    status: "Shipped",
    summary: "Browser-based password analysis using entropy and estimated crack-time logic.",
    tech: ["React", "JavaScript", "Security UX"],
    github: getProjectBySlug("password-estimator").github,
    internalRoute: getProjectBySlug("password-estimator").internalRoute,
  },
  {
    id: "devtool",
    title: "Developer JSON Formatter Tool",
    status: "Shipped",
    summary: "Utility for formatting, validating, minifying, and inspecting JSON.",
    tech: ["React", "JavaScript", "API Testing"],
    github: getProjectBySlug("devtool").github,
    internalRoute: getProjectBySlug("devtool").internalRoute,
  },
];

export const LEARNING_FOCUS = [
  {
    heading: "Backend Engineering",
    items: [
      "FastAPI fundamentals",
      "API and data-model design",
      "SQLite foundations",
      "Authentication later",
      "PostgreSQL after the local foundation is understood",
    ],
  },
  {
    heading: "Problem Solving",
    items: [
      "C++ fundamentals",
      "Two pointers",
      "Dry running before coding",
      "Building understanding without becoming an AI clipboard",
    ],
  },
];
