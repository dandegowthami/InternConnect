import { Suspense, useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaBriefcase,
  FaEdit,
  FaFileAlt,
  FaPlusCircle,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaThLarge,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import API from "../api";
import { Avatar, Loader, Logo } from "./ui";
import ConfirmModal from "./ConfirmModal";
import { dashboardPathFor, getStoredUser, logout, updateStoredUser } from "../utils/auth";
import { NOTIFICATIONS_CHANGED } from "../utils/events";
import "../styles/layout.css";
import "../styles/dashboard.css";

const NAV = {
  student: [
    {
      heading: "Internships",
      items: [
        { to: "/student-dashboard", label: "Browse internships", icon: FaSearch, end: true },
        { to: "/applications", label: "My applications", icon: FaFileAlt },
        { to: "/my-internships", label: "My internships", icon: FaBriefcase },
      ],
    },
  ],
  recruiter: [
    {
      heading: "Recruiting",
      items: [
        { to: "/recruiter-dashboard", label: "Overview", icon: FaThLarge, end: true },
        { to: "/recruiter/post-internship", label: "Post internship", icon: FaPlusCircle },
      ],
    },
  ],
  admin: [
    {
      heading: "Administration",
      items: [{ to: "/admin-dashboard", label: "Overview", icon: FaShieldAlt, end: true }],
    },
  ],
};

const ACCOUNT_ITEMS = [
  { to: "/notifications", label: "Notifications", icon: FaBell, badge: true },
  { to: "/view-profile", label: "My profile", icon: FaUser },
  { to: "/edit-profile", label: "Edit profile", icon: FaEdit },
];

function DashboardLayout() {
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data.user);
      updateStoredUser(data.user);
      return data.user;
    } catch {
      return null;
    }
  }, []);

  const refreshUnread = useCallback(async () => {
    try {
      const { data } = await API.get("/notifications", { params: { limit: 1 } });
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    refreshUnread();
    window.addEventListener(NOTIFICATIONS_CHANGED, refreshUnread);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, refreshUnread);
  }, [refreshUser, refreshUnread]);

  const role = user?.role || "student";
  const sections = NAV[role] || NAV.student;
  const closeSidebar = () => setSidebarOpen(false);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className={`dashboard-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="sidebar" aria-label="Dashboard navigation">
        <div className="sidebar-header">
          <Logo to={dashboardPathFor(role)} />
          <button
            type="button"
            className="btn btn-ghost btn-icon sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div className="sidebar-section" key={section.heading}>
              <p className="sidebar-heading">{section.heading}</p>
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="sidebar-link" onClick={closeSidebar}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          <div className="sidebar-section">
            <p className="sidebar-heading">Account</p>
            {ACCOUNT_ITEMS.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} className="sidebar-link" onClick={closeSidebar}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {badge && unreadCount > 0 && <span className="sidebar-badge">{unreadCount}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-link sidebar-logout"
            onClick={() => setConfirmLogout(true)}
          >
            <FaSignOutAlt aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />

      <div className="dashboard-body">
        <header className="topbar">
          <button
            type="button"
            className="btn btn-ghost btn-icon topbar-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <p className="topbar-greeting">
            Welcome back, <strong>{firstName}</strong>
          </p>

          <div className="topbar-actions">
            <Link
              to="/notifications"
              className={`btn btn-ghost btn-icon topbar-bell ${location.pathname === "/notifications" ? "active" : ""}`}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <FaBell />
              {unreadCount > 0 && <span className="bell-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </Link>
            <Link to="/view-profile" className="topbar-user">
              <Avatar user={user} size="sm" />
              <span className="topbar-user-text">
                <span className="topbar-user-name">{user?.name || "User"}</span>
                <span className="topbar-user-role">{role}</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="dashboard-main">
          <Suspense fallback={<Loader page />}>
            <Outlet context={{ user, refreshUser, refreshUnread }} />
          </Suspense>
        </main>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Log out?"
        message="You will need to sign in again to access your dashboard."
        confirmLabel="Log out"
        variant="danger"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}

export default DashboardLayout;
