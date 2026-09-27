import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = (
    <>
      Remembered it? <Link to="/login">Back to sign in</Link>
    </>
  );

  if (sent) {
    return (
      <AuthLayout title="Check your email" footer={backToLogin}>
        <div className="auth-result">
          <div className="auth-result-icon success">
            <FaPaperPlane aria-hidden="true" />
          </div>
          <p>
            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            The link expires in 1 hour.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your registered email and we'll send you a reset link."
      footer={backToLogin}
    >
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="input-icon-group">
            <FaEnvelope className="input-icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
