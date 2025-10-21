import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Contact.css";

function Contact() {
  return (
    <div className="contact-wrapper">
      {/* Back to Home Button */}
      <Link to="/" className="btn btn-home">
        🏠 Back to Home
      </Link>

      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-light">📞 Contact InternConnect</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card contact-card text-center p-4 shadow-lg">
              <div className="contact-icon mb-3">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h4>Email</h4>
              <p>InternConnect2025@gmail.com</p>

              <div className="contact-icon mt-4 mb-3">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <h4>Phone</h4>
              <p>+91 9347040601</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
