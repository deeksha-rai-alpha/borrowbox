const User = require("../models/User");
const Item = require("../models/Item");
const BorrowRequest = require("../models/BorrowRequest");
const cloudinary = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get platform-wide statistics for admin dashboard (FR-21)
// @route   GET /api/admin/stats
// @access  Private (admin only)
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalItems, activeBorrowings, completedBorrowings] =
    await Promise.all([
      User.countDocuments(),
      Item.countDocuments({ isRemoved: false }),
      BorrowRequest.countDocuments({ status: { $in: ["ACCEPTED", "ACTIVE", "RETURN_PENDING"] } }),
      BorrowRequest.countDocuments({ status: "COMPLETED" }),
    ]);

  // Items grouped by category
  const itemsByCategory = await Item.aggregate([
    { $match: { isRemoved: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Borrowings per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const borrowingsPerMonth = await BorrowRequest.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Most borrowed categories
  const mostBorrowedCategories = await BorrowRequest.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $lookup: {
        from: "items",
        localField: "item",
        foreignField: "_id",
        as: "itemInfo",
      },
    },
    { $unwind: "$itemInfo" },
    { $group: { _id: "$itemInfo.category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalItems,
      activeBorrowings,
      completedBorrowings,
    },
    charts: {
      itemsByCategory,
      borrowingsPerMonth,
      mostBorrowedCategories,
    },
  });
});

// @desc    View all users (FR-22)
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Suspend / unsuspend a user (FR-22)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (admin only)
const toggleSuspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(400).json({ success: false, message: "Cannot suspend an admin" });
  }

  user.isSuspended = !user.isSuspended;
  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    View all items (FR-23)
// @route   GET /api/admin/items
// @access  Private (admin only)
const getAllItemsAdmin = asyncHandler(async (req, res) => {
  const items = await Item.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: items.length, items });
});

// @desc    Remove an inappropriate item (FR-23)
// @route   PUT /api/admin/items/:id/remove
// @access  Private (admin only)
const removeItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  item.isRemoved = true;
  item.status = "Reserved"; // prevents further borrowing while hidden
  await item.save();

  res.status(200).json({ success: true, message: "Item removed successfully" });
});

module.exports = {
  getStats,
  getAllUsers,
  toggleSuspendUser,
  getAllItemsAdmin,
  removeItem,
};
