import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { statusMeta, formatDate } from "../utils/helpers";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileRes, myRequests, receivedRequests] = await Promise.all([
          api.get(`/users/${user._id}`),
          api.get("/requests/my"),
          api.get("/requests/received"),
        ]);

        setStats(profileRes.data.stats);

        // Merge and sort the two lists by most recently updated, take 5
        const merged = [...myRequests.data.requests, ...receivedRequests.data.requests]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);
        setRecent(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading || !stats) return <Loader label="Loading your dashboard..." />;

  return (
    <section className="section container">
      <div className="flex-between bb-dash__header">
        <div>
          <h2>Welcome back, {user.name.split(" ")[0]}</h2>
          <p className="text-muted">Here's what's happening with your items.</p>
        </div>
        <Link to="/add-item">
          <Button variant="primary">+ List new item</Button>
        </Link>
      </div>

      <div className="grid grid-cols-4 bb-dash__stats">
        <StatCard label="Items Listed" value={stats.itemsListed} tone="purple" />
        <StatCard label="Items Lent" value={stats.itemsLent} tone="success" />
        <StatCard label="Items Borrowed" value={stats.itemsBorrowed} tone="orange" />
        <StatCard label="Average Rating" value={user.rating?.average > 0 ? `★ ${user.rating.average}` : "—"} />
      </div>

      <div className="bb-dash__activity">
        <h3>Recent activity</h3>
        {recent.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="List an item or browse to borrow something — your activity will show up here."
          />
        ) : (
          <div className="bb-dash__list">
            {recent.map((r) => {
              const s = statusMeta(r.status);
              return (
                <Link to={`/item/${r.item?._id}`} key={r._id} className="bb-dash__row">
                  <span className={`bb-dash__dot bb-dash__dot--${s.tone}`} />
                  <span className="bb-dash__row-text">
                    <strong>{r.item?.title}</strong> — {s.label}
                  </span>
                  <span className="text-muted">{formatDate(r.updatedAt)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
