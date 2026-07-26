import { useState, useEffect, useRef, useCallback } from "react";

/* ── Boot content ──────────────────────────────────────────── */
const COMMAND = "farhaan@portfolio:~$ ./launch-portfolio";

const STEPS = [
  "Loading interface",
  "Mounting selected work",
  "Initializing project archive",
  "Connecting GitHub, LinkedIn and X",
  "Restoring questionable humour",
  "Preparing contact channels",
];

/* Static system-rail metadata (no runtime claims). */
const SYSTEM_META = [
  { label: "build", value: "portfolio_v3" },
  { label: "runtime", value: "React + Vite" },
  { label: "motion", value: "Framer Motion" },
  { label: "deploy", value: "Vercel" },
];

/* ── Timing constants (all in ms) ──────────────────────────── */
const TYPE_INTERVAL = 26; // per-character typing speed
const TYPE_START = 140; // pause before typing begins
const STEP_INTERVAL = 300; // gap between boot steps
const READY_HOLD = 380; // pause on "Portfolio ready."
const LAUNCH_HOLD = 420; // pause on "Launching..." before exit
const EXIT_MS = 420; // fade/scale-out duration (matches CSS)

function BootTerminal({ onDone }) {
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [stepCount, setStepCount] = useState(0); // completed boot steps
  const [ready, setReady] = useState(false); // "Portfolio ready."
  const [launching, setLaunching] = useState(false); // "Launching..."
  const [exiting, setExiting] = useState(false);

  const timersRef = useRef([]);
  const finishedRef = useRef(false); // guards onDone to fire exactly once
  const mountedRef = useRef(true);
  const unlockScrollRef = useRef(() => {});

  // Cancellable delay that registers its timer for cleanup.
  const delay = useCallback(
    (ms) =>
      new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        timersRef.current.push(t);
      }),
    [],
  );

  // Single guarded finish path — safe to call from timers, skip, Esc.
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Release the page as soon as the exit animation starts. Waiting for
    // unmount leaves a short window where the page is visible but the first
    // wheel/touch gesture is still swallowed by overflow: hidden.
    unlockScrollRef.current();

    if (mountedRef.current) setExiting(true);
    const exitTimer = setTimeout(() => onDone(), EXIT_MS);
    timersRef.current.push(exitTimer);
  }, [onDone]);

  useEffect(() => {
    mountedRef.current = true;

    // Reduced motion → bypass immediately, no half-animated terminal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return () => {};
    }

    // Lock page scroll; capture prior inline values to restore exactly.
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    let scrollLocked = true;
    const unlockScroll = () => {
      if (!scrollLocked) return;
      scrollLocked = false;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
    unlockScrollRef.current = unlockScroll;

    // Escape always skips (guarded finish handles double-fire).
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    let cancelled = false;

    const run = async () => {
      await delay(TYPE_START);

      // Phase 1 — type the command character by character.
      for (let i = 1; i <= COMMAND.length; i += 1) {
        if (cancelled) return;
        setTyped(COMMAND.slice(0, i));
        await delay(TYPE_INTERVAL);
      }
      if (cancelled) return;
      setTypingDone(true);
      await delay(STEP_INTERVAL);

      // Phase 2 — advance boot steps one at a time; progress derives from this.
      for (let i = 0; i < STEPS.length; i += 1) {
        if (cancelled) return;
        setStepCount(i + 1);
        await delay(STEP_INTERVAL);
      }

      // Phase 3 — "Portfolio ready." then "Launching..." then exit.
      if (cancelled) return;
      setReady(true);
      await delay(READY_HOLD);
      if (cancelled) return;
      setLaunching(true);
      await delay(LAUNCH_HOLD);
      if (cancelled) return;
      finish();
    };

    run();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      window.removeEventListener("keydown", onKey);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      unlockScroll();
      unlockScrollRef.current = () => {};
    };
    // finish/delay are stable; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress: command-typed counts as one unit alongside the steps.
  const totalUnits = STEPS.length + 1;
  const doneUnits = (typingDone ? 1 : 0) + stepCount;
  const progress = Math.round((doneUnits / totalUnits) * 100);

  const allDone = stepCount >= STEPS.length;
  const systemStatus = launching
    ? "LAUNCHING"
    : allDone
      ? "READY"
      : "INITIALIZING";

  // Single polite announcement for the current/active line only, so
  // rendering all pending rows doesn't create a wall of SR chatter.
  const liveMessage = !typingDone
    ? "Running launch command"
    : !allDone
      ? STEPS[stepCount] // the row currently in progress
      : ready
        ? "Portfolio ready"
        : "";

  return (
    <div
      className={`boot-overlay${exiting ? " boot-overlay--exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio boot sequence"
    >
      <div className="boot-window" role="document">
        {/* Title bar */}
        <div className="boot-window-bar" aria-hidden="true">
          <span className="dev-terminal-dot dev-terminal-dot--red" />
          <span className="dev-terminal-dot dev-terminal-dot--yellow" />
          <span className="dev-terminal-dot dev-terminal-dot--green" />
          <span className="boot-window-title">
            farhaan@portfolio — boot sequence
          </span>
        </div>

        {/* Two-column body: console (left) + system rail (right) */}
        <div className="boot-window-body">
          <div className="boot-console">
            <p className="boot-line boot-line--cmd">
              {typed}
              {!typingDone && (
                <span className="boot-cursor" aria-hidden="true">
                  ▋
                </span>
              )}
            </p>

            {/* Full manifest — all six rows rendered, only state changes */}
            <ul className="boot-manifest" aria-hidden="true">
              {STEPS.map((label, i) => {
                const state =
                  i < stepCount
                    ? "completed"
                    : i === stepCount && !allDone
                      ? "current"
                      : allDone
                        ? "completed"
                        : "pending";
                const marker =
                  state === "completed"
                    ? "[OK]"
                    : state === "current"
                      ? "[>>]"
                      : "[  ]";
                return (
                  <li
                    key={label}
                    className={`boot-manifest-row boot-manifest-row--${state}`}
                  >
                    <span className="boot-marker">{marker}</span>
                    <span className="boot-manifest-label">{label}</span>
                    {state === "current" && (
                      <span className="boot-cursor" aria-hidden="true">
                        ▋
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Reserved status area — fixed height, no layout shift */}
            <div className="boot-status-area">
              {ready && (
                <p className="boot-line boot-line--ready">Portfolio ready.</p>
              )}
              {launching && (
                <p className="boot-line boot-line--launch">Launching...</p>
              )}
            </div>

            {/* Polite live region: current step only, not the pending wall */}
            <p className="boot-sr-only" aria-live="polite">
              {liveMessage}
            </p>

            {/* Progress bar — anchored to console bottom via margin-top:auto */}
            <div className="boot-progress">
              <div
                className="boot-progress-track"
                role="progressbar"
                aria-label="Boot progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="boot-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="boot-progress-pct">{progress}%</span>
            </div>
          </div>

          {/* Right system rail — quiet metadata + live status */}
          <aside className="boot-system-panel" aria-hidden="true">
            <p className="boot-system-heading">SYSTEM</p>
            <dl className="boot-system-list">
              {SYSTEM_META.map((row) => (
                <div key={row.label} className="boot-system-item">
                  <dt className="boot-system-label">{row.label}</dt>
                  <dd className="boot-system-value">{row.value}</dd>
                </div>
              ))}
              <div className="boot-system-item">
                <dt className="boot-system-label">status</dt>
                <dd className="boot-system-value boot-system-status">
                  <span
                    className={`boot-status-dot${
                      allDone ? " boot-status-dot--ready" : ""
                    }`}
                  />
                  {systemStatus}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Footer / status strip — holds the skip control */}
        <div className="boot-window-footer">
          <span className="boot-footer-tag" aria-hidden="true">
            PORTFOLIO_V3
          </span>
          <button type="button" className="boot-skip" onClick={finish}>
            <span className="boot-skip-key" aria-hidden="true">
              ESC
            </span>
            <span className="boot-skip-full">— skip intro</span>
            <span className="boot-skip-short">Skip intro</span>
          </button>
        </div>
      </div>

      {/* Decorative watermark behind/below the terminal */}
      <div className="boot-watermark" aria-hidden="true">
        FARHAAN / PORTFOLIO_V3
      </div>
    </div>
  );
}

export default BootTerminal;
