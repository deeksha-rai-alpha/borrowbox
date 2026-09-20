import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../utils/helpers";
import "./Notifications.css";

const NOTIF_ICON = {
  NEW_REQUEST: "📥",
  REQUEST_ACCEPTED: "✅",
  REQUEST_REJECTED: "🚫",
  BORROW_ENDING_SOON: "⏰",
  RETURN_MARKED: "📦",
  RETURN_CONFIRMED: "🎉",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { liveNotification, clearLiveNotification } = useSocket() || {};

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // If a real-time notification arrives while this page is open, prepend it (FR-19)
  useEffect(() => {
    if (liveNotification) {
      setNotifications((prev) => [liveNotification, ...prev]);
      clearLiveNotification?.();
    }
  }, [liveNotification, clearLiveNotification]);

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader label="Loading notifications..." />;

  return (
    <section className="section container">
      <h2>Notifications</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Updates on your requests, lendings and returns.
      </p>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="You're all caught up." />
      ) : (
        <div className="bb-notif__list">
          {notifications.map((n) => (
            <Link
              to={n.relatedRequest ? "/requests" : "#"}
              key={n._id}
              className={`bb-notif__item ${!n.isRead ? "is-unread" : ""}`}
              onClick={() => !n.isRead && markRead(n._id)}
            >
              <span className="bb-notif__icon">{NOTIF_ICON[n.type] || "🔔"}</span>
              <span className="bb-notif__text">{n.message}</span>
              <span className="bb-notif__date text-muted">{formatDate(n.createdAt)}</span>
              {!n.isRead && <span className="bb-notif__dot" />}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Notifications;
