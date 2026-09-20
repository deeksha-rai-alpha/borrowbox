import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../api/axios";
import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/ui/Loader";
import AdminNav from "../../components/admin/AdminNav";
import "./AdminDashboard.css";

const COLORS = ["#8b5cf6", "#f97316", "#16a34a", "#2563eb", "#d97706", "#dc2626", "#5b21b6", "#6e6b7a"];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
        setCharts(res.data.charts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) return <Loader label="Loading platform statistics..." />;

  const categoryData = charts.itemsByCategory.map((c) => ({ name: c._id, value: c.count }));
  const monthlyData = charts.borrowingsPerMonth.map((m) => ({
    name: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    borrowings: m.count,
  }));
  const mostBorrowedData = charts.mostBorrowedCategories.map((c) => ({ name: c._id, count: c.count }));

  return (
    <section className="section container">
      <h2>Admin dashboard</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        Platform-wide activity and statistics.
      </p>

      <AdminNav />

      <div className="grid grid-cols-4 bb-admin__stats">
        <StatCard label="Total Users" value={stats.totalUsers} tone="purple" />
        <StatCard label="Total Items" value={stats.totalItems} tone="orange" />
        <StatCard label="Active Borrowings" value={stats.activeBorrowings} />
        <StatCard label="Completed Borrowings" value={stats.completedBorrowings} tone="success" />
      </div>

      <div className="bb-admin__charts">
        <div className="bb-admin__chart-card">
          <h4>Items by category</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={95} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bb-admin__chart-card">
          <h4>Borrowings per month</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#eae7f0" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="borrowings" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bb-admin__chart-card bb-admin__chart-card--wide">
          <h4>Most borrowed categories</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mostBorrowedData}>
              <CartesianGrid stroke="#eae7f0" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
