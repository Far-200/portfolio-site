import DeskProps from "./DeskProps";
import "./desk-scene.css";

// Decorative still life behind the compact card: the desk and its props, one warm lamp from the upper left, and a vignette.
// The props sit under the lamp and vignette layers so they share the same light.
// Compact cards show the full still life; opened folios soften it to keep the paper in focus.
export default function DeskScene() {
  return (
    <div className="desk-scene" aria-hidden="true">
      <div className="desk-surface" />
      <DeskProps />
      <div className="desk-light" />
      <div className="desk-vignette" />
    </div>
  );
}
