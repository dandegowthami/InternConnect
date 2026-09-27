import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaEye,
  FaFileAlt,
  FaSearch,
  FaSyncAlt,
  FaTrash,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import { Avatar, EmptyState, Loader, PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

const ROLE_CLASS = { admin: "status-rejected", recruiter: "status-pending", student: "status-info" };

function AdminDashboard() {
  const { notify } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("users");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [pending, setPending] = useState(null); // { kind: "user" | "internship", item }
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const [statsRes, usersRes, internshipsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users", { params: { limit: 100 } }),
        API.get("/admin/internships"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setInternships(internshipsRes.data.internships || []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load admin data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          (!role || user.role === role) &&
          (!query || user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query))
      ),
    [users, role, query]
  );

  const filteredInternships = useMemo(
    () =>
      internships.filter(
        (item) =>
          !query ||
          [item.title, item.company, item.location, item.recruiter?.name]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query))
      ),
    [internships, query]
  );

  const handleDelete = async () => {
    const { kind, item } = pending;
    setDeleting(true);
    try {
      await API.delete(`/admin/${kind === "user" ? "users" : "internships"}/${item._id}`);
      notify(`${kind === "user" ? "User" : "Internship"} deleted.`, "success");
      setPending(null);
      await load();
    } catch (err) {
      notify(getErrorMessage(err, "Delete failed."), "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading admin dashboard…" page />;

  const statCards = stats
    ? [
        { label: "Total users", value: stats.totalUsers, icon: FaUsers, tone: "" },
        { label: "Students", value: stats.students, icon: FaUserGraduate, tone: "info" },
        { label: "Recruiters", value: stats.recruiters, icon: FaBuilding, tone: "warning" },
        { label: "Internships", value: stats.internships, icon: FaBriefcase, tone: "" },
        { label: "Applications", value: stats.applications, icon: FaFileAlt, tone: "info" },
        { label: "Accepted", value: stats.accepted, icon: FaCheckCircle, tone: "success" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        subtitle="Monitor platform activity and manage users and internships."
        actions={
          <button type="button" className="btn btn-light" onClick={load}>
            <FaSyncAlt aria-hidden="true" /> Refresh
          </button>
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stat-grid">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="stat-card ic-card">
            <span className={`stat-icon ${tone}`}>
              <Icon aria-hidden="true" />
            </span>
            <div>
              <span className="stat-value">{value ?? 0}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "users"}
            className={`filter-tab ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Users <span className="filter-count">{users.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "internships"}
            className={`filter-tab ${tab === "internships" ? "active" : ""}`}
            onClick={() => setTab("internships")}
          >
            Internships <span className="filter-count">{internships.length}</span>
          </button>
        </div>

        <div className="input-icon-group">
          <FaSearch className="input-icon" aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder={
              tab === "users" ? "Search by name or email" : "Search by title, company or recruiter"
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search"
          />
        </div>

        {tab === "users" && (
          <select
            className="form-select"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        )}
      </div>

      <section className="ic-card">
        {tab === "users" ? (
          filteredUsers.length === 0 ? (
            <EmptyState
              icon={FaUsers}
              title="No users found"
              message="Try a different search or role filter."
            />
          ) : (
            <div className="ic-table-wrap">
              <table className="ic-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar user={user} size="sm" />
                          <div>
                            <div className="cell-primary">{user.name}</div>
                            <div className="cell-secondary">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${ROLE_CLASS[user.role] || "status-neutral"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${user.emailVerified ? "status-accepted" : "status-neutral"}`}
                        >
                          {user.emailVerified ? "verified" : "unverified"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-soft-danger btn-icon btn-sm"
                          onClick={() => setPending({ kind: "user", item: user })}
                          disabled={user.role === "admin"}
                          aria-label={`Delete ${user.name}`}
                          title={user.role === "admin" ? "Admins cannot be deleted" : "Delete user"}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredInternships.length === 0 ? (
          <EmptyState icon={FaBriefcase} title="No internships found" message="Try a different search." />
        ) : (
          <div className="ic-table-wrap">
            <table className="ic-table">
              <thead>
                <tr>
                  <th>Internship</th>
                  <th>Recruiter</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="cell-primary">{item.title}</div>
                      <div className="cell-secondary">
                        {item.company} · {item.location}
                      </div>
                    </td>
                    <td>
                      <div>{item.recruiter?.name || "Unknown"}</div>
                      {item.recruiter?.email && <div className="cell-secondary">{item.recruiter.email}</div>}
                    </td>
                    <td>
                      <span className="chip">{item.applicationCount || 0}</span>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/internships/${item._id}`}
                          className="btn btn-light btn-icon btn-sm"
                          aria-label={`View ${item.title}`}
                          title="View internship"
                        >
                          <FaEye />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-soft-danger btn-icon btn-sm"
                          onClick={() => setPending({ kind: "internship", item })}
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
        open={Boolean(pending)}
        title={pending?.kind === "user" ? "Delete user?" : "Delete internship?"}
        message={
          pending?.kind === "user"
            ? `${pending.item.name} and all of their data (applications, postings, notifications) will be permanently removed.`
            : `"${pending?.item.title}" and all of its applications will be permanently removed.`
        }
        confirmLabel="Delete"
        variant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />
    </>
  );
}

export default AdminDashboard;
