import { useEffect, useState } from "react";
import api from "../api/axios";
import Tabs from "../components/ui/Tabs";
import RequestCard from "../components/ui/RequestCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getErrorMessage } from "../utils/helpers";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "ongoing", label: "Ongoing" },
  { key: "history", label: "History" },
];

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/requests/received");
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

  const pending = requests.filter((r) => r.status === "REQUESTED");
  const ongoing = requests.filter((r) => ["ACCEPTED", "ACTIVE", "RETURN_PENDING"].includes(r.status));
  const history = requests.filter((r) => ["COMPLETED", "REJECTED", "CANCELLED"].includes(r.status));

  const visible = tab === "pending" ? pending : tab === "ongoing" ? ongoing : history;

  const runAction = async (id, action) => {
    setActionLoading(id);
    try {
      await api.put(`/requests/${id}/${action}`);
      fetchRequests();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const buildActions = (request) => {
    const loading = actionLoading === request._id;
    if (request.status === "REQUESTED") {
      return [
        { label: "Accept", variant: "primary", loading, onClick: () => runAction(request._id, "accept") },
        { label: "Reject", variant: "danger", loading, onClick: () => runAction(request._id, "reject") },
      ];
    }
    if (request.status === "ACCEPTED") {
      return [
        {
          label: "Mark as handed over",
          variant: "primary",
          loading,
          onClick: () => runAction(request._id, "activate"),
        },
      ];
    }
    if (request.status === "RETURN_PENDING") {
      return [
        {
          label: "Confirm return",
          variant: "primary",
          loading,
          onClick: () => runAction(request._id, "confirm-return"),
        },
      ];
    }
    return [];
  };

  if (loading) return <Loader label="Loading requests..." />;

  return (
    <section className="section container">
      <h2>Borrow requests</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Manage requests from people who want to borrow your items.
      </p>

      <Tabs
        tabs={[
          { ...TABS[0], count: pending.length },
          { ...TABS[1], count: ongoing.length },
          { ...TABS[2], count: history.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here"
          description="Requests from borrowers for your items will show up in this tab."
        />
      ) : (
        <div className="flex-col gap-4">
          {visible.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              personLabel="Borrower"
              personName={request.borrower?.name}
              actions={buildActions(request)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Requests;
