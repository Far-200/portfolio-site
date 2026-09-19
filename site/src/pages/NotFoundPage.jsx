import { Link, useLocation } from "react-router-dom";

function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <main className="page v4-notfound" aria-labelledby="notfound-title">
      <div className="section">
        <p className="v4-notfound-code">404</p>
        <h1 className="v4-notfound-title" id="notfound-title">
          Nothing here.
        </h1>
        <p className="v4-notfound-copy">
          <code>{pathname}</code> doesn&rsquo;t exist, or it moved. Try one of
          these instead.
        </p>
        <nav className="v4-notfound-links" aria-label="Site sections">
          <Link to="/">Home</Link>
          <Link to="/work">Work</Link>
          <Link to="/log">Log</Link>
          <Link to="/lab">Lab</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </main>
  );
}

export default NotFoundPage;
