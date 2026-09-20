// Formats an ISO date string as "20 Sept 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Formats a date range as "20 Sept – 30 Sept" (matches the SRS example)
export const formatDateRange = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts = { day: "numeric", month: "short" };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

// Maps a BorrowRequest status to a badge color token + friendly label
export const statusMeta = (status) => {
  const map = {
    REQUESTED: { label: "Requested", tone: "warning" },
    ACCEPTED: { label: "Accepted", tone: "info" },
    REJECTED: { label: "Rejected", tone: "danger" },
    CANCELLED: { label: "Cancelled", tone: "danger" },
    ACTIVE: { label: "Active", tone: "purple" },
    RETURN_PENDING: { label: "Return Pending", tone: "warning" },
    COMPLETED: { label: "Completed", tone: "success" },
  };
  return map[status] || { label: status, tone: "info" };
};

// Maps item availability status to a badge color token
export const itemStatusMeta = (status) => {
  const map = {
    Available: { label: "Available", tone: "success" },
    Reserved: { label: "Reserved", tone: "warning" },
    Borrowed: { label: "Borrowed", tone: "danger" },
  };
  return map[status] || { label: status, tone: "info" };
};

// Returns initials from a full name, for avatar fallbacks
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Reads a friendly error message out of an Axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";
