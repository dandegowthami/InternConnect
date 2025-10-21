import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Home.css";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex flex-column align-items-center justify-content-center">
        <h1>
          Connect. <span className="highlight">Apply.</span>{" "}
          <span className="highlight-2">Succeed.</span>
        </h1>
        <p className="mt-3 hero-text">
          The complete internship management platform that connects students
          with opportunities, empowers recruiters to find talent, and gives
          administrators full control.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg me-3">
            Start Your Journey →
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
