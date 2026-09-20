const BorrowRequest = require("../models/BorrowRequest");
const Item = require("../models/Item");
const { createNotification } = require("./notificationController");
const { asyncHandler } = require("../middleware/errorHandler");

// Checks the backend (not just React) for overlapping ACTIVE/ACCEPTED bookings (FR-11)
const hasDateConflict = async (itemId, startDate, endDate, excludeRequestId = null) => {
  const query = {
    item: itemId,
    status: { $in: ["ACCEPTED", "ACTIVE", "RETURN_PENDING"] },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  };
  if (excludeRequestId) query._id = { $ne: excludeRequestId };

  const conflict = await BorrowRequest.findOne(query);
  return !!conflict;
};

// @desc    Create a borrow request (FR-10)
// @route   POST /api/requests
// @access  Private
const createRequest = asyncHandler(async (req, res) => {
  const { item: itemId, startDate, endDate, message } = req.body;

  const item = await Item.findById(itemId);
  if (!item || item.isRemoved) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  if (item.owner.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot borrow your own item",
    });
  }

  if (item.status !== "Available") {
    return res.status(409).json({
      success: false,
      message: "Item is unavailable for the selected dates",
    });
  }

  const conflict = await hasDateConflict(itemId, startDate, endDate);
  if (conflict) {
    return res.status(409).json({
      success: false,
      message: "Item is unavailable for the selected dates",
    });
  }

  const request = await BorrowRequest.create({
    item: itemId,
    borrower: req.user._id,
    owner: item.owner,
    startDate,
    endDate,
    message,
  });

  await createNotification({
    userId: item.owner,
    type: "NEW_REQUEST",
    message: `${req.user.name} requested to borrow your item "${item.title}".`,
    relatedRequest: request._id,
  });

  res.status(201).json({ success: true, request });
});

// @desc    Get requests I sent (as borrower) (FR-14)
// @route   GET /api/requests/my
// @access  Private
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({ borrower: req.user._id })
    .populate("item", "title images status")
    .populate("owner", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// @desc    Get requests received (as owner) (FR-12)
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({ owner: req.user._id })
    .populate("item", "title images status")
    .populate("borrower", "name rating")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// Helper: loads a request and confirms the current user owns/borrowed it
const loadRequestOrFail = async (req, res, allowedField) => {
  const request = await BorrowRequest.findById(req.params.id).populate("item");
  if (!request) {
    res.status(404).json({ success: false, message: "Request not found" });
    return null;
  }
  if (request[allowedField].toString() !== req.user._id.toString()) {
    res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
    return null;
  }
  return request;
};

// @desc    Accept a request (FR-12, FR-13)
// @route   PUT /api/requests/:id/accept
// @access  Private (owner only)
const acceptRequest = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "owner");
  if (!request) return;

  if (request.status !== "REQUESTED") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  // Re-check for conflicts at the moment of acceptance
  const conflict = await hasDateConflict(
    request.item._id,
    request.startDate,
    request.endDate,
    request._id
  );
  if (conflict) {
    return res.status(409).json({
      success: false,
      message: "Item is unavailable for the selected dates",
    });
  }

  request.status = "ACCEPTED";
  await request.save();

  await Item.findByIdAndUpdate(request.item._id, { status: "Reserved" });

  // Auto-reject any other pending requests that now overlap
  const overlapping = await BorrowRequest.find({
    item: request.item._id,
    status: "REQUESTED",
    _id: { $ne: request._id },
    startDate: { $lt: request.endDate },
    endDate: { $gt: request.startDate },
  });
  for (const other of overlapping) {
    other.status = "REJECTED";
    await other.save();
  }

  await createNotification({
    userId: request.borrower,
    type: "REQUEST_ACCEPTED",
    message: `Your request for "${request.item.title}" has been accepted.`,
    relatedRequest: request._id,
  });

  res.status(200).json({ success: true, request });
});

// @desc    Reject a request (FR-12, FR-13)
// @route   PUT /api/requests/:id/reject
// @access  Private (owner only)
const rejectRequest = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "owner");
  if (!request) return;

  if (request.status !== "REQUESTED") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  request.status = "REJECTED";
  await request.save();

  await createNotification({
    userId: request.borrower,
    type: "REQUEST_REJECTED",
    message: `Your request for "${request.item.title}" has been rejected.`,
    relatedRequest: request._id,
  });

  res.status(200).json({ success: true, request });
});

// @desc    Borrower marks item as picked up / active
// @route   PUT /api/requests/:id/activate
// @access  Private (owner only, moves ACCEPTED -> ACTIVE)
const activateRequest = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "owner");
  if (!request) return;

  if (request.status !== "ACCEPTED") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  request.status = "ACTIVE";
  await request.save();
  await Item.findByIdAndUpdate(request.item._id, { status: "Borrowed" });

  res.status(200).json({ success: true, request });
});

// @desc    Borrower marks item as returned (FR-16, step 1-2)
// @route   PUT /api/requests/:id/return
// @access  Private (borrower only)
const markReturned = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "borrower");
  if (!request) return;

  if (request.status !== "ACTIVE") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  request.status = "RETURN_PENDING";
  await request.save();

  await createNotification({
    userId: request.owner,
    type: "RETURN_MARKED",
    message: `The borrower marked "${request.item.title}" as returned. Please confirm.`,
    relatedRequest: request._id,
  });

  res.status(200).json({ success: true, request });
});

// @desc    Owner confirms return (FR-16, step 3-5)
// @route   PUT /api/requests/:id/confirm-return
// @access  Private (owner only)
const confirmReturn = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "owner");
  if (!request) return;

  if (request.status !== "RETURN_PENDING") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  request.status = "COMPLETED";
  request.completedAt = new Date();
  await request.save();

  await Item.findByIdAndUpdate(request.item._id, { status: "Available" });

  await createNotification({
    userId: request.borrower,
    type: "RETURN_CONFIRMED",
    message: `The owner has confirmed the return of "${request.item.title}".`,
    relatedRequest: request._id,
  });

  res.status(200).json({ success: true, request });
});

// @desc    Borrower cancels their own pending request
// @route   PUT /api/requests/:id/cancel
// @access  Private (borrower only)
const cancelRequest = asyncHandler(async (req, res) => {
  const request = await loadRequestOrFail(req, res, "borrower");
  if (!request) return;

  if (request.status !== "REQUESTED") {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  request.status = "CANCELLED";
  await request.save();

  res.status(200).json({ success: true, request });
});

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  activateRequest,
  markReturned,
  confirmReturn,
  cancelRequest,
};
