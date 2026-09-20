import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { PROJECTS, FLAGSHIP_PROJECTS } from "../../data/projects";
import { ACTIVE_BUILDS } from "../../data/labData";
import { BUILD_LOG } from "../../data/buildLog";
import { ExternalLink } from "./CardActions";
import ProjectStudyVisual from "./ProjectStudyVisual";

// Preserve the complete original case-study prose, fetched only when opened.
const DETAILS = {
  "folder-structure-visualizer": lazy(() => import("../../pages/project-pages/FolderStructure")),
  "password-estimator": lazy(() => import("../../pages/project-pages/PasswordCrackEsti")),
  devtool: lazy(() => import("../../pages/project-pages/DevJTool")),
  "prompt-router": lazy(() => import("../../pages/project-pages/PromptRouterPage")),
};

export default function ExpandedProject({ project }) {
  const Detail = DETAILS[project.id];
  const current = ACTIVE_BUILDS.find((entry) => entry.id === project.id);
  const log = BUILD_LOG.filter((entry) => entry.projectId === project.id);
  const index = PROJECTS.indexOf(project);
  const next = FLAGSHIP_PROJECTS[(FLAGSHIP_PROJECTS.indexOf(project) + 1) % FLAGSHIP_PROJECTS.length];
  return (
    <article className="case-study">
      <div className="study-kicker micro"><span>{String(index + 1).padStart(2, "0")} / {project.category}</span><span>{project.status}</span></div>
      <h1 className="study-title" tabIndex={-1} data-route-heading>{project.title}</h1>
      <p className="study-summary">{project.summary}</p>
      <div className="study-links"><ExternalLink href={project.github}>View source</ExternalLink>{project.live && <ExternalLink href={project.live}>Open live project</ExternalLink>}</div>
      <ProjectStudyVisual project={project} />
      {project.problem && <div className="study-columns"><section><h2 className="micro">The problem</h2><p>{project.problem}</p></section><section><h2 className="micro">What I built</h2><p>{project.built}</p></section>{project.technicalNote && <section><h2 className="micro">Under the surface</h2><p>{project.technicalNote}</p></section>}</div>}
      <div className="tech-line"><span className="micro">Built with</span><p>{project.tech.join(" / ")}</p></div>
      {Detail ? <Suspense fallback={<p role="status">Opening project notes…</p>}><Detail embedded /></Suspense> : (
        <div className="study-notes">
          {current?.focus && <section><p className="micro">Current focus / {current.stage}</p><h2>On the workbench</h2><p>{current.focus}</p></section>}
          {log.map((entry) => <section key={entry.id}><p className="micro">{entry.date} {entry.year} / {entry.type}</p><h2>From the build log</h2><p>{entry.description}</p></section>)}
        </div>
      )}
      <Link className="next-project" to={next.internalRoute}><span className="micro">Next project</span><span>{next.shortTitle}</span><span className="arrow" aria-hidden="true">↗</span></Link>
    </article>
  );
}
