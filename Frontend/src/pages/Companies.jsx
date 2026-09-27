import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../styles/public.css";

const COMPANIES = [
  { name: "TechNova", focus: "Frontend & Product Engineering", location: "Bengaluru" },
  { name: "Insight Labs", focus: "Data & Analytics", location: "Hyderabad" },
  { name: "BrightBridge", focus: "Marketing & Operations", location: "Mumbai" },
  { name: "CloudMint", focus: "Cloud Infrastructure", location: "Remote" },
];

function Companies() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Companies</span>
          <h1>Trusted by ambitious teams</h1>
          <p>Explore companies actively hiring interns through InternConnect.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid cols-4">
            {COMPANIES.map(({ name, focus, location }) => (
              <div key={name} className="company-card ic-card ic-card-hover">
                <span className="company-logo" aria-hidden="true">
                  {name.charAt(0)}
                </span>
                <h3>{name}</h3>
                <p>{focus}</p>
                <p className="d-flex align-items-center gap-2">
                  <FaMapMarkerAlt aria-hidden="true" /> {location}
                </p>
                <Link to="/internships" className="btn btn-outline-primary btn-sm">
                  View openings
                </Link>
              </div>
            ))}
          </div>

          <div className="cta-band mt-5">
            <div>
              <h2>Hiring interns?</h2>
              <p>Create a recruiter account and post your first internship in minutes.</p>
            </div>
            <Link to="/register" className="btn btn-light btn-lg">
              Post an internship
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Companies;
