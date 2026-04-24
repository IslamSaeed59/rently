const pool = require("../../../Config/db");

const BookingBlackout = {
  create: async (blackoutData) => {
    const { product_id, start_datetime, end_datetime, rental_id } = blackoutData;

    const [result] = await pool.query(
      `INSERT INTO booking_blackout 
      (product_id, start_datetime, end_datetime, rental_id, status) 
      VALUES (?, ?, ?, ?, 'active')`,
      [product_id, start_datetime, end_datetime, rental_id || null],
    );
    return result.insertId;
  },

  findAllByProductId: async (productId, includeExpired = false) => {
    let query = "SELECT * FROM booking_blackout WHERE product_id = ?";
    const params = [productId];

    if (!includeExpired) {
      query += " AND status = 'active'";
    }

    query += " ORDER BY start_datetime ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  checkOverlap: async (productId, start, end) => {
    const [rows] = await pool.query(
      `SELECT * FROM booking_blackout 
       WHERE product_id = ? 
       AND status = 'active'
       AND (
         (start_datetime <= ? AND end_datetime >= ?) OR
         (start_datetime <= ? AND end_datetime >= ?) OR
         (start_datetime >= ? AND end_datetime <= ?)
       )`,
      [productId, start, start, end, end, start, end],
    );
    return rows.length > 0;
  },

  expireBlackout: async (id) => {
    const [result] = await pool.query(
      "UPDATE booking_blackout SET status = 'expired' WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  },

  deleteByRentalId: async (rentalId) => {
    const [result] = await pool.query(
      "DELETE FROM booking_blackout WHERE rental_id = ?",
      [rentalId],
    );
    return result.affectedRows > 0;
  },
};

module.exports = BookingBlackout;
