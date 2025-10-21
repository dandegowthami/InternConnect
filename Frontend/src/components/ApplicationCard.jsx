import React from "react";

function ApplicationCard({ application }) {
  const { title, company, status } = application;
  const statusColor = status === "Accepted" ? "text-success" : status === "Rejected" ? "text-danger" : "text-warning";

  return (
    <div className="card application-card p-3 shadow-sm">
      <h5>{title}</h5>
      <p className="mb-2"><strong>Company:</strong> {company}</p>
      <p className={statusColor}><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default ApplicationCard;
