import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/lab", label: "Lab" },
  { to: "/contact", label: "Contact" },
];

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
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      ref={navRef}
    >
      <div className="nav-container nav-simple">
        <NavLink to="/" className="logo">
          FK
          {/* subtle green underline glow on logo */}
          <span className="logo-dot" aria-hidden="true" />
        </NavLink>

        {/* Desktop links — hidden on mobile via CSS */}
        <div className="nav-links-inline">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link${isActive ? " active-link" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      className="nav-active-dot"
                      layoutId="nav-active-dot"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 36,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu toggle — hidden on desktop via CSS */}
        <button
          type="button"
          className="nav-menu-toggle"
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
            className="nav-mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="nav-mobile-links">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `nav-mobile-link${isActive ? " active-link" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default NavBar;
