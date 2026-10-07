import { useRef, useState } from "react";
import { NOT_FOUND, runCommand } from "./commands";

// A narrow machine tucked under the open folio. It owns only what is typed and the last reply,
// so typing never re-renders the card above it; the shell owns whether it is out.
export default function CommandTray({ open, inputRef, actions, onClose }) {
  const [value, setValue] = useState("");
  const [reply, setReply] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const history = useRef([]);
  const recall = useRef(0);
  // Each time the tray comes out it starts on a clean line.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) { setValue(""); setReply(""); }
  }

  const submit = (event) => {
    event.preventDefault();
    const line = value.trim();
    if (!line) return;
    if (history.current.at(-1) !== line) history.current = [...history.current.slice(-19), line];
    recall.current = history.current.length;
    setValue("");
    const result = runCommand(line, { ...actions, clear: () => "" });
    if (typeof result === "string") setReply(result);
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
    }
  };

  return (
    <div id="command-tray" className={`command-tray${open ? " is-open" : ""}${reply ? " has-reply" : ""}`} aria-hidden={!open} inert={!open}>
      <form className="command-slot" onSubmit={submit} onClick={() => inputRef.current?.focus()}>
        <div className="command-reply-row">
          <p className="command-reply" role="status" title={reply || undefined} data-tone={reply.startsWith(NOT_FOUND) ? "error" : undefined}>{reply}</p>
        </div>
        <label className="command-line">
          <span className="command-prompt" aria-hidden="true">&gt;</span>
          <input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown}
            aria-label="Command. Type help for available commands" placeholder="help"
            autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" />
          <span className="command-mark" aria-hidden="true">fk://local</span>
        </label>
      </form>
    </div>
  );
}
