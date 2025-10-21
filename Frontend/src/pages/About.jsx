import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/About.css";

function About() {
  return (
    <div className="about-wrapper">
      {/* Back to Home Button */}
      <Link to="/" className="btn btn-home">
        🏠 Back to Home
      </Link>

      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-light">ℹ️ About InternConnect</h2>

        <div className="row g-4">
          {/* Mission */}
          <div className="col-md-6">
            <div className="card about-card text-center p-4">
              <div className="about-icon">
                <i className="bi bi-bullseye"></i>
              </div>
              <h4>Our Mission</h4>
              <p>
                To connect students, companies, and admins in one digital platform that
                simplifies internship opportunities and streamlines management.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="col-md-6">
            <div className="card about-card text-center p-4">
              <div className="about-icon">
                <i className="bi bi-lightbulb-fill"></i>
              </div>
              <h4>Our Vision</h4>
              <p>
                To become the most trusted platform for internship management, empowering 
                students with real-world opportunities and companies with skilled talent.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="col-md-6">
            <div className="card about-card text-center p-4">
              <div className="about-icon">
                <i className="bi bi-hand-thumbs-up-fill"></i>
              </div>
              <h4>Why Choose InternConnect?</h4>
              <p>
                We provide verified student-company connections, secure logins, 
                email verifications, and real-time notifications to keep everything transparent.
              </p>
            </div>
          </div>

          {/* Workflow */}
          <div className="col-md-6">
            <div className="card about-card text-center p-4">
              <div className="about-icon">
                <i className="bi bi-diagram-3-fill"></i>
              </div>
              <h4>How It Works</h4>
              <p>
                Students sign up, companies post opportunities, admins monitor activities, 
                and our system connects the right talent with the right opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
