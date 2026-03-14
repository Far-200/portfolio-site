import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-container nav-simple">
        <NavLink to="/" className="logo">
          FK
        </NavLink>

        <div className="nav-links-inline">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About
          </NavLink>

          <NavLink
            to="/skills"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Skills
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Projects
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
