import "./desk-props.css";

// Static still life around the card. Every piece is decorative (the whole scene is aria-hidden and ignores the pointer),
// sits under the lamp and vignette layers so it shares their light, and is positioned from the card's edges.

// Keyboard corner: only the top-left of a keyboard, which runs off the bottom-right of the desk. Widths in key units.
const KEY_ROWS = [
  { fn: true, keys: [["esc", 1], ["F1", 1], ["F2", 1], ["F3", 1], ["F4", 1], ["F5", 1]] },
  { keys: [["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1]] },
  { keys: [["tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1]] },
  { keys: [["caps", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1]] },
];

export default function DeskProps() {
  return (
    <div className="desk-props">
      <div className="desk-notebook">
        <div className="notebook-back" />
        <div className="notebook-pages" />
        <div className="notebook-cover" />
        <div className="notebook-band" />
      </div>
      <div className="desk-pen">
        <div className="pen-shadow" />
        <div className="pen-body"><span className="pen-tip" /><span className="pen-ring" /><span className="pen-clip" /></div>
      </div>
      <div className="desk-keyboard">
        {KEY_ROWS.map((row, r) => (
          <div key={r} className={`key-row${row.fn ? " is-fn" : ""}`}>
            {row.keys.map(([label, w]) => (
              <span key={label} className={`key${/^[a-z]{3,}$/.test(label) ? " is-word" : ""}`} style={{ "--w": w }}>{label}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="desk-mug">
        <div className="coaster" />
        <div className="mug-shadow" />
        <div className="mug-handle" />
        <div className="mug-body" />
        <div className="mug-rim" />
      </div>
    </div>
  );
}
