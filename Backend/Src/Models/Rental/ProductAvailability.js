const pool = require("../../../Config/db");

const ProductAvailability = {
  upsert: async (availabilityData) => {
    const { product_id, date, available_hours } = availabilityData;

    const [result] = await pool.query(
      `INSERT INTO product_availability (product_id, date, available_hours) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE available_hours = VALUES(available_hours)`,
      [product_id, date, JSON.stringify(available_hours)],
    );
    return result.affectedRows > 0;
  },

  findByProductIdAndDate: async (productId, date) => {
    const [rows] = await pool.query(
      "SELECT * FROM product_availability WHERE product_id = ? AND date = ?",
      [productId, date],
    );
    if (rows.length === 0) return null;

    // MySQL JSON columns are usually returned as objects/arrays in mysql2
    // but if not, we handle it.
    const row = rows[0];
    if (typeof row.available_hours === "string") {
      row.available_hours = JSON.parse(row.available_hours);
    }
    return row;
  },

  findAllByProductId: async (productId, startDate, endDate) => {
    let query = "SELECT * FROM product_availability WHERE product_id = ?";
    const params = [productId];

    if (startDate) {
      query += " AND date >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND date <= ?";
      params.push(endDate);
    }

    query += " ORDER BY date ASC";

    const [rows] = await pool.query(query, params);
    return rows.map((row) => {
      if (typeof row.available_hours === "string") {
        row.available_hours = JSON.parse(row.available_hours);
      }
      return row;
    });
  },

  deleteByDate: async (productId, date) => {
    const [result] = await pool.query(
      "DELETE FROM product_availability WHERE product_id = ? AND date = ?",
      [productId, date],
    );
    return result.affectedRows > 0;
  },
};

module.exports = ProductAvailability;
