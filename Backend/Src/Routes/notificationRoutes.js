const express = require("express");
const router = express.Router();
const Notification = require("../Models/notifications/Notification");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.findByUserId(req.user.userId || req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.userId || req.user.id);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

module.exports = router;
