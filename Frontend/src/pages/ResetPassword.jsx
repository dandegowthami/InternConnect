import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      navigate("/login?reset=true", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={<Link to="/login">Back to sign in</Link>}
    >
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
          {error.toLowerCase().includes("expired") && (
            <>
              {" "}
              <Link to="/forgot-password">Request a new link</Link>.
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="form-label">
            New password
          </label>
          <div className="input-icon-group">
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm password
          </label>
          <div className="input-icon-group">
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
