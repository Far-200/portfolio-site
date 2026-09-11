import { useEffect, useRef } from "react";

// ── V4 ambient layer ────────────────────────────────────────────
// Replaces the old CursorGlow + GridBackground pair from App.jsx.
// Same role (mounted once near the app root, purely decorative,
// aria-hidden) — a quiet dotted grid plus a soft region around the
// pointer that reveals the grid slightly more strongly.
//
// Pointer position is written straight to a CSS custom property via
// a ref, throttled by requestAnimationFrame — no React state on
// pointermove, no canvas/WebGL. Reduced-motion users and touch
// devices get the static grid with no pointer reactivity at all.
function AmbientBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !hasFinePointer) return undefined;

    const target = { x: -9999, y: -9999 };
    const current = { x: -9999, y: -9999 };
    let rafId = null;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      current.x = lerp(current.x, target.x, 0.08);
      current.y = lerp(current.y, target.y, 0.08);
      node.style.setProperty("--v4-pointer-x", `${current.x}px`);
      node.style.setProperty("--v4-pointer-y", `${current.y}px`);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="v4-ambient" ref={ref} aria-hidden="true">
      <div className="v4-ambient-grid" />
      <div className="v4-ambient-spotlight" />
      <div className="v4-ambient-glow" />
    </div>
  );
}

export default AmbientBackground;
