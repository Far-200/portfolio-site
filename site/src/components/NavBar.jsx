import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

// WORK currently points at the dedicated /projects route rather than
// an in-page anchor — the homepage doesn't have a distinct "work"
// section id yet (that lands with the Selected Work rebuild), and
// /projects already shows the same project set cleanly from any
// route, including non-home ones.
const NAV_LINKS = [
  { to: "/projects", label: "Work" },
  { to: "/lab", label: "Lab" },
  { to: "/about", label: "About" },
];

const RESUME_HREF = "/resume/Farhaan_Khan_Resume.pdf";

const MOBILE_MENU_ID = "mobile-nav-menu";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change (covers link clicks and
  // browser back/forward navigation).
  useEffect(() => {
    const t = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Escape closes the menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Click outside closes the menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <motion.nav
      className={`v4-nav${scrolled ? " v4-nav--scrolled" : ""}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      ref={navRef}
    >
      <div className="v4-nav-inner">
        <NavLink to="/" end className="v4-nav-logo" aria-label="Farhaan Khan — home">
          FK
        </NavLink>

        {/* Desktop links — hidden on mobile via CSS */}
        <div className="v4-nav-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `v4-nav-link${isActive ? " v4-nav-link--active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      className="v4-nav-active-dot"
                      layoutId="v4-nav-active-dot"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <a
            href={RESUME_HREF}
            target="_blank"
            rel="noreferrer"
            className="v4-nav-resume"
          >
            Resume
            <ArrowUpRight size={13} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>

        {/* Mobile menu toggle — hidden on desktop via CSS */}
        <button
          type="button"
          className="v4-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <X size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id={MOBILE_MENU_ID}
            className="v4-nav-mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="v4-nav-mobile-links">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `v4-nav-mobile-link${isActive ? " v4-nav-mobile-link--active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noreferrer"
                className="v4-nav-mobile-link v4-nav-mobile-link--resume"
              >
                Resume ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default NavBar;
