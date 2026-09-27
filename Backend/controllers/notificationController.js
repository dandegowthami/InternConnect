import Notification from "../models/Notification.js";

// @desc    Notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.unreadOnly === "true") filter.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount,
      success: true,
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification, success: true });
  } catch (err) {
    console.error("Mark notification read error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid notification ID" });
    }
    res.status(500).json({ message: "Server error", success: false });
  }
};

// @desc    Mark all of the user's notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ updated: result.modifiedCount, success: true });
  } catch (err) {
    console.error("Mark all notifications read error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};
