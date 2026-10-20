import { motion as Motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DURATION, EASE, revealViewport } from "../../lib/motion";

const PIPELINE = [
  { label: "Tokenizer", body: "Breaks the typed sentence into keywords and arguments." },
  { label: "Parser", body: "Matches the tokens against a small, explicit grammar." },
  { label: "Typed command", body: "A validated, structured instruction — never a raw string." },
  { label: "Executor", body: "Runs it through filesystem services, safety policy, or the GitHub client." },
];

const CAPABILITIES = [
  "Navigate, create, view, manage, and remove files and folders through supported English phrases",
  "Every operation can reveal the shell command or REST endpoint it corresponds to, as an educational hint that is never itself executed",
  "Four read-only GitHub queries: a user's repositories, a repository's open issues, its latest release, and the authenticated account's own repositories",
  "Quoted paths with spaces, literal backslashes for Windows paths, and case-insensitive keywords",
];

const SAFETY = [
  "Destructive operations require typing the exact confirmation “remove it” in an interactive terminal; any other response cancels",
  "A removal boundary protects the safety root itself, drive roots, the user's home, and known system directories",
  "Recursive removal is previewed first: files and nested folders are counted, then rechecked after confirmation",
  "The GitHub client issues GET-only requests to api.github.com, refuses redirects, and caps each response at 2 MiB",
];

const LIMITATIONS = [
  "Fixed grammar, not arbitrary English — no quote escapes or wildcard expansion",
  "No arbitrary shell execution, persistent history, completion, or undo",
  "Copy and move support regular files only; folder rename is Windows-only",
  "Prevents common accidents — not a claim of complete filesystem isolation",
];

function EnglishTerminalPage({ embedded = false }) {
  return (
    <section className="project-detail-page">
      {!embedded && (
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
        >
          <p className="section-tag">Project Spotlight</p>
          <h1>English Terminal</h1>
          <div className="hero-buttons project-detail-actions">
            <a href="https://github.com/Far-200/english-terminal" target="_blank" rel="noreferrer" className="btn btn-primary">
              <FaGithub /><span>View Repository</span>
            </a>
            <Link to="/work" className="btn btn-secondary">Back to Work</Link>
          </div>
        </Motion.div>
      )}

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Overview</h2>
        <p>
          English Terminal maps a small, explicit English grammar to local filesystem
          operations and read-only GitHub REST API queries. Instead of recalling exact
          syntax, a user describes what they want done — make a file, show the folders,
          check the latest release of a repository — and the CLI carries it out.
        </p>
        <p>
          It exists to make terminal and API concepts approachable: most supported
          operations can also show the shell command or REST endpoint behind them,
          turning a one-off action into a small, concrete lesson.
        </p>
      </Motion.div>

      <Motion.div
        className="project-detail-grid"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <div className="project-detail-main">
          <h2>How It Works</h2>
          <p>
            Input moves through a fixed pipeline rather than a model guessing at intent.
            Parsing has no network side effects, and HTTP handling stays isolated to the
            GitHub client. Unsupported input fails outright instead of having its meaning
            guessed.
          </p>
        </div>
        <div className="project-detail-side">
          <h2>The Pipeline</h2>
          <ol className="project-pipeline">
            {PIPELINE.map((step, i) => (
              <li key={step.label}>
                <span className="micro">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{step.label}</h3><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </Motion.div>

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Key Capabilities</h2>
        <div className="project-feature-grid">
          {CAPABILITIES.map((item) => <div className="project-feature-card" key={item}>{item}</div>)}
        </div>
      </Motion.div>

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Safety By Design</h2>
        <ul className="project-learnings">
          {SAFETY.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Motion.div>

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Engineering Decisions</h2>
        <p>
          The interpreter uses a fixed grammar instead of an LLM. An explicit grammar
          makes behavior predictable, easier to audit, and easier to test before a
          destructive operation runs — and it lets every phrase map to one specific
          shell command or API endpoint, rather than having intent guessed. Parsing,
          execution, filesystem operations, HTTP handling, and safety policy are kept
          as separate modules.
        </p>
      </Motion.div>

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>Testing &amp; Limitations</h2>
        <p>
          The last verified Windows run completed 127 tests: 126 passed, 1 skipped —
          the skip requires symlink-creation privileges the test environment didn't
          have. GitHub tests run against synthetic responses, so the ordinary suite
          doesn't depend on GitHub.com or a developer token.
        </p>
        <ul className="project-learnings">
          {LIMITATIONS.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Motion.div>

      <Motion.div
        className="project-section-block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        viewport={revealViewport}
      >
        <h2>What's Next</h2>
        <p>
          None of these are commitments, just directions the project could take:
          portable directory transfers, recycle-bin integration, and tab completion
          generated directly from the grammar.
        </p>
      </Motion.div>
    </section>
  );
}

export default EnglishTerminalPage;
