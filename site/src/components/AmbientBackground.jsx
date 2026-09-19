import { useEffect, useRef } from "react";

// ── V4 ambient layer ────────────────────────────────────────────
// A quiet dotted grid, plus a soft region around the pointer that
// reveals the grid slightly more strongly and adds a faint cobalt wash.
// Purely decorative, mounted once at the app root, aria-hidden.
//
// Performance: the two pointer-following layers move with `transform`
// only (composited, no repaint), the loop sleeps as soon as the pointer
// settles, and there is no React state on pointermove. The previous
// version drove a viewport-sized mask + 60px blur through CSS variables
// on every frame — a full-screen repaint per pointer move.
//
// Reduced-motion and touch users get the static grid with no pointer
// layers at all (the CSS hides them; the effect below never starts).
const GLOW_RADIUS = 420; // half of .v4-ambient-glow's 840px box
const SPOT_RADIUS = 240; // half of .v4-ambient-spot's 480px box
const DOTS_BLEED = 60; // .v4-ambient-spot-dots extends this far past the spot
const GRID = 30; // dot pitch, must match --size in v4-ambient.css

function AmbientBackground() {
  const glowRef = useRef(null);
  const spotRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    const spot = spotRef.current;
    const dots = dotsRef.current;
    if (!glow || !spot || !dots) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !hasFinePointer) return undefined;

    const target = { x: -9999, y: -9999 };
    const current = { x: -9999, y: -9999 };
    let rafId = null;

    const paint = () => {
      glow.style.transform = `translate3d(${current.x - GLOW_RADIUS}px, ${current.y - GLOW_RADIUS}px, 0)`;

      // Integer positions keep the brighter dots crisp; the inner layer is
      // shifted back by (spot origin mod GRID) so its dots land exactly on
      // the static grid underneath instead of drifting with the pointer.
      const sx = Math.round(current.x - SPOT_RADIUS);
      const sy = Math.round(current.y - SPOT_RADIUS);
      const dx = -((((sx - DOTS_BLEED) % GRID) + GRID) % GRID);
      const dy = -((((sy - DOTS_BLEED) % GRID) + GRID) % GRID);
      spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      dots.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      paint();
      const settled =
        Math.abs(target.x - current.x) < 0.3 &&
        Math.abs(target.y - current.y) < 0.3;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
        paint();
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      // First move: appear at the pointer instead of sliding in from
      // off-screen.
      if (current.x === -9999) {
        current.x = e.clientX;
        current.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="v4-ambient" aria-hidden="true">
      <div className="v4-ambient-grid" />
      <div className="v4-ambient-spot" ref={spotRef}>
        <div className="v4-ambient-spot-dots" ref={dotsRef} />
      </div>
      <div className="v4-ambient-glow" ref={glowRef} />
    </div>
  );
}

export default AmbientBackground;
