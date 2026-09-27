import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import { dashboardPathFor, saveSession } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const notice = searchParams.get("verified")
    ? "Your email has been verified. You can sign in now."
    : searchParams.get("expired")
      ? "Your session has expired. Please sign in again."
      : searchParams.get("reset")
        ? "Your password has been updated. Sign in with your new password."
        : "";

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", formData);
      saveSession(data.token, data.user);

      const from = location.state?.from;
      navigate(from && from !== "/login" ? from : dashboardPathFor(data.user.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password"));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      {notice && !error && <div className="alert alert-success mb-4">{notice}</div>}
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
          <div className="input-icon-group has-action">
            <FaLock className="input-icon" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <span />
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
