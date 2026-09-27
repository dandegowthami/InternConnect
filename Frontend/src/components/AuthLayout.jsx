import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Logo } from "./ui";
import "../styles/auth.css";

const HIGHLIGHTS = [
  "Discover internships matched to your skills",
  "Apply in one click with your saved resume",
  "Track every application in real time",
];

// Split-screen shell shared by login, register and password pages
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside" aria-hidden="true">
        <Logo light />
        <div className="auth-aside-content">
          <h2>Launch your career with the right internship.</h2>
          <p>Join thousands of students and recruiters building the next generation of talent.</p>
          <ul>
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <FaCheckCircle /> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-aside-footer">© {new Date().getFullYear()} InternConnect</p>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <div className="auth-mobile-logo">
            <Logo />
          </div>
          <Link to="/" className="auth-back">
            <FaArrowLeft aria-hidden="true" /> Back to home
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="auth-card-footer">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
