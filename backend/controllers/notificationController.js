const Notification = require("../models/Notification");
const { emitToUser } = require("../socket/socketHandler");
const { asyncHandler } = require("../middleware/errorHandler");

// Reusable helper - creates a notification in MongoDB AND pushes it
// in real-time via Socket.IO if the user is online (FR-18, FR-19).
// Used by requestController and reviewController.
const createNotification = async ({ userId, type, message, relatedRequest }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    message,
    relatedRequest,
  });

  emitToUser(userId, "new-notification", notification);

  return notification;
};

// @desc    Get logged-in user's notifications (FR-18)
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.status(200).json({ success: true, notifications, unreadCount });
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ success: true, notification });
});

module.exports = { createNotification, getNotifications, markNotificationRead };
