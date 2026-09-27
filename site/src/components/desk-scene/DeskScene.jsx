import DeskProps from "./DeskProps";
import "./desk-scene.css";

// Decorative still life behind the compact card: the desk and its props, one warm lamp from the upper left, and a vignette.
// The props sit under the lamp and vignette layers so they share the same light.
// It is visible only while the stage carries .desk-active (front and back); opened folios fade it out.
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
