// backend/controllers/notificationController.js
import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
