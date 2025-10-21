import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="logo-circle">IC</span>
          <span className="ms-2 fw-bold fs-4 text-primary">InternConnect</span>
        </Link>

        {/* Center Links */}
        <ul className="navbar-nav mx-auto d-flex flex-row gap-4">
          <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
        </ul>

        {/* Right Buttons */}
        <div className="d-flex gap-3">
          <Link to="/login" className="btn btn-outline-primary">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
