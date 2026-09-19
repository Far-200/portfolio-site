import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Scroll behaviour on navigation:
//
// - A new route always starts at the top, instantly. html has
//   `scroll-behavior: smooth` (index.css), which would otherwise turn
//   window.scrollTo(0, 0) into a long animated scroll up from wherever
//   the previous page was left.
// - A hash (e.g. /about#toolkit) scrolls smoothly to its target. On a
//   cross-route hash we first jump to the top, so the smooth scroll
//   starts from the top of the new page rather than the old page's
//   scroll position.
// - Re-clicking the link for the page you're already on scrolls back up
//   smoothly.
// - Under prefers-reduced-motion, everything is instant.
//
// The incoming page mounts immediately (no exit transition in App.jsx),
// so the hash target normally exists on the first effect; the rAF poll
// is a safety net for late-mounting content.

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const pathChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    const smooth = reducedMotion() ? "instant" : "smooth";

    if (pathChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    if (!hash) {
      if (!pathChanged) {
        window.scrollTo({ top: 0, left: 0, behavior: smooth });
      }
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let rafId = null;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: smooth });
        return;
      }
      attempts += 1;
      if (attempts < 30) {
        rafId = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pathname, hash, key]);

  return null;
}

export default ScrollToTop;
