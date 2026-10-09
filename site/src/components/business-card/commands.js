import { IDENTITY } from "../../data/identity";
import { getProjectBySlug } from "../../data/projects";
import { ACTIVE_BUILDS } from "../../data/labData";

// The command line is another hand on the same card, not a second interface.
// Each command either answers with a quiet reply, or calls an action the shell already
// uses for its own controls (route links, flip, collapse, the résumé dialog, the card's profile links).
// A string reply is printed; no reply means the action has taken over.
// `group` lists a command in help; `target` lets it follow `open`, `show` or `go to`.
const COMMANDS = [
  { names: ["home"], group: "pages", target: true, description: "front of the card", run: (card) => card.go("/") },
  { names: ["index", "work", "projects"], group: "pages", target: true, description: "selected work", run: (card) => card.go("/work") },
  { names: ["about"], group: "pages", target: true, description: "about me", run: (card) => card.go("/about") },
  { names: ["log"], group: "pages", target: true, description: "build log", run: (card) => card.go("/log") },
  { names: ["lab"], group: "pages", target: true, description: "workbench", run: (card) => card.go("/lab") },
  ...projectShortcuts(),
  { names: ["github", "gh"], group: "links", target: true, description: "github profile ↗", run: (card) => card.open(IDENTITY.github, "github") },
  { names: ["linkedin"], group: "links", target: true, description: "linkedin profile ↗", run: (card) => card.open(IDENTITY.linkedin, "linkedin") },
  { names: ["x", "twitter"], group: "links", target: true, description: "x profile ↗", run: (card) => card.open(IDENTITY.x, "x") },
  { names: ["resume", "cv"], group: "links", target: true, description: "choose a résumé", run: (card) => card.resume() },
  { names: ["mail", "email"], group: "links", target: true, description: IDENTITY.email, run: (card) => card.mail(IDENTITY.email) },
  { names: ["flip"], group: "card", description: "turn the card over", run: (card) => card.flip() },
  { names: ["collapse"], group: "card", description: "put this page away", run: (card) => card.collapse() },
  { names: ["status"], group: "card", description: "what's happening", run: () => "still building." },
  { names: ["clear", "cls"], group: "card", description: "clear the screen", run: (card) => card.clear() },
  { names: ["help"], group: "card", description: "this list", run: () => HELP },
];

// Short names for real projects. Titles and routes come from projects.js; a build that is only on the
// workbench (labData.js) has no page, so it says so instead of guessing a route. Each also answers to its title and slug.
function projectShortcuts() {
  return [
    ["tbc", "think-before-code"],
    ["fsv", "folder-structure-visualizer"],
    ["flowtrace", "flowtrace"],
    ["attendance", "attendance-analytics"],
  ].map(([alias, id]) => {
    const project = getProjectBySlug(id);
    const title = project?.title ?? ACTIVE_BUILDS.find((build) => build.id === id).name;
    return {
      names: [...new Set([alias, title.toLowerCase(), id])], group: "projects", target: true, quiet: true,
      description: project ? title : `${title} · in the lab, no page yet`,
      run: project ? (card) => card.go(project.internalRoute) : () => `${title.toLowerCase()} has no project page yet · it's in the lab: go to lab`,
    };
  });
}

// Meant to be found, so never listed in help or offered by tab.
const ASIDES = {
  hire: "excellent command.",
  sudo: "nice try.",
  rm: "permission denied. for your own protection.",
  farhaan: "hireable.",
  "what doing": "doing my best.",
  why: "god knows.",
  coffee: "yes.",
  stack: "LIFO.",
  fuck: "understandable.",
  whoami: "farhaan, probably.",
  sleep: "not found.",
  bug: "feature pending review.",
  ai: "coworker. occasionally supervisor.",
  deploy: "brave.",
  css: "depends who hurt you.",
  javascript: "unfortunately.",
  python: "indentation detected.",
  money: "404.",
  life: "still building.",
  test: "works on my machine.",
};
for (const [name, reply] of Object.entries(ASIDES)) COMMANDS.push({ names: [name], run: () => reply });

const LISTED = COMMANDS.filter((command) => command.group);
const TARGETS = COMMANDS.filter((command) => command.target);
const pad = (text) => text.padEnd(12);
// Project shortcuts are `quiet`: their other names are their titles, already on the line.
const HELP = [...new Set(LISTED.map((command) => command.group))].map((group) => [group,
  ...LISTED.filter((command) => command.group === group).map(({ names: [name, ...aliases], description, quiet }) =>
    `  ${pad(name)}${description}${aliases.length && !quiet ? ` · ${aliases.join(", ")}` : ""}`),
].join("\n")).concat("try: open github · show tbc · go to lab · tab completes · ↑↓ recalls").join("\n");

// Exported so the terminal can give a miss its own quiet tone.
export const NOT_FOUND = "command not found";
export const isMiss = (reply) => /^(command not found: |can't (open|show|go to) )/.test(reply);

// `open github`, `show tbc`, `go lab`, `go to about`: a verb in front of any destination. `gopher` is not `go`.
const VERB = /^(open|show|go(?: to)?)(?: (.+))?$/;
// A bare verb suggests the destinations it reads most naturally with.
const SUGGEST = { open: "links", show: "projects", go: "pages", "go to": "pages" };
// An exact name wins; failing that, a name followed by anything still counts (so `sudo collapse` and `rm -rf portfolio` land on sudo and rm).
const find = (list, line) => list.find((entry) => entry.names.includes(line))
  ?? list.find((entry) => entry.names.some((name) => line.startsWith(`${name} `)));

// No shell parsing: whitespace is collapsed, case ignored, and the line matched against registry names.
export function runCommand(input, card) {
  const line = input.trim().replace(/\s+/g, " ");
  if (!line) return "";
  const lower = line.toLowerCase();
  const verb = lower.match(VERB);
  if (verb) {
    const [, action, target] = verb;
    const ask = action.startsWith("go") ? "go where?" : `${action} what?`;
    if (!target) return `${ask} ${TARGETS.filter((c) => c.group === SUGGEST[action]).map((c) => c.names[0]).join(" · ")}`;
    const command = find(TARGETS, target);
    return command ? command.run(card) : `can't ${action === "go" ? "go to" : action} ${target} · try help`;
  }
  const command = find(COMMANDS, lower);
  return command ? command.run(card) : `${NOT_FOUND}: ${line.split(" ")[0]} · try help`;
}

// Tab: finish a listed name (or a destination after `open`/`show`/`go to`) when only one fits;
// otherwise extend to what the candidates share and offer them. Null leaves Tab to move focus.
export function completeCommand(input) {
  const lower = input.replace(/^\s+/, "").replace(/\s+/g, " ").toLowerCase();
  const verb = lower.match(/^(open |show |go to |go )(\S*)$/);
  const [head, partial] = verb ? [verb[1], verb[2]] : [lower.includes(" ") ? null : "", lower];
  if (head === null || (!verb && !partial)) return null;
  // Each command offers its first name that fits, so aliases complete without crowding the list.
  const names = (verb ? TARGETS : LISTED).map((c) => c.names).concat(verb ? (head === "go " ? [["to"]] : []) : [["open"], ["show"], ["go"]]);
  const matches = names.map((group) => group.find((name) => name.startsWith(partial))).filter(Boolean);
  if (!matches.length) return null;
  // Verbs (and the `to` in `go to`) take a space so the destination can follow.
  const spaced = (name) => (verb ? name === "to" : ["open", "show", "go"].includes(name)) ? `${name} ` : name;
  if (matches.length === 1) return { value: head + spaced(matches[0]), options: [] };
  let shared = matches[0];
  for (const name of matches) while (!name.startsWith(shared)) shared = shared.slice(0, -1);
  return { value: head + shared, options: matches };
}
