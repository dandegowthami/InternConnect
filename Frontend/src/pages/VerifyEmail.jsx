import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
          method: "GET",
        });

        if (res.ok) {
          setMessage("✅ Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login?verified=true");
          }, 3000);
        } else {
          const data = await res.text(); // If backend sends HTML
          setMessage("❌ Verification failed or expired.");
          console.error(data);
        }
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;
