import { useLayoutEffect, useRef, useState } from "react";
import { completeCommand, isMiss, runCommand } from "./commands";

// A small graphite command palette laid over the card on any route, reached with Ctrl/Cmd+K. It owns only what is typed
// and what it printed, so typing never re-renders the card; the shell owns whether it is out.
export default function CommandTray({ open, panelRef, inputRef, actions, onClose }) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState([]);
  const [wasOpen, setWasOpen] = useState(open);
  const history = useRef([]);
  const recall = useRef(0);
  const nextId = useRef(0);
  const output = useRef(null);
  // Each time the terminal comes out it starts on a clean line; what it printed stays until `clear`.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setValue("");
  }
  const print = (entry) => setEntries((list) => [...list.slice(-39), { id: nextId.current++, ...entry }]);

  // Keep the newest entry in view, from its first line when it is taller than the screen (help).
  useLayoutEffect(() => {
    const log = output.current;
    const last = log?.lastElementChild;
    if (last) log.scrollTop = Math.min(log.scrollHeight - log.clientHeight, last.offsetTop - 8);
  }, [entries]);

  const submit = (event) => {
    event.preventDefault();
    const line = value.trim();
    if (!line) return;
    if (history.current.at(-1) !== line) history.current = [...history.current.slice(-19), line];
    recall.current = history.current.length;
    setValue("");
    print({ command: line });
    const reply = runCommand(line, { ...actions, clear: () => setEntries([]) });
    if (typeof reply === "string" && reply) setEntries((list) => list.with(-1, { ...list.at(-1), reply }));
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if ((event.key === "ArrowUp" || event.key === "ArrowDown") && history.current.length) {
      event.preventDefault();
      recall.current = Math.min(history.current.length, Math.max(0, recall.current + (event.key === "ArrowUp" ? -1 : 1)));
      setValue(history.current[recall.current] ?? "");
    } else if (event.key === "Tab" && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      // Tab only completes when there is something to finish; otherwise it moves focus as usual.
      const completion = completeCommand(value);
      if (!completion) return;
      event.preventDefault();
      setValue(completion.value);
      if (completion.options.length && completion.value === value.replace(/^\s+/, "").replace(/\s+/g, " ").toLowerCase()) print({ options: completion.options.join("  ") });
    }
  };

  return (
    <section ref={panelRef} id="command-tray" className={`command-panel${open ? " is-open" : ""}`} role="dialog" aria-label="Terminal"
      aria-hidden={!open} inert={!open}>
      <header className="command-bar">
        <span className="command-mark" aria-hidden="true">fk://local</span>
        <button type="button" className="command-close" onClick={onClose} aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <ol ref={output} className="command-output" role="log" aria-label="Terminal output">
        {entries.length === 0 && <li className="command-hint">type <b>help</b> for commands · tab completes · esc closes</li>}
        {entries.map((entry) => entry.options ? <li key={entry.id} className="command-options">{entry.options}</li> : (
          <li key={entry.id}>
            <p className="command-echo"><span aria-hidden="true">&gt; </span>{entry.command}</p>
            {entry.reply && <p className="command-reply" data-tone={isMiss(entry.reply) ? "error" : undefined}>
              {/* Indented rows (help) wrap under their description column on narrow screens. */}
              {entry.reply.split("\n").map((line, i) => <span key={i} className={line.startsWith("  ") ? "command-row" : undefined}>{line}</span>)}
            </p>}
          </li>
        ))}
      </ol>
      <form className="command-slot" onSubmit={submit} onClick={() => inputRef.current?.focus()}>
        <label className="command-line">
          <span className="command-prompt" aria-hidden="true">&gt;</span>
          <input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown}
            aria-label="Command. Type help for available commands" placeholder="help"
            autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" />
        </label>
      </form>
    </section>
  );
}
