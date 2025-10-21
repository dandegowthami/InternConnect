import React, { createContext, useState } from "react";

// Create the context
export const InternshipContext = createContext();

// Provider component
export const InternshipProvider = ({ children }) => {
  // All internships posted by recruiters
  const [internships, setInternships] = useState([]);

  // Student applications
  const [applications, setApplications] = useState([]);

  // Function to post new internship (by recruiter)
  const postInternship = (internship) => {
    const id = internships.length + 1; // simple ID
    setInternships([...internships, { ...internship, id }]);
  };

  // Function for students to apply to an internship
  const applyInternship = (internshipId, studentEmail) => {
    const alreadyApplied = applications.find(
      (app) => app.internshipId === internshipId && app.studentEmail === studentEmail
    );
    if (!alreadyApplied) {
      setApplications([...applications, { internshipId, studentEmail, status: "Pending" }]);
    }
  };

  // Search internships by title, company, or location
  const searchInternships = (query) => {
    return internships.filter(
      (i) =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.company.toLowerCase().includes(query.toLowerCase()) ||
        i.location.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <InternshipContext.Provider
      value={{
        internships,
        applications,
        postInternship,
        applyInternship,
        searchInternships,
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};
