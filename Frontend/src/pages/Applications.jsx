import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/Applications.css";

function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApps(res.data);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="applications-page">
      <div className="container py-5">
        <h2 className="text-center mb-4 text-cyan">📄 My Applications</h2>

        {loading ? (
          <div className="text-center text-light">Loading applications...</div>
        ) : apps.length === 0 ? (
          <p className="text-center text-muted">You haven’t applied for any internships yet.</p>
        ) : (
          <div className="row justify-content-center">
            {apps.map((app) => (
              <div key={app._id} className="col-md-5 mb-4">
                <div className="application-card shadow-lg">
                  <div className="application-body">
                    <h5 className="application-title">{app.internship?.title}</h5>
                    <p className="application-company">
                      {app.internship?.company} • {app.internship?.location}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <small className="text-muted">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
