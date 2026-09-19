// Which edge of an element the pointer came in through, so CSS can grow
// an accent from that side (see the [data-from] rules in v4-nav.css,
// v4-motion.css and v4-interaction.css).
//
// Call it once from onPointerEnter. There is no move tracking, no React
// state and no animation frame: it writes a single data attribute.
//
// Touch pointers are ignored on purpose. A finger has no "entry side",
// so phones keep the plain, neutral state. Keyboard focus never reaches
// this either, and the CSS treats "no data-from" as neutral/centred.

export function setEntryEdge(e, sidesOnly = false) {
  if (e.pointerType === "touch") return;

  const rect = e.currentTarget.getBoundingClientRect();
  const distance = {
    left: e.clientX - rect.left,
    right: rect.right - e.clientX,
  };
  if (!sidesOnly) {
    distance.top = e.clientY - rect.top;
    distance.bottom = rect.bottom - e.clientY;
  }

  // The nearest edge at the moment of entry is the one that was crossed.
  const edge = Object.keys(distance).reduce((nearest, key) =>
    distance[key] < distance[nearest] ? key : nearest,
  );
  e.currentTarget.dataset.from = edge;
}

// Thin things (a nav label) only make sense with left/right.
export const setEntrySide = (e) => setEntryEdge(e, true);
