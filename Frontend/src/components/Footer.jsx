import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Logo } from "./ui";
import "../styles/layout.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              The internship platform that connects ambitious students with companies looking for fresh
              talent.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <ul>
              <li>
                <Link to="/internships">Browse internships</Link>
              </li>
              <li>
                <Link to="/companies">Companies</Link>
              </li>
              <li>
                <Link to="/features">Features</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/register">Create account</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
            <ul className="footer-contact">
              <li>
                <FaEnvelope aria-hidden="true" /> InternConnect2025@gmail.com
              </li>
              <li>
                <FaPhoneAlt aria-hidden="true" /> +91 93470 40601
              </li>
              <li>
                <FaMapMarkerAlt aria-hidden="true" /> India
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InternConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
