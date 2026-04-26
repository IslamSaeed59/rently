const Chat = require("../Models/Chat/Chat");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // User joins their own room to receive private notifications
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their private room`);
    });

    // User joins a specific conversation room
    socket.on("join_chat", (conversationId) => {
      socket.join(`chat_${conversationId}`);
      console.log(`User joined chat: ${conversationId}`);
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      const { conversation_id, sender_id, receiver_id, message_text } = data;
      
      try {
        // Save to database
        const messageId = await Chat.addMessage(conversation_id, sender_id, message_text);
        
        const messageData = {
          id: messageId,
          conversation_id,
          sender_id,
          message_text,
          created_at: new Date(),
          is_read: false
        };

        // Emit to the conversation room
        io.to(`chat_${conversation_id}`).emit("receive_message", messageData);

        // Also notify the receiver in their private room (for chat list updates)
        io.to(`user_${receiver_id}`).emit("new_notification", {
          type: "new_message",
          conversation_id,
          message_text
        });

      } catch (error) {
        console.error("Socket send_message error:", error);
      }
    });

    // Handle marking messages as read
    socket.on("read_messages", async (data) => {
      const { conversation_id, reader_id, sender_id } = data;
      try {
        await Chat.markAsRead(conversation_id, reader_id);
        // Notify the sender that their messages were read
        io.to(`user_${sender_id}`).emit("messages_read", { conversation_id });
      } catch (error) {
        console.error("Socket read_messages error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;
