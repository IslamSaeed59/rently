const pool = require("../../../Config/db");

const Chat = {
  // Find an existing conversation or create a new one
  findOrCreateConversation: async (senderId, receiverId, productId = null) => {
    // Check if conversation exists
    // We check both (sender, receiver) and (receiver, sender) combinations
    let query = `
      SELECT id FROM conversations 
      WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    `;
    let params = [senderId, receiverId, receiverId, senderId];

    if (productId) {
      query += " AND product_id = ?";
      params.push(productId);
    } else {
      query += " AND product_id IS NULL";
    }

    const [existing] = await pool.query(query, params);

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new conversation
    const [result] = await pool.query(
      "INSERT INTO conversations (sender_id, receiver_id, product_id) VALUES (?, ?, ?)",
      [senderId, receiverId, productId]
    );

    return result.insertId;
  },

  // Get all conversations for a user
  getConversations: async (userId) => {
    const query = `
      SELECT 
        c.*,
        p.name as product_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as product_image,
        u.Firstname as other_user_firstname,
        u.LastName as other_user_lastname,
        u.id as other_user_id,
        (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = FALSE AND sender_id != ?) as unread_count
      FROM conversations c
      LEFT JOIN products p ON c.product_id = p.id
      JOIN users u ON (c.sender_id = u.id OR c.receiver_id = u.id) AND u.id != ?
      WHERE c.sender_id = ? OR c.receiver_id = ?
      ORDER BY c.last_message_at DESC, c.created_at DESC
    `;
    const [rows] = await pool.query(query, [userId, userId, userId, userId]);
    return rows;
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const [rows] = await pool.query(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
      [conversationId]
    );
    return rows;
  },

  // Add a new message
  addMessage: async (conversationId, senderId, messageText) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert message
      const [result] = await connection.query(
        "INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)",
        [conversationId, senderId, messageText]
      );

      // Update last_message_at in conversation
      await connection.query(
        "UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?",
        [conversationId]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId, userId) => {
    await pool.query(
      "UPDATE messages SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE conversation_id = ? AND sender_id != ? AND is_read = FALSE",
      [conversationId, userId]
    );
  },

  // Get all conversations for admin
  getAllConversationsForAdmin: async () => {
    const query = `
      SELECT 
        c.*,
        p.name as product_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as product_image,
        u1.Firstname as sender_firstname, u1.LastName as sender_lastname,
        u2.Firstname as receiver_firstname, u2.LastName as receiver_lastname,
        (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      LEFT JOIN products p ON c.product_id = p.id
      JOIN users u1 ON c.sender_id = u1.id
      JOIN users u2 ON c.receiver_id = u2.id
      ORDER BY c.last_message_at DESC, c.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = Chat;
