import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaFileAlt } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import { EmptyState, Loader, PageHeader, StatusBadge } from "../components/ui";
import { formatDate } from "../utils/format";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/applications/my", { params: { limit: 100 } })
      .then(({ data }) => setApplications(data.applications || []))
      .catch((err) => setError(getErrorMessage(err, "Failed to load your applications.")))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () =>
      applications.reduce(
        (acc, app) => ({ ...acc, all: acc.all + 1, [app.status]: (acc[app.status] || 0) + 1 }),
        { all: 0, pending: 0, accepted: 0, rejected: 0 }
      ),
    [applications]
  );

  const visible = filter === "all" ? applications : applications.filter((app) => app.status === filter);

  return (
    <>
      <PageHeader
        title="My applications"
        subtitle="Track the status of every internship you have applied to."
        actions={
          <Link to="/student-dashboard" className="btn btn-primary">
            Browse internships
          </Link>
        }
      />

      {loading ? (
        <Loader label="Loading your applications…" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : applications.length === 0 ? (
        <div className="ic-card">
          <EmptyState
            icon={FaFileAlt}
            title="No applications yet"
            message="Start applying to internships and they will appear here."
            action={
              <Link to="/student-dashboard" className="btn btn-primary">
                Find internships
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Filter applications">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`filter-tab ${filter === value ? "active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className="filter-count">{counts[value] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ic-card list-card">
            {visible.length === 0 ? (
              <EmptyState icon={FaFileAlt} title={`No ${filter} applications`} />
            ) : (
              visible.map((app) => {
                const internship = app.internship;
                return (
                  <div key={app._id} className="list-row">
                    <span className="company-logo" aria-hidden="true">
                      {(internship?.company || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="list-row-main">
                      <p className="list-row-title">
                        {internship ? (
                          <Link to={`/internships/${internship._id}`}>{internship.title}</Link>
                        ) : (
                          "Internship no longer available"
                        )}
                      </p>
                      <p className="list-row-sub">
                        {[internship?.company, internship?.location, internship?.type]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="list-row-meta">
                      Applied {formatDate(app.appliedAt || app.createdAt)}
                    </span>
                    <div className="list-row-actions">
                      <StatusBadge status={app.status} />
                      {internship && (
                        <Link
                          to={`/internships/${internship._id}`}
                          className="btn btn-ghost btn-icon btn-sm"
                          aria-label={`View ${internship.title}`}
                        >
                          <FaChevronRight />
                        </Link>
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

export default Applications;
