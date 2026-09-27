import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBell,
  FaBolt,
  FaBullseye,
  FaChartLine,
  FaFileUpload,
  FaSearch,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import API from "../api";
import InternshipCard from "../components/InternshipCard";
import { dashboardPathFor, getStoredUser, hasValidSession } from "../utils/auth";
import "../styles/public.css";
import "../styles/dashboard.css";

const FEATURES = [
  {
    icon: FaBullseye,
    title: "Smart discovery",
    text: "Search by role, company or location and find internships that match your skills.",
  },
  {
    icon: FaBolt,
    title: "One-click applications",
    text: "Upload your resume once and apply to any opening instantly from your dashboard.",
  },
  {
    icon: FaBell,
    title: "Real-time updates",
    text: "Get notified the moment a recruiter reviews, accepts or declines your application.",
  },
  {
    icon: FaUsers,
    title: "Built for recruiters",
    text: "Post openings, review applicants and download resumes from a single workspace.",
  },
  {
    icon: FaChartLine,
    title: "Clear insights",
    text: "Track applications, acceptance rates and posting performance at a glance.",
  },
  {
    icon: FaUserCheck,
    title: "Verified accounts",
    text: "Email verification and secure sign-in keep the community trustworthy.",
  },
];

const STEPS = [
  {
    title: "Create your profile",
    text: "Sign up, verify your email and add your skills, education and resume.",
  },
  { title: "Apply to openings", text: "Browse curated internships and apply with a single click." },
  { title: "Get hired", text: "Track your status and hear back from recruiters directly on the platform." },
];

function Home() {
  const [latest, setLatest] = useState([]);
  const signedIn = hasValidSession();
  const user = getStoredUser();

  useEffect(() => {
    API.get("/internships/public")
      .then(({ data }) => setLatest(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setLatest([]));
  }, []);

  const primaryCta = signedIn
    ? { to: dashboardPathFor(user?.role), label: "Go to dashboard" }
    : { to: "/register", label: "Get started free" };

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Internships made simple</span>
            <h1>
              Find the internship that <span className="gradient-text">launches your career</span>
            </h1>
            <p className="hero-lead">
              InternConnect brings students and recruiters together on one platform — discover opportunities,
              apply in seconds and track every step of the hiring process.
            </p>
            <div className="hero-actions">
              <Link to={primaryCta.to} className="btn btn-primary btn-lg">
                {primaryCta.label} <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/internships" className="btn btn-light btn-lg">
                Browse internships
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>1-click</strong>
                <span>Applications</span>
              </div>
              <div>
                <strong>Real-time</strong>
                <span>Status updates</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Free for students</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <span className="company-logo">T</span>
              <div>
                <h3>Frontend Developer Intern</h3>
                <p>TechNova · Bengaluru</p>
              </div>
              <span className="status-badge status-accepted">accepted</span>
            </div>
            <div className="hero-card">
              <span className="company-logo">I</span>
              <div>
                <h3>Data Analyst Intern</h3>
                <p>Insight Labs · Hyderabad</p>
              </div>
              <span className="status-badge status-pending">pending</span>
            </div>
            <div className="hero-card">
              <span className="company-logo">C</span>
              <div>
                <h3>Cloud Engineering Intern</h3>
                <p>CloudMint · Remote</p>
              </div>
              <span className="status-badge status-info">new</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <h2>Everything you need to land an internship</h2>
            <p>Powerful tools for students and recruiters, designed to make hiring fast and transparent.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="feature-card ic-card">
                <div className="feature-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>How it works</h2>
            <p>Three simple steps from sign-up to your first offer.</p>
          </div>
          <div className="steps">
            {STEPS.map((step, index) => (
              <div key={step.title} className="step ic-card">
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section section-muted">
          <div className="container">
            <div className="section-heading">
              <h2>Latest opportunities</h2>
              <p>Fresh internships posted by recruiters on InternConnect.</p>
            </div>
            <div className="internship-grid">
              {latest.map((internship) => (
                <InternshipCard
                  key={internship._id}
                  internship={internship}
                  action={
                    <Link
                      to={signedIn ? `/internships/${internship._id}` : "/login"}
                      state={signedIn ? undefined : { from: `/internships/${internship._id}` }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View details
                    </Link>
                  }
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/internships" className="btn btn-light">
                <FaSearch aria-hidden="true" /> View all internships
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Ready to take the next step?</h2>
              <p>Create your free account and start applying today.</p>
            </div>
            <Link to={signedIn ? dashboardPathFor(user?.role) : "/register"} className="btn btn-light btn-lg">
              <FaFileUpload aria-hidden="true" /> {signedIn ? "Open dashboard" : "Create account"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
