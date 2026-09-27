import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUpload,
  FaUserTie,
} from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import { EmptyState, Loader, StatusBadge } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const { notify } = useToast();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    API.get(`/internships/${id}`)
      .then(({ data }) => setInternship(data))
      .catch((err) => setError(getErrorMessage(err, "Internship not found.")))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await API.post(`/applications/${id}/apply`);
      setInternship((current) => ({ ...current, applied: true, applicationStatus: "pending" }));
      notify("Application submitted successfully.", "success");
    } catch (err) {
      notify(getErrorMessage(err, "Failed to apply. Please try again."), "error");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader label="Loading internship…" page />;

  if (error || !internship) {
    return (
      <div className="ic-card">
        <EmptyState
          icon={FaBriefcase}
          title="Internship not available"
          message={error || "This internship may have been removed."}
          action={
            <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
              Go back
            </button>
          }
        />
      </div>
    );
  }

  const isStudent = user?.role === "student";
  const hasResume = Boolean(user?.resume);
  const facts = [
    { icon: FaMapMarkerAlt, label: "Location", value: internship.location },
    { icon: FaBriefcase, label: "Type", value: internship.type },
    { icon: FaClock, label: "Duration", value: internship.duration },
    { icon: FaRupeeSign, label: "Stipend", value: internship.stipend },
    { icon: FaCalendarAlt, label: "Posted", value: formatDate(internship.createdAt) },
  ].filter((fact) => fact.value);

  return (
    <>
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        <FaArrowLeft aria-hidden="true" /> Back
      </button>

      <div className="detail-grid">
        <article className="ic-card">
          <div className="detail-hero">
            <span className="company-logo" aria-hidden="true">
              {(internship.company || "C").charAt(0).toUpperCase()}
            </span>
            <div>
              <h1>{internship.title}</h1>
              <p>
                {internship.company}
                {internship.location ? ` · ${internship.location}` : ""}
              </p>
              {internship.applied && <StatusBadge status={internship.applicationStatus} />}
            </div>
          </div>

          <section className="detail-section">
            <h2>About this internship</h2>
            <p className="detail-description">{internship.description}</p>
          </section>

          {internship.skills?.length > 0 && (
            <section className="detail-section">
              <h2>Required skills</h2>
              <div className="chip-list">
                {internship.skills.map((skill, index) => (
                  <span key={`${skill}-${index}`} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="detail-aside">
          <div className="ic-card ic-card-body">
            {isStudent &&
              (internship.applied ? (
                <div className="mb-4">
                  <p className="fw-semibold mb-1">You have applied</p>
                  <p className="text-muted small mb-3">
                    Current status: <StatusBadge status={internship.applicationStatus} />
                  </p>
                  <Link to="/applications" className="btn btn-light btn-lg w-100">
                    View my applications
                  </Link>
                </div>
              ) : (
                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleApply}
                    disabled={applying || !hasResume}
                  >
                    {applying && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
                    {applying ? "Applying…" : "Apply now"}
                  </button>
                  {!hasResume && (
                    <p className="small text-muted mt-2 mb-0">
                      You need a resume to apply.{" "}
                      <Link to="/edit-profile">
                        <FaUpload aria-hidden="true" /> Upload resume
                      </Link>
                    </p>
                  )}
                </div>
              ))}

            <ul className="fact-list">
              {facts.map(({ icon: Icon, label, value }) => (
                <li key={label}>
                  <span className="fact-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {internship.recruiter?.name && (
            <div className="ic-card ic-card-body">
              <ul className="fact-list">
                <li>
                  <span className="fact-icon">
                    <FaUserTie aria-hidden="true" />
                  </span>
                  <div>
                    <small>Posted by</small>
                    <strong>{internship.recruiter.name}</strong>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export default InternshipDetail;
