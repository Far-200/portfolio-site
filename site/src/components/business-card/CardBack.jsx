import { Link } from "react-router-dom";
import { FLAGSHIP_PROJECTS } from "../../data/projects";
import { ACTIVE_BUILDS } from "../../data/labData";
import CardActions from "./CardActions";

export default function CardBack({ onFlip }) {
  const workbench = ACTIVE_BUILDS.find((build) => !FLAGSHIP_PROJECTS.some((project) => project.id === build.id));
  return (
    <div className="back-content">
      <header className="back-heading"><h1 className="micro" tabIndex={-1} data-route-heading>Selected work</h1><span className="micro">FK / 01—03</span></header>
      <nav className="project-index" aria-label="Selected projects">
        {FLAGSHIP_PROJECTS.map((project, i) => (
          <Link key={project.id} to={project.internalRoute} data-return={project.internalRoute} className="project-row">
            <span className="project-number">0{i + 1}</span><span className="project-row-title">{project.shortTitle}</span><span className="arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
      <Link to="/lab" data-return="/lab" className="currently-building">
        <span className="status-dot" aria-hidden="true" />
        <span><span className="micro">On the workbench</span><span>{workbench ? <>{workbench.name} <span className="muted">/ {workbench.stage}</span></> : "Builds, learning & experiments"}</span></span>
        <span className="arrow" aria-hidden="true">↗</span>
      </Link>
      <CardActions />
      <div className="back-bottom"><nav aria-label="More about Farhaan"><Link className="ink-link" data-return="/about" to="/about">About</Link><Link className="ink-link" data-return="/log" to="/log">Build log</Link></nav><button className="flip-control" onClick={onFlip} aria-label="Flip card to identity">Turn back <span className="arrow" aria-hidden="true">↶</span></button></div>
    </div>
  );
}
