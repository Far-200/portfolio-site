// TODO(user): implement manually.
//
// Props:
//   date         string        short month label, e.g. "SEP"
//   type         string        "BUILD" | "SHIP" | "FIX" | "LEARN" | "EXPERIMENT"
//   title        string        entry title
//   description  string        one or two sentences
//   project      object | null resolved projects.js record when the entry
//                               set a projectId, otherwise null
//
// This stub only exists so the app compiles — BuildLog.jsx renders it
// inside an <li>, once per src/data/buildLog.js entry. Replace the
// markup below with the real row. Optional CSS scaffolding already
// exists in src/styles/v4-build-log.css (.v4-log-entry,
// .v4-log-entry-date, .v4-log-entry-type, .v4-log-entry-body,
// .v4-log-entry-title, .v4-log-entry-description) if useful — nothing
// requires using it.
function BuildLogEntry({ date, type, title, description }) {
  return (
    <p>
      {date} · {type} · {title} — {description}
    </p>
  );
}

export default BuildLogEntry;
