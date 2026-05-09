const pool = require("../../Config/db");

const ProductReview = {
  create: async (reviewData) => {
    const { product_id, user_id, rating, comment } = reviewData;
    const [result] = await pool.query(
      "INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [product_id, user_id, rating, comment]
    );
    return result.insertId;
  },

  getByProductId: async (productId) => {
    const [rows] = await pool.query(
      `SELECT pr.*, u.Firstname, u.LastName, p.profile_image as user_image 
       FROM product_reviews pr 
       JOIN users u ON pr.user_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE pr.product_id = ? 
       ORDER BY pr.created_at DESC`,
      [productId]
    );
    return rows;
  },

  delete: async (id) => {
    await pool.query("DELETE FROM product_reviews WHERE id = ?", [id]);
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM product_reviews WHERE id = ?", [id]);
    return rows[0];
  }
};

module.exports = ProductReview;
