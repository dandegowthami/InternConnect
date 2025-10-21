import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Features.css";

function Features() {
  return (
    <div className="features-wrapper">
      {/* Back to Home Button (Top-Left) */}
      <Link to="/" className="btn btn-home">
        🏠 Back to Home
      </Link>

      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-light">
          🚀 Key Features of InternConnect
        </h2>

        {/* Student Features */}
        <section className="mb-5">
          <h3 className="text-center section-title">🎓 For Students</h3>
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-person-badge-fill"></i>
                </div>
                <h4>Student Profiles</h4>
                <p>Create and update resumes, showcase skills, and highlight achievements.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h4>Internship Search</h4>
                <p>Find internships from registered companies with filters and recommendations.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-calendar-check-fill"></i>
                </div>
                <h4>Application Tracking</h4>
                <p>Track your applications, schedules, and interview updates in real time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Features */}
        <section className="mb-5">
          <h3 className="text-center section-title">🏢 For Companies</h3>
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-building-check"></i>
                </div>
                <h4>Company Profiles</h4>
                <p>Register and showcase your company details, culture, and internship roles.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-briefcase-fill"></i>
                </div>
                <h4>Post Opportunities</h4>
                <p>Post internships, set requirements, and manage candidate applications easily.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h4>Review Applicants</h4>
                <p>Shortlist candidates, schedule interviews, and send notifications instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Features */}
        <section>
          <h3 className="text-center section-title">👨‍💼 For Admins</h3>
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h4>Secure Access</h4>
                <p>Ensure platform security with JWT authentication & email verification.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h4>Analytics & Reports</h4>
                <p>Track student placements, company participation, and system statistics.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card feature-card text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-tools"></i>
                </div>
                <h4>System Management</h4>
                <p>Manage users, roles, and maintain a smooth internship workflow.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Features;
