import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaFilePdf, FaTimes, FaUndo, FaUsers } from "react-icons/fa";
import API, { fileUrl, getErrorMessage } from "../api";
import { Avatar, EmptyState, Loader, PageHeader, StatusBadge } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

const FILTERS = ["all", "pending", "accepted", "rejected"];

function InternshipApplicants() {
  const { id } = useParams();
  const { notify } = useToast();
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    API.get(`/applications/${id}/applicants`, { params: { limit: 100 } })
      .then(({ data }) => {
        setInternship(data.internship);
        setApplications(data.applications || []);
      })
      .catch((err) => setError(getErrorMessage(err, "Failed to load applicants.")))
      .finally(() => setLoading(false));
  }, [id]);

  const counts = useMemo(
    () =>
      applications.reduce(
        (acc, app) => ({ ...acc, all: acc.all + 1, [app.status]: (acc[app.status] || 0) + 1 }),
        { all: 0, pending: 0, accepted: 0, rejected: 0 }
      ),
    [applications]
  );

  const visible = filter === "all" ? applications : applications.filter((app) => app.status === filter);

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await API.patch(`/applications/status/${applicationId}`, { status });
      setApplications((current) =>
        current.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
      notify(`Application marked as ${status}. The student has been notified.`, "success");
    } catch (err) {
      notify(getErrorMessage(err, "Failed to update status."), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader label="Loading applicants…" page />;

  return (
    <>
      <Link to="/recruiter-dashboard" className="back-link">
        <FaArrowLeft aria-hidden="true" /> Back to overview
      </Link>

      <PageHeader
        title={internship ? internship.title : "Applicants"}
        subtitle={internship ? `${internship.company} · ${internship.location}` : undefined}
      />

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : applications.length === 0 ? (
        <div className="ic-card">
          <EmptyState
            icon={FaUsers}
            title="No applicants yet"
            message="Applications will appear here as students apply."
          />
        </div>
      ) : (
        <>
          <div className="toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Filter applicants">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`filter-tab text-capitalize ${filter === value ? "active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {value}
                  <span className="filter-count">{counts[value] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ic-card list-card">
            {visible.length === 0 ? (
              <EmptyState icon={FaUsers} title={`No ${filter} applicants`} />
            ) : (
              visible.map((app) => {
                const student = app.student || {};
                const resume = app.resume || student.resume;
                const busy = updatingId === app._id;
                return (
                  <div key={app._id} className="applicant-row">
                    <div className="applicant-identity">
                      <Avatar user={student} />
                      <div>
                        <strong>{student.name || "Deleted user"}</strong>
                        {student.email && <a href={`mailto:${student.email}`}>{student.email}</a>}
                        <span>
                          {[student.education, student.yearOfPassing].filter(Boolean).join(" · ") ||
                            "Education not provided"}
                          {" · "}Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="applicant-skills chip-list">
                      {(app.skills?.length ? app.skills : student.skills || [])
                        .slice(0, 5)
                        .map((skill, index) => (
                          <span key={`${skill}-${index}`} className="chip chip-muted">
                            {skill}
                          </span>
                        ))}
                    </div>

                    <StatusBadge status={app.status} />

                    <div className="applicant-actions">
                      {resume && (
                        <a
                          href={fileUrl(resume)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-light btn-sm"
                          title="Open resume"
                        >
                          <FaFilePdf aria-hidden="true" /> Resume
                        </a>
                      )}
                      {app.status !== "accepted" && (
                        <button
                          type="button"
                          className="btn btn-soft-success btn-icon btn-sm"
                          onClick={() => updateStatus(app._id, "accepted")}
                          disabled={busy}
                          aria-label="Accept application"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {app.status !== "rejected" && (
                        <button
                          type="button"
                          className="btn btn-soft-danger btn-icon btn-sm"
                          onClick={() => updateStatus(app._id, "rejected")}
                          disabled={busy}
                          aria-label="Reject application"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      )}
                      {app.status !== "pending" && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => updateStatus(app._id, "pending")}
                          disabled={busy}
                          aria-label="Move back to pending"
                          title="Move back to pending"
                        >
                          <FaUndo />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
}

export default InternshipApplicants;
