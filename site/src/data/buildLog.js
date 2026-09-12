// ── Build Log — a chronological record of things built, shipped, ──
// ── learned, and broken. Not an employment timeline. ───────────────
//
// Newest first. `date` is a short month label, grouped for display
// under `year` (see BuildLog.jsx). Where an exact date isn't
// established elsewhere in the site, this uses an honest month-level
// placement instead of a fabricated precise date — nothing here
// claims a version number or ship date that isn't already backed up
// by labData.js/projects.js.
//
// `projectId` is optional and, when set, should match a slug in
// projects.js (see getProjectBySlug) so a consumer can link back to
// the full project record without duplicating its fields here.

export const BUILD_LOG = [
  {
    id: "log-think-before-code",
    date: "JUL",
    year: "2026",
    type: "SHIP",
    title: "Think Before Code",
    description:
      "Shipped v1.4.0 with specification-coach, a pre-implementation reasoning skill added to the coaching suite.",
    projectId: "think-before-code",
  },
  {
    id: "log-flowtrace",
    date: "JUL",
    year: "2026",
    type: "EXPERIMENT",
    title: "FlowTrace",
    description:
      "Built a custom AST/interpreter pipeline to execute C-like code and expose its state for visualization.",
    projectId: "flowtrace",
  },
  {
    id: "log-attendance-analytics",
    date: "JUN",
    year: "2026",
    type: "LEARN",
    title: "Attendance Analytics",
    description:
      "Working through attendance summary reporting, an API layer, and early predictive modelling on top of it.",
    projectId: null,
  },
  {
    id: "log-folder-structure-visualizer",
    date: "MAY",
    year: "2026",
    type: "SHIP",
    title: "Folder Structure Visualizer",
    description:
      "Shipped ASCII-tree parsing and ZIP scaffold export after one too many manually-created folder trees.",
    projectId: "folder-structure-visualizer",
  },
];
