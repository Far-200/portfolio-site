import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// No hash: reset scroll on every route change, as before.
//
// With a hash (e.g. "/#work" from the WORK nav link / hero CTA):
// AnimatePresence's page transition (mode="wait" in App.jsx) unmounts
// the outgoing route before the incoming one mounts, so the target
// element may not exist in the DOM yet on the first render after a
// cross-route navigation. Poll a few animation frames for it instead
// of guessing a fixed delay tied to the transition's duration.
// scrollIntoView inherits html's scroll-behavior (smooth normally,
// auto under prefers-reduced-motion — see index.css), so reduced
// motion is handled without any extra logic here.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const id = hash.slice(1);
    let attempts = 0;
    let rafId = null;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start" });
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
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
