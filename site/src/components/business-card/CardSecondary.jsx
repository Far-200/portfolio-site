import { Link } from "react-router-dom";
import About from "../About";
import portrait from "../../assets/profile.jpg";
import { BUILD_LOG } from "../../data/buildLog";
import { ACTIVE_BUILDS, LAB_UTILITIES, LEARNING_FOCUS } from "../../data/labData";
import { getProjectBySlug } from "../../data/projects";
import { ExternalLink } from "./CardActions";

export function CardAbout() {
  return <div className="card-about"><About portrait={
    <figure className="about-portrait">
      <img src={portrait} alt="Farhaan Khan" width="800" height="800" decoding="async" />
      <figcaption><span className="micro">Farhaan Khan</span><span>Computer Science student</span></figcaption>
    </figure>
  } /></div>;
}

export function CardLog() {
  const years = [...new Set(BUILD_LOG.map((entry) => entry.year))];
  return (
    <article className="card-log"><p className="micro">A record of making things</p><h1 tabIndex={-1} data-route-heading>Build log<span className="ink-dot">.</span></h1><p className="surface-intro">Things changed, shipped, broken and learned.</p>
      {years.map((year) => <section className="log-year" key={year}><h2>{year}</h2><ol>{BUILD_LOG.filter((entry) => entry.year === year).map((entry) => {
        const project = getProjectBySlug(entry.projectId);
        return <li key={entry.id}><div className="log-date micro">{entry.date}<span>{entry.type}</span></div><div><h3>{project ? <Link className="ink-link" to={project.internalRoute}>{entry.title}<span className="arrow" aria-hidden="true">↗</span></Link> : entry.title}</h3><p>{entry.description}</p></div></li>;
      })}</ol></section>)}
      <Link className="ink-link" to="/lab">More from the workbench <span className="arrow" aria-hidden="true">↗</span></Link>
    </article>
  );
}

export function CardLab() {
  return (
    <article className="card-lab"><p className="micro">In progress / in practice</p><h1 tabIndex={-1} data-route-heading>On the workbench<span className="ink-dot">.</span></h1><p className="surface-intro">Builds in progress, things I’m learning, and smaller tools.</p>
      <section className="lab-section"><p className="micro lab-section-label">01 / Now</p><h2>Currently building</h2>{ACTIVE_BUILDS.map((build) => {
        const project = getProjectBySlug(build.id);
        return <article className="lab-entry" key={build.id}><div><span className="micro">{build.stage}</span><h3>{build.name}</h3></div><div><p>{build.summary}</p>{build.focus && <p className="muted">{build.focus}</p>}{build.tech.length > 0 && <p className="tech-copy">{build.tech.join(" / ")}</p>}<div className="study-links">{project && <Link className="ink-link" to={project.internalRoute}>Project notes <span className="arrow" aria-hidden="true">↗</span></Link>}{build.github && <ExternalLink href={build.github}>Source</ExternalLink>}</div></div></article>;
      })}</section>
      <section className="lab-section"><p className="micro lab-section-label">02 / Learning</p><h2>Learning, deliberately</h2><div className="study-columns">{LEARNING_FOCUS.map((group) => <div key={group.heading}><h3 className="micro">{group.heading}</h3><ul className="plain-list">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></section>
      <section className="lab-section lab-collection"><p className="micro lab-section-label">03 / Collection</p><h2>Smaller tools & experiments</h2>{LAB_UTILITIES.map((item) => <article className="lab-entry" key={item.id}><div>{item.stage && <span className="micro">{item.stage}</span>}<h3>{item.title}</h3></div><div><p>{item.summary}</p><div className="study-links">{item.internalRoute && <Link className="ink-link" to={item.internalRoute}>Project notes <span className="arrow" aria-hidden="true">↗</span></Link>}{item.github && <ExternalLink href={item.github}>Source</ExternalLink>}</div></div></article>)}</section>
    </article>
  );
}
