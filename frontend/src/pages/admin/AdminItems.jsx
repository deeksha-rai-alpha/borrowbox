import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminNav from "../../components/admin/AdminNav";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { itemStatusMeta, getErrorMessage } from "../../utils/helpers";
import "./AdminTables.css";

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/items");
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async () => {
    setActionLoading(true);
    try {
      await api.put(`/admin/items/${removeTarget._id}/remove`);
      setItems((prev) => prev.map((i) => (i._id === removeTarget._id ? { ...i, isRemoved: true } : i)));
      setRemoveTarget(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader label="Loading items..." />;

  return (
    <section className="section container">
      <h2>Items</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        {items.length} listed {items.length === 1 ? "item" : "items"} across the platform.
      </p>

      <AdminNav />

      <div className="bb-admintable">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = itemStatusMeta(item.status);
              return (
                <tr key={item._id} className={item.isRemoved ? "is-removed" : ""}>
                  <td>
                    <Link to={`/item/${item._id}`} className="bb-admintable__item">
                      {item.title}
                    </Link>
                  </td>
                  <td className="text-muted">{item.owner?.name}</td>
                  <td className="text-muted">{item.category}</td>
                  <td>
                    {item.isRemoved ? (
                      <Badge tone="danger">Removed</Badge>
                    ) : (
                      <Badge tone={status.tone}>{status.label}</Badge>
                    )}
                  </td>
                  <td>
                    {!item.isRemoved && (
                      <Button variant="danger" size="sm" onClick={() => setRemoveTarget(item)}>
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Remove item">
        <p className="text-muted" style={{ marginBottom: "1.25rem" }}>
          Remove "{removeTarget?.title}" for violating platform guidelines? It will be hidden from
          Browse immediately.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setRemoveTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleRemove} disabled={actionLoading}>
            {actionLoading ? "Removing..." : "Remove item"}
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default AdminItems;
