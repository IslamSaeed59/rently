const pool = require("../../Config/db");

const Favorite = {
  add: async (userId, productId) => {
    const [result] = await pool.query(
      "INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)",
      [userId, productId]
    );
    return result.affectedRows > 0;
  },

  remove: async (userId, productId) => {
    const [result] = await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    return result.affectedRows > 0;
  },

  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      `SELECT f.*, p.name, p.description, p.location, p.price_per_day, p.price_per_hour, 
       (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as main_image
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?`,
      [userId]
    );
    return rows;
  },

  isFavorite: async (userId, productId) => {
    const [rows] = await pool.query(
      "SELECT id FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    return rows.length > 0;
  }
};

module.exports = Favorite;
