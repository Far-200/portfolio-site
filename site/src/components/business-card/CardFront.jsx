import { IDENTITY } from "../../data/identity";

export default function CardFront({ onFlip }) {
  return (
    <div className="front-content">
      <div className="card-imprint">
        <span className="monogram">fk.</span>
        <span className="card-registration">
          <span className="micro">Personal interface / 01</span>
          <span className="micro registration-note" aria-hidden="true">Status / building</span>
        </span>
      </div>
      <div className="front-identity">
        <h1 tabIndex={-1} data-route-heading>{IDENTITY.name}</h1>
        <p className="front-role">{IDENTITY.role}</p>
      </div>
      <p className="front-line">{IDENTITY.line}</p>
      <div className="front-bottom">
        <span className="domain">{IDENTITY.domain}</span>
        <button className="flip-control" onClick={onFlip} aria-label="Flip card to selected work">Turn over <span className="arrow" aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}
