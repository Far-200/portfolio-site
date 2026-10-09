import { useEffect, useEffectEvent, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { getProjectBySlug } from "../../data/projects";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import CardTilt from "./CardTilt";
import ExpandedProject from "./ExpandedProject";
import { CardAbout, CardLog, CardLab } from "./CardSecondary";
import { useCardMetadata } from "./useCardMetadata";
import CommandTray from "./CommandTray";
import { useResumeChooser } from "../ResumeChooser";
import DeskScene from "../desk-scene/DeskScene";
import DeskPlacement from "../desk-scene/DeskPlacement";

export default function BusinessCardShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const shell = useRef(null);
  const previousPath = useRef(null);
  const front = location.pathname === "/";
  const expanded = !front && location.pathname !== "/work";
  const project = location.pathname.startsWith("/projects/") ? getProjectBySlug(location.pathname.slice(10)) : null;
  const section = project ? "Work" : { "/about": "About", "/log": "Build log", "/lab": "Workbench" }[location.pathname];
  useCardMetadata(project, section);
  const { open: openResume } = useResumeChooser();
  // The terminal is one palette for every route, compact card included. Any navigation (a command, a link, Back) puts it away.
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandKey, setCommandKey] = useState(location.key);
  if (commandKey !== location.key) {
    setCommandKey(location.key);
    setCommandOpen(false);
  }
  const commandPanel = useRef(null);
  const commandInput = useRef(null);
  const commandReturn = useRef(null);

  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = location.pathname;
    const root = shell.current;
    const active = root.querySelector(front ? ".card-front" : ".card-back");
    const scroller = root.querySelector(".surface-scroll");
    if (scroller) scroller.scrollTop = 0;
    // Route changes get a meaningful focus destination. Returning from an
    // expanded surface restores its index link, including browser Back.
    const returnPath = location.state?.returnTo || previous;
    const returnLink = !expanded && !front && returnPath
      ? Array.from(active.querySelectorAll("[data-return]")).find((node) => node.dataset.return === returnPath)
      : null;
    const heading = active.querySelector("[data-route-heading]");
    if (previous !== null && previous !== location.pathname) (returnLink || heading)?.focus({ preventScroll: true });
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target && scroller) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        scroller.scrollTop = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
      }
    }
  }, [location.pathname, location.hash, location.state, front, expanded]);

  const collapse = () => navigate("/work", { state: { returnTo: location.pathname } });
  const flip = () => navigate(front ? "/work" : "/");
  // Opening commits synchronously so the input can take focus inside the same keystroke.
  const openCommand = () => {
    commandReturn.current = shell.current.contains(document.activeElement) ? document.activeElement : null;
    flushSync(() => setCommandOpen(true));
    commandInput.current?.focus({ preventScroll: true });
  };
  // Closing hands focus back to where it was. Opened from nowhere on the card, an open folio takes it in its scroll region;
  // the compact card is left as it was, so closing never straightens a resting card by focusing into it.
  const closeCommand = () => {
    const target = commandReturn.current?.isConnected ? commandReturn.current : shell.current.querySelector(".surface-scroll");
    if (target) target.focus({ preventScroll: true });
    else document.activeElement?.blur();
    setCommandOpen(false);
  };
  // Commands press the card's own controls. Route changes close the terminal and hand focus to the route effect above.
  // Profiles open in a new tab like the card's own links; mail hands off to the mail client and the terminal stays put.
  const commandActions = {
    go: (path) => {
      if (path === location.pathname) return "already here.";
      navigate(path);
    },
    open: (href, name) => {
      window.open(href, "_blank", "noopener,noreferrer");
      return `opening ${name} ↗`;
    },
    mail: (address) => {
      window.open(`mailto:${address}`, "_self");
      return `writing to ${address}`;
    },
    flip,
    collapse: () => (expanded ? collapse() : "nothing to collapse."),
    resume: () => { closeCommand(); openResume(); },
  };
  // Ctrl/Cmd+K is the only way in: it toggles the terminal on any route, but never from another field or over the résumé dialog.
  // Escape also reaches it here, for when a press inside the palette (its output, say) has left focus on the page.
  const onCommandShortcut = useEffectEvent((event) => {
    if (document.querySelector("dialog[open]")) return;
    if (event.key === "Escape" && commandOpen) {
      event.preventDefault();
      closeCommand();
      return;
    }
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== "k") return;
    const field = event.target.closest?.("input, textarea, select, [contenteditable]:not([contenteditable='false'])");
    if (field && field !== commandInput.current) return;
    event.preventDefault();
    if (!commandOpen) openCommand();
    else if (commandPanel.current?.contains(document.activeElement)) closeCommand();
    else commandInput.current?.focus({ preventScroll: true });
  });
  useEffect(() => {
    const listener = (event) => onCommandShortcut(event);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
  // Like any palette, it steps aside when you press or tab somewhere else; focus stays wherever that was.
  useEffect(() => {
    if (!commandOpen) return;
    const away = (event) => { if (!commandPanel.current?.contains(event.target)) setCommandOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("focusin", away);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("focusin", away);
    };
  }, [commandOpen]);
  return (
    <main className={`card-stage${expanded ? " is-expanded" : front ? "" : " is-back"}${expanded ? "" : " desk-active"}`}>
      <DeskScene />
      <DeskPlacement turned={!front}>
      <CardTilt expanded={expanded}>
        <Motion.div ref={shell} className={`business-card${expanded ? " expanded-card" : ""}`}
          layout={!reduced} transition={{ layout: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } }}
          onKeyDown={(event) => {
            if (event.key !== "Escape" || !expanded || document.querySelector("dialog[open]")) return;
            event.preventDefault();
            if (commandOpen) closeCommand(); else collapse();
          }}
        >
          <div className={`card-turn${front ? "" : " is-turned"}`}>
            <section className="card-face card-front" aria-hidden={!front} inert={!front}>
              <CardFront onFlip={flip} />
            </section>
            <section className="card-face card-back" aria-hidden={front} inert={front}>
              {!expanded ? <CardBack onFlip={flip} /> : (
                <div className="expanded-content">
                  <header className="surface-header">
                    <Link to="/work" className="monogram" aria-label="Return to card index">fk.</Link>
                    <span className="micro folio-context">Personal interface <span>{section || "Not found"}</span></span>
                    <button className="collapse-control" onClick={collapse}>Collapse <span className="arrow" aria-hidden="true">↙</span></button>
                  </header>
                  <div className="surface-scroll" role="region" tabIndex={0} aria-label={`${section || "Page"} content`}>
                    <Motion.div key={location.pathname} className="surface-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0.1 : 0.3, delay: reduced ? 0 : 0.12 }}>
                      {project ? <ExpandedProject project={project} />
                        : location.pathname === "/about" ? <CardAbout />
                        : location.pathname === "/log" ? <CardLog />
                        : location.pathname === "/lab" ? <CardLab />
                        : <div className="empty-card"><p className="micro">404 / Misplaced</p><h1 tabIndex={-1} data-route-heading>This side is blank.</h1><p>There’s more on the other side.</p><Link className="ink-link" to="/work">Return to the card <span aria-hidden="true">↙</span></Link></div>}
                    </Motion.div>
                  </div>
                  <footer className="surface-footer"><span className="micro">Farhaan Khan</span><nav aria-label="Card surfaces"><Link to="/work">Index</Link><Link to="/about" aria-current={location.pathname === "/about" ? "page" : undefined}>About</Link><Link to="/log" aria-current={location.pathname === "/log" ? "page" : undefined}>Log</Link><Link to="/lab" aria-current={location.pathname === "/lab" ? "page" : undefined}>Lab</Link></nav></footer>
                </div>
              )}
            </section>
          </div>
        </Motion.div>
      </CardTilt>
      </DeskPlacement>
      {/* Laid over the card, outside every card transform, so opening it never moves, turns or resizes the paper. */}
      <CommandTray open={commandOpen} panelRef={commandPanel} inputRef={commandInput} actions={commandActions} onClose={closeCommand} />
    </main>
  );
}
