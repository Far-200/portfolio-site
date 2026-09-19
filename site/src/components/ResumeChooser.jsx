import { createContext, useCallback, useContext, useRef, useMemo } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { setEntryEdge } from "../lib/entryEdge";
import { markHandled, RESUME_KEY } from "../lib/handled";

// One shared "Which version would you like?" dialog. Every Resume entry
// point (nav, mobile menu, About) calls useResumeChooser().open() instead
// of linking straight to a PDF. Built on a native <dialog> so Escape,
// focus trapping and focus restore come from the browser.

const ResumeChooserContext = createContext({ open: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export function useResumeChooser() {
  return useContext(ResumeChooserContext);
}

const OPTIONS = [
  {
    href: "/resume/Farhaan_Khan_Resume_ATS.pdf",
    title: "ATS Resume",
    description:
      "Optimized for applicant tracking systems and job applications.",
  },
  {
    href: "/resume/Farhaan_Khan_Resume_Visual.pdf",
    title: "Visual Resume",
    description: "Slightly more polished visually, for direct human viewing.",
  },
];

export function ResumeChooserProvider({ children }) {
  const dialogRef = useRef(null);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ResumeChooserContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className="v4-resume-dialog"
        aria-labelledby="resume-chooser-title"
        // A click on the dialog element itself (not its contents) is a
        // click on the backdrop.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="v4-resume-panel">
          <button
            type="button"
            className="v4-resume-close"
            aria-label="Close"
            onClick={close}
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>

          <h2 className="v4-resume-title" id="resume-chooser-title">
            Which version would you like?
          </h2>

          <ul className="v4-resume-options">
            {OPTIONS.map((option) => (
              <li key={option.href}>
                <a
                  className="v4-resume-option v4-edge"
                  href={option.href}
                  target="_blank"
                  rel="noreferrer"
                  onPointerEnter={setEntryEdge}
                  // markHandled is synchronous and never throws, so the PDF
                  // opens exactly as before; onAuxClick covers middle-click.
                  onClick={() => {
                    markHandled(RESUME_KEY);
                    close();
                  }}
                  onAuxClick={() => markHandled(RESUME_KEY)}
                >
                  <span className="v4-resume-option-title">
                    {option.title}
                    <ArrowUpRight size={15} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <span className="v4-resume-option-desc">
                    {option.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </ResumeChooserContext.Provider>
  );
}
