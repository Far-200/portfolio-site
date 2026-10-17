import { TbBrandGithub, TbBrandLinkedin } from "react-icons/tb";
import { FaXTwitter, FaRegFileLines, FaRegEnvelope } from "react-icons/fa6";
import { IDENTITY } from "../../data/identity";
import { useResumeChooser } from "../ResumeChooser";

export function ExternalLink({ href, children, className = "", ariaLabel }) {
  return <a className={`ink-link ${className}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}<span className="arrow" aria-hidden="true">↗</span></a>;
}

export default function CardActions() {
  const { open } = useResumeChooser();
  return (
    <nav className="card-actions" aria-label="Contact and profiles">
      <ExternalLink href={IDENTITY.github} ariaLabel="GitHub"><TbBrandGithub aria-hidden="true" /></ExternalLink>
      <ExternalLink href={IDENTITY.linkedin} ariaLabel="LinkedIn"><TbBrandLinkedin aria-hidden="true" /></ExternalLink>
      <ExternalLink href={IDENTITY.x} ariaLabel="X"><FaXTwitter aria-hidden="true" /></ExternalLink>
      <button className="ink-link" onClick={open} aria-label="Résumé"><FaRegFileLines aria-hidden="true" /><span className="arrow" aria-hidden="true">↗</span></button>
      <a className="ink-link" href={`mailto:${IDENTITY.email}`} aria-label="Email"><FaRegEnvelope aria-hidden="true" /><span className="arrow" aria-hidden="true">↗</span></a>
    </nav>
  );
}
