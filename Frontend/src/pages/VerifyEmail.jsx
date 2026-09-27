import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import { Loader } from "../components/ui";

function VerifyEmail() {
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", message: "" });
  const requested = useRef(false);

  useEffect(() => {
    // Tokens are single-use, so guard against React StrictMode's double effect run
    if (requested.current) return;
    requested.current = true;

    API.get(`/auth/verify-email/${token}`)
      .then(({ data }) => setState({ status: "success", message: data.message }))
      .catch((err) =>
        setState({
          status: "error",
          message: getErrorMessage(err, "This verification link is invalid or has expired."),
        })
      );
  }, [token]);

  if (state.status === "loading") {
    return (
      <AuthLayout title="Verifying your email">
        <Loader label="Please wait while we verify your account…" />
      </AuthLayout>
    );
  }

  const success = state.status === "success";

  return (
    <AuthLayout title={success ? "Email verified" : "Verification failed"}>
      <div className="auth-result">
        <div className={`auth-result-icon ${success ? "success" : "error"}`}>
          {success ? <FaCheck aria-hidden="true" /> : <FaTimes aria-hidden="true" />}
        </div>
        <p>{state.message}</p>
        {success ? (
          <Link to="/login?verified=true" className="btn btn-primary btn-lg w-100">
            Continue to sign in
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary btn-lg w-100">
            Register again
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
