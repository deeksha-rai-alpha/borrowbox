const Review = require("../models/Review");
const BorrowRequest = require("../models/BorrowRequest");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Submit a review after a completed borrowing (FR-17)
// @route   POST /api/reviews
// @access  Private (borrower only)
const createReview = asyncHandler(async (req, res) => {
  const { borrowRequest: requestId, rating, comment } = req.body;

  const request = await BorrowRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ success: false, message: "Borrowing request not found" });
  }

  if (request.borrower.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  if (request.status !== "COMPLETED") {
    return res.status(400).json({
      success: false,
      message: "You cannot review an incomplete borrowing",
    });
  }

  const existing = await Review.findOne({ borrowRequest: requestId });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Borrowing request has already been processed",
    });
  }

  const review = await Review.create({
    item: request.item,
    borrowRequest: requestId,
    borrower: req.user._id,
    owner: request.owner,
    rating,
    comment,
  });

  // Recalculate the owner's average rating
  const ownerReviews = await Review.find({ owner: request.owner });
  const avg =
    ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length;

  await User.findByIdAndUpdate(request.owner, {
    "rating.average": Math.round(avg * 10) / 10,
    "rating.count": ownerReviews.length,
  });

  res.status(201).json({ success: true, review });
});

// @desc    Get all reviews for an item (FR-09)
// @route   GET /api/reviews/item/:itemId
// @access  Public
const getItemReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ item: req.params.itemId })
    .populate("borrower", "name profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

module.exports = { createReview, getItemReviews };
