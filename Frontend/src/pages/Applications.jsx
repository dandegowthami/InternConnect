// src/pages/Applications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="container p-4">
      <h3>My Applications</h3>
      {apps.length === 0 && <p>No applications yet.</p>}
      <div className="list-group">
        {apps.map(app => (
          <div key={app._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{app.internship?.title}</strong>
              <div className="text-muted">{app.internship?.company} • {app.internship?.location}</div>
            </div>
            <div>
              <span className={`badge ${app.status === "shortlisted" ? "bg-warning" : app.status === "accepted" ? "bg-success" : app.status === "rejected" ? "bg-danger" : "bg-secondary"}`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
