import { useEffect, useState } from "react";
import api from "../api/axios";
import Tabs from "../components/ui/Tabs";
import RequestCard from "../components/ui/RequestCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import ReviewModal from "../components/ui/ReviewModal";
import { getErrorMessage } from "../utils/helpers";

const TABS = [
  { key: "current", label: "Current" },
  { key: "previous", label: "Previous" },
];

const MyBorrowings = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("current");
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/requests/my");
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const current = requests.filter((r) =>
    ["REQUESTED", "ACCEPTED", "ACTIVE", "RETURN_PENDING"].includes(r.status)
  );
  const previous = requests.filter((r) => ["COMPLETED", "REJECTED", "CANCELLED"].includes(r.status));
  const visible = tab === "current" ? current : previous;

  const handleMarkReturned = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/requests/${id}/return`);
      fetchRequests();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/requests/${id}/cancel`);
      fetchRequests();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    setActionLoading(reviewTarget._id);
    try {
      await api.post("/reviews", { borrowRequest: reviewTarget._id, rating, comment });
      setReviewedIds((prev) => new Set(prev).add(reviewTarget._id));
      setReviewTarget(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const buildActions = (request) => {
    const actions = [];
    if (request.status === "REQUESTED") {
      actions.push({
        label: "Cancel request",
        variant: "danger",
        loading: actionLoading === request._id,
        onClick: () => handleCancel(request._id),
      });
    }
    if (request.status === "ACTIVE") {
      actions.push({
        label: "Mark as returned",
        variant: "primary",
        loading: actionLoading === request._id,
        onClick: () => handleMarkReturned(request._id),
      });
    }
    if (request.status === "COMPLETED" && !reviewedIds.has(request._id)) {
      actions.push({
        label: "Leave a review",
        variant: "outline",
        onClick: () => setReviewTarget(request),
      });
    }
    return actions;
  };

  if (loading) return <Loader label="Loading your borrowings..." />;

  return (
    <section className="section container">
      <h2>My borrowings</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Everything you've requested to borrow.
      </p>

      <Tabs
        tabs={[
          { ...TABS[0], count: current.length },
          { ...TABS[1], count: previous.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {visible.length === 0 ? (
        <EmptyState
          title={tab === "current" ? "No active borrowings" : "No past borrowings"}
          description="Browse items to request something to borrow."
        />
      ) : (
        <div className="flex-col gap-4">
          {visible.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              personLabel="Owner"
              personName={request.owner?.name}
              actions={buildActions(request)}
            />
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSubmit={handleReviewSubmit}
        itemTitle={reviewTarget?.item?.title}
        loading={actionLoading === reviewTarget?._id}
      />
    </section>
  );
};

export default MyBorrowings;
