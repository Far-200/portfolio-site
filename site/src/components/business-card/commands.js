// The hidden command line is another hand on the same card, not a second interface.
// Each command either answers with one quiet line, or calls an action the shell already
// uses for its own controls (route links, flip, collapse, the résumé dialog).
// A string reply keeps the tray open; no reply means the action has taken over.
const COMMANDS = [
  { names: ["help"], listed: false, run: () => `available: ${LISTED}` },
  { names: ["home"], run: (card) => card.go("/") },
  { names: ["index", "work", "projects"], run: (card) => card.go("/work") },
  { names: ["about"], run: (card) => card.go("/about") },
  { names: ["log"], run: (card) => card.go("/log") },
  { names: ["lab"], run: (card) => card.go("/lab") },
  { names: ["resume", "cv"], run: (card) => card.resume() },
  { names: ["status"], run: () => "still building." },
  { names: ["flip"], run: (card) => card.flip() },
  { names: ["collapse"], run: (card) => card.collapse() },
  { names: ["clear", "cls"], run: (card) => card.clear() },
];

// Meant to be found, so never listed in help.
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
for (const [name, reply] of Object.entries(ASIDES)) COMMANDS.push({ names: [name], listed: false, run: () => reply });

const LISTED = COMMANDS.filter((command) => command.listed !== false).map((command) => command.names[0]).join("\u00a0· ");

// Exported so the tray can give the one failure reply its own quiet tone.
export const NOT_FOUND = "command not found";

// No shell parsing: the line is matched against registry names, a name followed by anything
// still counts (so `sudo collapse` and `rm -rf portfolio` land on sudo and rm).
export function runCommand(input, card) {
  const line = input.trim().replace(/\s+/g, " ");
  if (!line) return "";
  const lower = line.toLowerCase();
  const command = COMMANDS.find((entry) => entry.names.some((name) => lower === name || lower.startsWith(`${name} `)));
  return command ? command.run(card) : `${NOT_FOUND}: ${line.split(" ")[0]} · try help`;
}
