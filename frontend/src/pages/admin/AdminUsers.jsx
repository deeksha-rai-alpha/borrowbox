import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNav from "../../components/admin/AdminNav";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { getInitials, formatDate, getErrorMessage } from "../../utils/helpers";
import "./AdminTables.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSuspend = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/admin/users/${id}/suspend`);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader label="Loading users..." />;

  return (
    <section className="section container">
      <h2>Users</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        {users.length} registered {users.length === 1 ? "user" : "users"}.
      </p>

      <AdminNav />

      <div className="bb-admintable">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="bb-admintable__user">
                    <span className="bb-admintable__avatar">
                      {u.profileImage?.url ? (
                        <img src={u.profileImage.url} alt={u.name} />
                      ) : (
                        getInitials(u.name)
                      )}
                    </span>
                    {u.name}
                  </div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <Badge tone={u.role === "admin" ? "purple" : "info"}>{u.role}</Badge>
                </td>
                <td className="text-muted">{formatDate(u.createdAt)}</td>
                <td>
                  <Badge tone={u.isSuspended ? "danger" : "success"}>
                    {u.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </td>
                <td>
                  {u.role !== "admin" && (
                    <Button
                      variant={u.isSuspended ? "outline" : "danger"}
                      size="sm"
                      disabled={actionLoading === u._id}
                      onClick={() => toggleSuspend(u._id)}
                    >
                      {actionLoading === u._id ? "..." : u.isSuspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;
