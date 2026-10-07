// The hidden command line is another hand on the same card, not a second interface.
// Each command either answers with one quiet line, or calls an action the shell already
// uses for its own controls (route links, flip, collapse, the résumé dialog).
// A string reply keeps the tray open; no reply means the action has taken over.
const COMMANDS = [
  { names: ["help"], listed: false, run: () => `available: ${LISTED}` },
  { names: ["index", "work", "projects"], run: (card) => card.go("/work") },
  { names: ["about"], run: (card) => card.go("/about") },
  { names: ["log"], run: (card) => card.go("/log") },
  { names: ["lab"], run: (card) => card.go("/lab") },
  { names: ["resume", "cv"], run: (card) => card.resume() },
  { names: ["status"], run: () => "still building." },
  { names: ["flip"], run: (card) => card.flip() },
  { names: ["collapse"], run: (card) => card.collapse() },
  { names: ["clear", "cls"], run: (card) => card.clear() },
  { names: ["hire"], listed: false, run: () => "excellent command." },
  { names: ["sudo"], listed: false, run: () => "nice try." },
  { names: ["rm"], listed: false, run: () => "permission denied. for your own protection." },
];

const LISTED = COMMANDS.filter((command) => command.listed !== false).map((command) => command.names[0]).join(" · ");

export function runCommand(input, card) {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return "";
  const command = COMMANDS.find((entry) => entry.names.includes(name.toLowerCase()));
  return command ? command.run(card, args.join(" ")) : `command not found: ${name} · try help`;
}
