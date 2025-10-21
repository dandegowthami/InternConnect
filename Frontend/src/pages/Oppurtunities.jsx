import React, { useContext, useState } from "react";
import { InternshipContext } from "../context/InternshipContext";

function Opportunities() {
  const { internships, applyInternship, applications, searchInternships } =
    useContext(InternshipContext);

  const [searchQuery, setSearchQuery] = useState("");
  const studentEmail = "student@example.com"; // mock logged-in student

  const filteredInternships = searchQuery
    ? searchInternships(searchQuery)
    : internships;

  return (
    <div>
      <h3>Available Internships</h3>
      <input
        type="text"
        placeholder="Search internships..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="card-list">
        {filteredInternships.length === 0 && <p>No internships found.</p>}
        {filteredInternships.map((internship) => (
          <div key={internship.id} className="card">
            <h4>{internship.title}</h4>
            <p>
              <b>{internship.company}</b> | {internship.location}
            </p>
            <p>{internship.description}</p>
            <button
              onClick={() => applyInternship(internship.id, studentEmail)}
              disabled={applications.some(
                (app) =>
                  app.internshipId === internship.id &&
                  app.studentEmail === studentEmail
              )}
            >
              {applications.some(
                (app) =>
                  app.internshipId === internship.id &&
                  app.studentEmail === studentEmail
              )
                ? "Applied"
                : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Opportunities;
