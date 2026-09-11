// ── Project source of truth ─────────────────────────────────────
// Shared identity/summary metadata for projects that have a real,
// stable identity across the site: the homepage Selected Work
// section, the /projects page, and (for github/internalRoute only)
// labData.js's Lab entries.
//
// This does not replace labData.js — Lab-specific fields (status
// tone, focus copy, engineering-log entries, learning notes) stay
// there. This file is only the shared identity layer.
//
// Not every project the site talks about has a record here yet.
// Aptivision, Astra, and God of Code remain local to labData.js —
// see the note in that file for why.

import fsvPreview from "../assets/folder-visualiser-preview.png";

export const PROJECTS = [
  // ── Flagships (homepage Selected Work, in display order) ──────
  {
    id: "think-before-code",
    slug: "think-before-code",
    title: "Think Before Code",
    shortTitle: "Think Before Code",
    category: "AI · Education · Developer Tool",
    status: "Maintained",
    flagship: true,
    summary:
      "A Socratic DSA tutor that guides reasoning before revealing implementation.",
    problem:
      "Most coding tutors reveal solutions before the learner has really reasoned through the problem.",
    built:
      "A Socratic DSA tutor designed to guide the learner through reasoning before revealing implementation.",
    technicalNote:
      "Tutor behaviour, prompt/evaluation design, feedback flow, and AI-assisted learning interaction.",
    tech: [
      "Claude Skills",
      "Developer Education",
      "Socratic Learning",
      "Open Source",
    ],
    github: "https://github.com/Far-200/think-before-code",
    live: null,
    media: null,
    internalRoute: null,
  },
  {
    id: "flowtrace",
    slug: "flowtrace",
    title: "FlowTrace",
    shortTitle: "FlowTrace",
    category: "Interpreter · Visualization · Developer Tool",
    status: "Experimental",
    flagship: true,
    summary:
      "A C-like execution visualizer that shows how program state changes while code runs.",
    problem:
      "Stepping through code mentally becomes difficult once variables, branches and execution state start changing together.",
    built:
      "A C-like execution visualizer using a custom AST/interpreter pipeline to show how program state changes while code runs.",
    technicalNote:
      "Built around a custom AST/interpreter pipeline, with a React + Monaco editor front end.",
    tech: ["React", "Monaco Editor", "Custom AST Interpreter", "C"],
    github: "https://github.com/Far-200/FlowTrace",
    live: null,
    media: null,
    internalRoute: null,
  },
  {
    id: "folder-structure-visualizer",
    slug: "folder-structure-visualizer",
    title: "Folder Structure Visualizer",
    shortTitle: "Folder Structure Visualizer",
    category: "Developer Tool · Automation",
    status: "Shipped",
    flagship: true,
    summary:
      "Turns pasted ASCII project trees into usable React/Node scaffolds and supports ZIP export.",
    problem:
      "Manually recreating large folder structures from documentation or ASCII trees is tedious.",
    built:
      "A tool that turns pasted ASCII project trees into usable React/Node scaffolds and supports ZIP export.",
    technicalNote: null,
    builtBecause: "manually creating 70 files was painful",
    tech: ["React", "JavaScript", "Vite", "ZIP Export"],
    github: "https://github.com/Far-200/folder-structure-visualizer",
    live: "https://foldervisualiser.farhaankhan.dev",
    media: {
      type: "image",
      src: fsvPreview,
      alt: "Folder Structure Visualizer interface showing a pasted ASCII folder tree on the left and the generated visual file tree on the right",
    },
    internalRoute: "/projects/folder-structure-visualizer",
  },

  // ── Existing shipped projects (not flagship, still routed) ────
  {
    id: "password-estimator",
    slug: "password-estimator",
    title: "Password Strength & Crack Time Estimator",
    shortTitle: "Password Estimator",
    category: "Security · Developer Tool",
    status: "Shipped",
    flagship: false,
    summary:
      "Evaluates password strength and estimates crack time using entropy-based logic, entirely in the browser.",
    builtBecause: "most password checkers just say 'strong' with zero math",
    tech: ["React", "JavaScript", "CSS"],
    github:
      "https://github.com/Far-200/Password-Strength-Crack-Time-Estimator",
    live: "https://password.farhaankhan.dev",
    media: null,
    internalRoute: "/projects/password-estimator",
  },
  {
    id: "devtool",
    slug: "devtool",
    title: "Developer JSON Formatter Tool",
    shortTitle: "DevTool",
    category: "Developer Tool · Utilities",
    status: "Shipped",
    flagship: false,
    summary:
      "Formats, validates, minifies, and tests JSON and API responses for faster developer workflows.",
    builtBecause: "copy-pasting JSON into random websites felt wrong",
    tech: ["React", "JavaScript", "CSS", "API Testing"],
    github: "https://github.com/Far-200/DevTool",
    live: "https://devtool.farhaankhan.dev",
    media: null,
    internalRoute: "/projects/devtool",
  },
  {
    id: "prompt-router",
    slug: "prompt-router",
    title: "PromptRouter",
    shortTitle: "PromptRouter",
    category: "AI · Browser Extension",
    status: "Shipped",
    flagship: false,
    summary:
      "Privacy-first Chrome extension that recommends the right AI model for a prompt in real time — 100% local.",
    builtBecause: "people use expensive AI models for tiny prompts",
    tech: ["JavaScript", "Chrome Extension", "Manifest V3", "AI UX"],
    github: "https://github.com/Far-200/prompt-model-suggester",
    live: null,
    media: null,
    internalRoute: "/projects/prompt-router",
  },
];

// Homepage Selected Work reads this — order matches PROJECTS (01/02/03).
export const FLAGSHIP_PROJECTS = PROJECTS.filter((p) => p.flagship);

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}
