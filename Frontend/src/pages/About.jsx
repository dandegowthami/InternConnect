import { Link } from "react-router-dom";
import { FaBullseye, FaHandshake, FaLightbulb, FaProjectDiagram } from "react-icons/fa";
import "../styles/public.css";

const PILLARS = [
  {
    icon: FaBullseye,
    title: "Our mission",
    text: "To connect students, companies and administrators on one digital platform that makes internship discovery and management effortless.",
  },
  {
    icon: FaLightbulb,
    title: "Our vision",
    text: "To become the most trusted internship platform — empowering students with real-world experience and companies with skilled talent.",
  },
  {
    icon: FaHandshake,
    title: "Why InternConnect",
    text: "Verified accounts, secure sign-in, email verification and real-time notifications keep every step transparent.",
  },
  {
    icon: FaProjectDiagram,
    title: "How it works",
    text: "Students build a profile, recruiters post opportunities, admins keep the platform healthy — and we connect the right people.",
  },
];

const STATS = [
  { value: "3", label: "User roles supported" },
  { value: "1-click", label: "Application flow" },
  { value: "24/7", label: "Access to opportunities" },
  { value: "Free", label: "For every student" },
];

function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About us</span>
          <h1>We help talent meet opportunity</h1>
          <p>
            InternConnect was built to remove the friction from finding and filling internships, for students
            and recruiters alike.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid cols-2">
            {PILLARS.map(({ icon: Icon, title, text }) => (
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

      <section className="section section-muted">
        <div className="container">
          <div className="stats-strip">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Have questions?</h2>
              <p>Our team is happy to help students and recruiters get started.</p>
            </div>
            <Link to="/contact" className="btn btn-light btn-lg">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
