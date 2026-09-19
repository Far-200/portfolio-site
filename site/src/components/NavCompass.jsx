import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/navLinks";
import { useResumeChooser } from "./ResumeChooser";
import { useHandled, RESUME_KEY } from "../lib/handled";

// ── NavCompass ──────────────────────────────────────────────────
// A small circular control that takes over from the top navbar once the
// navbar has scrolled out of view. The ring around it is page scroll
// progress; clicking it opens a compact stack of the same destinations
// the navbar has, plus Resume and an explicit Top.
//
// It is mounted outside .app-shell on purpose: index.css forces every
// direct child of .app-shell to position: relative, which would undo
// this control's position: fixed.
//
// The navbar is not touched. It scrolls away on its own (see the note
// on .app-shell in index.css), and this component only watches it: if a
// future change makes the navbar sticky it is always in view, and the
// compass simply never appears.

const MENU_ID = "v4-compass-menu";

// Progress ring geometry: r matches the circle in the JSX below.
const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// Homepage sections, top to bottom, and the nav destination each one
// stands for. Real DOM hooks only: .v4-hero, #work (SelectedWork's own
// id) and the two bridge sections. Elements that are not on the page
// are skipped.
const HOME_SECTIONS = [
  { to: "/", selector: ".v4-hero" },
  { to: "/work", selector: "#work" },
  { to: "/log", selector: ".v4-log-bridge" },
  { to: "/lab", selector: ".v4-lab-bridge" },
];

// Progress = scrollTop / (scrollHeight - viewportHeight), clamped to
// [0, 1]. One passive scroll listener, coalesced to one write per frame,
// and the ring is updated by setting a style property directly, so
// scrolling causes no React renders. React state only changes when the
// page goes from scrollable to not (or back).
function useScrollProgress(ringRef) {
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const distance = root.scrollHeight - root.clientHeight;
      const progress =
        distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      ringRef.current?.style.setProperty(
        "stroke-dashoffset",
        String(RING_LENGTH * (1 - progress)),
      );
      setScrollable(distance > 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Page height changes without a scroll (route change, late images).
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
    observer?.observe(root);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ringRef]);

  return scrollable;
}

// Is any part of the top navbar still on screen? Starts as "yes" so the
// compass never flashes in before the observer has reported.
function useNavbarInView() {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const navbar = document.querySelector(".v4-nav");
    if (!navbar || typeof IntersectionObserver !== "function") {
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      setInView(entries[entries.length - 1].isIntersecting);
    });
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  return inView;
}

// On the homepage, which section is under a thin band near the middle of
// the viewport. Only the change of "which one" reaches React.
function useHomeSection(enabled) {
  const [section, setSection] = useState("/");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver !== "function") {
      return undefined;
    }
    const targets = new Map();
    for (const { to, selector } of HOME_SECTIONS) {
      const element = document.querySelector(selector);
      if (element) targets.set(element, to);
    }
    const inBand = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const to = targets.get(entry.target);
          if (entry.isIntersecting) inBand.add(to);
          else inBand.delete(to);
        }
        // Between sections nothing is in the band: keep the last answer.
        const current = HOME_SECTIONS.find(({ to }) => inBand.has(to));
        if (current) setSection(current.to);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((_, element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);

  return section;
}

function NavCompass() {
  const { pathname } = useLocation();
  const { open: openResume } = useResumeChooser();
  const resumeHandled = useHandled(RESUME_KEY);
  const ringRef = useRef(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const scrollable = useScrollProgress(ringRef);
  const navbarInView = useNavbarInView();
  const homeSection = useHomeSection(pathname === "/");
  const visible = scrollable && !navbarInView;

  // The menu closes on a route change and when the compass hides (the
  // navbar came back into view). Adjusting state during render, rather
  // than in an effect, means it can never flash open with stale state.
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }
  if (open && !visible) setOpen(false);

  // Only while open: an outside press or Escape closes the menu. This is
  // not a modal, so there is no focus trap; Escape hands focus back to
  // the trigger if it was inside the control.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (rootRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Route-level "you are here", refined on the homepage by section.
  const currentTo = pathname === "/" ? homeSection : pathname;
  const currentKind =
    pathname === "/" && homeSection !== "/" ? "location" : "page";

  const close = () => setOpen(false);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "instant" : "smooth" });
  };

  const chooseResume = () => {
    // Focus goes back to the trigger first, so when the chooser closes the
    // browser restores focus somewhere that still exists.
    triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
    openResume();
  };

  return (
    <div
      className="v4-compass"
      ref={rootRef}
      data-visible={visible || undefined}
    >
      <button
        type="button"
        className="v4-compass-trigger"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? "Close page navigation" : "Open page navigation"}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <svg className="v4-compass-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle
            className="v4-compass-track"
            cx="22"
            cy="22"
            r={RING_RADIUS}
            fill="none"
          />
          <circle
            className="v4-compass-progress"
            ref={ringRef}
            cx="22"
            cy="22"
            r={RING_RADIUS}
            fill="none"
            transform="rotate(-90 22 22)"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH}
          />
        </svg>
        {open ? (
          <X size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Menu size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      <nav
        id={MENU_ID}
        className="v4-compass-menu"
        aria-label="Quick navigation"
        hidden={!open}
      >
        <ul>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="v4-compass-item"
                aria-current={currentTo === to ? currentKind : undefined}
                onClick={close}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="v4-compass-actions">
          <li>
            <button
              type="button"
              className="v4-compass-item v4-handled"
              data-handled={resumeHandled || undefined}
              aria-haspopup="dialog"
              onClick={chooseResume}
            >
              Resume
              <ArrowUpRight size={13} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </li>
          <li>
            <button type="button" className="v4-compass-item" onClick={goTop}>
              Top
              <ArrowUp size={13} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavCompass;
