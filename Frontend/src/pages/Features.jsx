import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaBuilding,
  FaClipboardList,
  FaCalendarCheck,
  FaChartLine,
  FaIdBadge,
  FaSearch,
  FaShieldAlt,
  FaTools,
  FaUserGraduate,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import "../styles/public.css";

const GROUPS = [
  {
    title: "For students",
    icon: FaUserGraduate,
    items: [
      {
        icon: FaIdBadge,
        title: "Student profiles",
        text: "Showcase your education, skills, interests and resume in one place.",
      },
      {
        icon: FaSearch,
        title: "Internship search",
        text: "Find openings from registered companies with instant search.",
      },
      {
        icon: FaCalendarCheck,
        title: "Application tracking",
        text: "Follow every application from pending to accepted in real time.",
      },
    ],
  },
  {
    title: "For recruiters",
    icon: FaBuilding,
    items: [
      {
        icon: FaClipboardList,
        title: "Company postings",
        text: "Publish internships with location, duration, stipend and required skills.",
      },
      {
        icon: FaBriefcase,
        title: "Manage openings",
        text: "Keep all your active internships and applicant counts in one dashboard.",
      },
      {
        icon: FaUsers,
        title: "Review applicants",
        text: "View candidate profiles, download resumes and accept or decline instantly.",
      },
    ],
  },
  {
    title: "For administrators",
    icon: FaUserShield,
    items: [
      {
        icon: FaShieldAlt,
        title: "Secure access",
        text: "JWT authentication and email verification protect every account.",
      },
      {
        icon: FaChartLine,
        title: "Platform analytics",
        text: "Monitor users, internships and applications across the platform.",
      },
      {
        icon: FaTools,
        title: "Moderation tools",
        text: "Remove inappropriate users or postings to keep the platform healthy.",
      },
    ],
  },
];

function Features() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Features</span>
          <h1>Built for every step of the internship journey</h1>
          <p>
            From discovery to offer, InternConnect gives students, recruiters and admins the tools they need.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {GROUPS.map(({ title, icon: GroupIcon, items }) => (
            <div key={title} className="feature-group">
              <h2 className="feature-group-title">
                <GroupIcon aria-hidden="true" /> {title}
              </h2>
              <div className="feature-grid">
                {items.map(({ icon: Icon, title: itemTitle, text }) => (
                  <div key={itemTitle} className="feature-card ic-card ic-card-hover">
                    <div className="feature-icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3>{itemTitle}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Start using InternConnect today</h2>
              <p>It only takes a minute to create your account.</p>
            </div>
            <Link to="/register" className="btn btn-light btn-lg">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
