import React, { useContext } from "react";
import { InternshipContext } from "../context/InternshipContext";

function AppliedInternships() {
  const { internships, applications } = useContext(InternshipContext);
  const studentEmail = "student@example.com"; // mock logged-in student

  return (
    <div>
      <h3>My Applications</h3>
      <ul className="applied-list">
        {applications
          .filter((app) => app.studentEmail === studentEmail)
          .map((app) => {
            const internship = internships.find(
              (i) => i.id === app.internshipId
            );
            return (
              <li key={app.internshipId} className={`status-${app.status.toLowerCase()}`}>
                <b>{internship?.title}</b> - {internship?.company}  
                <span className="status-badge">{app.status}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default AppliedInternships;
