import { useState } from "react";
import "./desk-scene.css";

// Sets the card down on the desk with a contact and an ambient shadow cast away from the lamp.
// It only wraps the card and adds no transform; tilt, flip and layout stay on their own elements.
// Outside desk mode it is neutral (no shadows).
export default function DeskPlacement({ turned, children }) {
  // The shadows sit on the desk while the card turns above them, so any static shadow would show as a slab
  // when the card is edge-on. Each turn remounts them with a short lift-and-land fade. Nothing runs on first load.
  const [lastTurned, setLastTurned] = useState(turned);
  const [turns, setTurns] = useState(0);
  if (turned !== lastTurned) {
    setLastTurned(turned);
    setTurns(turns + 1);
  }
  return (
    <div className="desk-placement">
      <div key={turns} className="desk-shadows" data-turning={turns ? "" : undefined} aria-hidden="true">
        <div className="desk-shadow desk-shadow-ambient" />
        <div className="desk-shadow desk-shadow-contact" />
      </div>
      {children}
    </div>
  );
}
