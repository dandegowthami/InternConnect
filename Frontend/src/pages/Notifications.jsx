import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaExclamationTriangle,
  FaFileAlt,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import API, { getErrorMessage } from "../api";
import { EmptyState, Loader, PageHeader } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { emitNotificationsChanged } from "../utils/events";
import { timeAgo } from "../utils/format";

const ICONS = {
  success: FaCheck,
  warning: FaExclamationTriangle,
  alert: FaExclamationTriangle,
  error: FaTimesCircle,
  application: FaFileAlt,
};

function Notifications() {
  const { notify } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/notifications", { params: { limit: 100 } })
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch((err) => setError(getErrorMessage(err, "Failed to load notifications.")))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const visible = filter === "unread" ? notifications.filter((item) => !item.read) : notifications;

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((current) =>
        current.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
      emitNotificationsChanged();
    } catch (err) {
      notify(getErrorMessage(err, "Could not update notification."), "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      emitNotificationsChanged();
      notify("All notifications marked as read.", "success");
    } catch (err) {
      notify(getErrorMessage(err, "Could not update notifications."), "error");
    }
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
            : "You're all caught up."
        }
        actions={
          unreadCount > 0 && (
            <button type="button" className="btn btn-light" onClick={markAllAsRead}>
              <FaCheckDouble aria-hidden="true" /> Mark all as read
            </button>
          )
        }
      />

      {loading ? (
        <Loader label="Loading notifications…" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Filter notifications">
              {[
                { value: "all", label: "All", count: notifications.length },
                { value: "unread", label: "Unread", count: unreadCount },
              ].map(({ value, label, count }) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`filter-tab ${filter === value ? "active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className="filter-count">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ic-card list-card">
            {visible.length === 0 ? (
              <EmptyState
                icon={FaBell}
                title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
                message="Important updates about your applications and account will appear here."
              />
            ) : (
              visible.map((item) => {
                const Icon = ICONS[item.type] || FaInfoCircle;
                return (
                  <div key={item._id} className={`notification-item ${item.read ? "" : "unread"}`}>
                    <span className={`notification-icon ${item.type || "info"}`}>
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="notification-body">
                      <p className="notification-title">
                        {!item.read && <span className="unread-dot" aria-label="Unread" />}
                        {item.title}
                      </p>
                      <p className="notification-message">{item.message}</p>
                      <span className="notification-time" title={new Date(item.createdAt).toLocaleString()}>
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    {!item.read && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => markAsRead(item._id)}
                        aria-label="Mark as read"
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
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

export default Notifications;
