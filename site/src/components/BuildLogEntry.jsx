import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const MONTH_NUMBERS = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

function BuildLogEntry({ date, year, type, title, description, project }) {
  const internalRoute =
    typeof project?.internalRoute === "string" && project.internalRoute.trim()
      ? project.internalRoute
      : null;
  const dateTime = MONTH_NUMBERS[date]
    ? `${year}-${MONTH_NUMBERS[date]}`
    : year;
  const entryClass = `v4-log-entry${
    internalRoute ? " v4-log-entry--linked" : ""
  }`;

  return (
    <article className={entryClass}>
      <div className="v4-log-entry-meta">
        <time className="v4-log-entry-date" dateTime={dateTime}>
          {date}
        </time>
        <span className="v4-log-entry-type">{type}</span>
      </div>

      <div className="v4-log-entry-body">
        <h4 className="v4-log-entry-title">
          {internalRoute ? (
            <Link to={internalRoute} className="v4-log-entry-link">
              <span>{title}</span>
              <ArrowUpRight
                size={14}
                strokeWidth={2.25}
                className="v4-log-entry-arrow"
                aria-hidden="true"
              />
            </Link>
          ) : (
            title
          )}
        </h4>
        <p className="v4-log-entry-description">{description}</p>
      </div>
    </article>
  );
}

export default BuildLogEntry;
