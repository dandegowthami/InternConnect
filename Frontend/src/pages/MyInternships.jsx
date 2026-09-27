import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaEnvelope } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import InternshipCard from "../components/InternshipCard";
import { EmptyState, Loader, PageHeader } from "../components/ui";

// Internships where the student's application was accepted
function MyInternships() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/applications/my", { params: { status: "accepted", limit: 100 } })
      .then(({ data }) => setApplications((data.applications || []).filter((app) => app.internship)))
      .catch((err) => setError(getErrorMessage(err, "Failed to load your internships.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="My internships" subtitle="Internships where your application has been accepted." />

      {loading ? (
        <Loader label="Loading your internships…" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : applications.length === 0 ? (
        <div className="ic-card">
          <EmptyState
            icon={FaBriefcase}
            title="No accepted internships yet"
            message="When a recruiter accepts one of your applications, it will show up here."
            action={
              <Link to="/applications" className="btn btn-primary">
                View my applications
              </Link>
            }
          />
        </div>
      ) : (
        <div className="internship-grid">
          {applications.map((app) => {
            const recruiterEmail = app.internship.recruiter?.email;
            return (
              <InternshipCard
                key={app._id}
                internship={{ ...app.internship, createdAt: app.updatedAt }}
                detailsTo={`/internships/${app.internship._id}`}
                action={
                  recruiterEmail ? (
                    <a href={`mailto:${recruiterEmail}`} className="btn btn-outline-primary btn-sm">
                      <FaEnvelope aria-hidden="true" /> Contact recruiter
                    </a>
                  ) : (
                    <span className="status-badge status-accepted">accepted</span>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default MyInternships;
