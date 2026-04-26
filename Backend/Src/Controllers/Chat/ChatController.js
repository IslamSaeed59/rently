const Chat = require("../../Models/Chat/Chat");

const initiateChat = async (req, res) => {
  try {
    const { receiver_id, product_id } = req.body;
    const sender_id = req.user.userId || req.user.id;

    if (!receiver_id) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (sender_id === parseInt(receiver_id)) {
      return res.status(400).json({ message: "You cannot start a conversation with yourself" });
    }

    const conversationId = await Chat.findOrCreateConversation(sender_id, receiver_id, product_id);
    res.status(200).json({ conversationId });
  } catch (error) {
    console.error("Initiate Chat Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listConversations = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const conversations = await Chat.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    console.error("List Conversations Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // Optional: Check if user is part of the conversation
    // For now we just fetch messages
    const messages = await Chat.getMessages(id);
    
    // Mark as read when opening the chat
    await Chat.markAsRead(id, userId);

    res.status(200).json(messages);
  } catch (error) {
    console.error("List Messages Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message_text } = req.body;
    const sender_id = req.user.userId || req.user.id;

    if (!message_text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const messageId = await Chat.addMessage(id, sender_id, message_text);
    res.status(201).json({ messageId, message_text, sender_id, created_at: new Date() });
  } catch (error) {
    console.error("Post Message Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminListConversations = async (req, res) => {
  try {
    if (req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const conversations = await Chat.getAllConversationsForAdmin();
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Admin List Conversations Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  initiateChat,
  listConversations,
  listMessages,
  postMessage,
  adminListConversations,
};
