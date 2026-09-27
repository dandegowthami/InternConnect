import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Logo } from "./ui";
import { dashboardPathFor, getStoredUser, hasValidSession, logout } from "../utils/auth";
import "../styles/layout.css";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/internships", label: "Internships" },
  { to: "/companies", label: "Companies" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const signedIn = hasValidSession();
  const user = getStoredUser();
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav container" aria-label="Main navigation">
        <Logo />

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div id="site-menu" className={`site-menu ${open ? "open" : ""}`}>
          <ul className="site-links">
            {LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="site-link" onClick={close}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="site-actions">
            {signedIn ? (
              <>
                <Link to={dashboardPathFor(user?.role)} className="btn btn-primary" onClick={close}>
                  Dashboard
                </Link>
                <button type="button" className="btn btn-light" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={close}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={close}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
