import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaEnvelopeOpenText, FaLock, FaUser, FaUserGraduate } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";

const ROLES = [
  { value: "student", label: "Student", hint: "Find internships", icon: FaUserGraduate },
  { value: "recruiter", label: "Recruiter", hint: "Hire interns", icon: FaBuilding },
];

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      setRegisteredEmail(formData.email);
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <AuthLayout title="Check your inbox">
        <div className="auth-result">
          <div className="auth-result-icon info">
            <FaEnvelopeOpenText aria-hidden="true" />
          </div>
          <p>
            We sent a verification link to <strong>{registeredEmail}</strong>. Click the link within 30
            minutes to activate your account.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg w-100">
            Go to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with InternConnect in less than a minute."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="form-label">I am a</legend>
          <div className="role-picker">
            {ROLES.map(({ value, label, hint, icon: Icon }) => (
              <label key={value} className={`role-option ${formData.role === value ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={formData.role === value}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="role-option-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{hint}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="name" className="form-label">
            Full name
          </label>
          <div className="input-icon-group">
            <FaUser className="input-icon" aria-hidden="true" />
            <input
              id="name"
              type="text"
              name="name"
              className="form-control"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="input-icon-group">
            <FaEnvelope className="input-icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-icon-group">
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
