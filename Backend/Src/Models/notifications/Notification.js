const db = require("../../../Config/db");

const Notification = {
  create: async (data) => {
    const { user_id, sender_id, type, message, related_id } = data;
    try {
      const [result] = await db.execute(
        `INSERT INTO notifications (user_id, sender_id, type, message, related_id) VALUES (?, ?, ?, ?, ?)`,
        [user_id, sender_id, type, message, related_id]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  findByUserId: async (userId) => {
    try {
      const [rows] = await db.execute(
        `SELECT n.*, u.Firstname as sender_name, p.profile_image as sender_image 
         FROM notifications n
         LEFT JOIN users u ON n.sender_id = u.id
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE n.user_id = ? 
         ORDER BY n.created_at DESC LIMIT 50`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      await db.execute(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async (userId) => {
    try {
      await db.execute(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
};

module.exports = Notification;
