import { IDENTITY } from "../../data/identity";
import { useResumeChooser } from "../ResumeChooser";

export function ExternalLink({ href, children, className = "" }) {
  return <a className={`ink-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="arrow" aria-hidden="true">↗</span></a>;
}

export default function CardActions() {
  const { open } = useResumeChooser();
  return (
    <nav className="card-actions" aria-label="Contact and profiles">
      <ExternalLink href={IDENTITY.github}>GitHub</ExternalLink>
      <ExternalLink href={IDENTITY.linkedin}>LinkedIn</ExternalLink>
      <button className="ink-link" onClick={open}>Résumé<span className="arrow" aria-hidden="true">↗</span></button>
      <a className="ink-link" href={`mailto:${IDENTITY.email}`}>Email<span className="arrow" aria-hidden="true">↗</span></a>
    </nav>
  );
}
