import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ItemCard from "../components/ui/ItemCard";
import { CardSkeletonGrid } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { getErrorMessage } from "../utils/helpers";
import "./MyItems.css";

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/items/my/listings");
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

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/items/${deleteTarget._id}`);
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="section container">
      <div className="flex-between bb-myitems__header">
        <div>
          <h2>My items</h2>
          <p className="text-muted">Everything you've listed for borrowing.</p>
        </div>
        <Link to="/add-item">
          <Button variant="primary">+ Add item</Button>
        </Link>
      </div>

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="You haven't listed anything yet"
          description="List your first item and start lending to your community."
          action={
            <Link to="/add-item">
              <Button variant="primary">List an item</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="bb-myitems__card">
              <ItemCard item={item} />
              <div className="bb-myitems__actions">
                <Link to={`/edit-item/${item._id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(item)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete item">
        <p className="text-muted" style={{ marginBottom: "1.25rem" }}>
          Are you sure you want to delete "{deleteTarget?.title}"? This can't be undone.
        </p>
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "var(--fs-sm)", marginBottom: "1rem" }}>{error}</p>
        )}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default MyItems;
