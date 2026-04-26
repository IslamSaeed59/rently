const express = require("express");
const router = express.Router();
const {
  initiateChat,
  listConversations,
  listMessages,
  postMessage,
  adminListConversations,
} = require("../Controllers/Chat/ChatController");
const authMiddleware = require("../middleware/authMiddleware");

// All chat routes require authentication
router.use(authMiddleware);

router.post("/conversations", initiateChat);
router.get("/conversations", listConversations);
router.get("/admin/conversations", adminListConversations);
router.get("/conversations/:id/messages", listMessages);
router.post("/conversations/:id/messages", postMessage);

module.exports = router;
