import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/Login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="card login-card shadow-lg">
        <div className="card-header bg-success text-center text-white">
          <h3>Reset Password</h3>
          <small>Enter your new password</small>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-info text-center">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn btn-success">
                Update Password
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
