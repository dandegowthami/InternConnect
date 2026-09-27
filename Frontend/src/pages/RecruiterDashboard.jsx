import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaPlus, FaTrash, FaUsers, FaChartLine } from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import { EmptyState, Loader, PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

function RecruiterDashboard() {
  const { notify } = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    API.get("/recruiter/internships", { params: { limit: 100 } })
      .then(({ data }) => setInternships(data.internships || []))
      .catch((err) => setError(getErrorMessage(err, "Failed to load your internships.")))
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = internships.reduce((sum, item) => sum + (item.applicationCount || 0), 0);
  const average = internships.length ? (totalApplicants / internships.length).toFixed(1) : "0";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/recruiter/internships/${toDelete._id}`);
      setInternships((current) => current.filter((item) => item._id !== toDelete._id));
      notify("Internship deleted.", "success");
      setToDelete(null);
    } catch (err) {
      notify(getErrorMessage(err, "Could not delete the internship."), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Recruiter overview"
        subtitle="Manage your internship postings and review applicants."
        actions={
          <Link to="/recruiter/post-internship" className="btn btn-primary">
            <FaPlus aria-hidden="true" /> Post internship
          </Link>
        }
      />

      <div className="stat-grid">
        <div className="stat-card ic-card">
          <span className="stat-icon">
            <FaBriefcase aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{internships.length}</span>
            <span className="stat-label">Active postings</span>
          </div>
        </div>
        <div className="stat-card ic-card">
          <span className="stat-icon success">
            <FaUsers aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{totalApplicants}</span>
            <span className="stat-label">Total applicants</span>
          </div>
        </div>
        <div className="stat-card ic-card">
          <span className="stat-icon info">
            <FaChartLine aria-hidden="true" />
          </span>
          <div>
            <span className="stat-value">{average}</span>
            <span className="stat-label">Applicants per posting</span>
          </div>
        </div>
      </div>

      <section className="ic-card">
        <div className="ic-card-header">
          <h2>Your internships</h2>
        </div>

        {loading ? (
          <Loader label="Loading internships…" />
        ) : error ? (
          <div className="ic-card-body">
            <div className="alert alert-danger mb-0">{error}</div>
          </div>
        ) : internships.length === 0 ? (
          <EmptyState
            icon={FaBriefcase}
            title="No internships posted yet"
            message="Post your first internship to start receiving applications."
            action={
              <Link to="/recruiter/post-internship" className="btn btn-primary">
                <FaPlus aria-hidden="true" /> Post internship
              </Link>
            }
          />
        ) : (
          <div className="ic-table-wrap">
            <table className="ic-table">
              <thead>
                <tr>
                  <th>Internship</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Applicants</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="cell-primary">{item.title}</div>
                      <div className="cell-secondary">
                        {item.company} · {item.location}
                      </div>
                    </td>
                    <td>{item.type || "—"}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span className="chip">{item.applicationCount || 0}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/recruiter/internships/${item._id}/applicants`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaUsers aria-hidden="true" /> Applicants
                        </Link>
                        <button
                          type="button"
                          className="btn btn-soft-danger btn-icon btn-sm"
                          onClick={() => setToDelete(item)}
                          aria-label={`Delete ${item.title}`}
                          title="Delete internship"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete internship?"
        message={`"${toDelete?.title}" and all of its applications will be permanently removed.`}
        confirmLabel="Delete"
        variant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

export default RecruiterDashboard;
