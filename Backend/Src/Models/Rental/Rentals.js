const pool = require("../../../Config/db");

const Rental = {
  create: async (rentalData) => {
    const {
      product_id,
      buyer_id,
      start_datetime,
      end_datetime,
      rental_type,
      total_price,
      deposit_paid,
      notes,
      rental_request_id,
      payment_method,
      payment_status,
    } = rentalData;

    const [result] = await pool.query(
      `INSERT INTO rentals 
      (product_id, buyer_id, start_datetime, end_datetime, rental_type, total_price, deposit_paid, notes, rental_request_id, payment_method, payment_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id,
        buyer_id,
        start_datetime,
        end_datetime,
        rental_type,
        total_price,
        deposit_paid || 0,
        notes || null,
        rental_request_id || null,
        payment_method,
        payment_status || "pending",
      ],
    );
    return result.insertId;
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT r.*, p.name as product_name, p.seller_id,
             CONCAT(b.Firstname, ' ', b.LastName) as buyer_name,
             CONCAT(s.Firstname, ' ', s.LastName) as seller_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN users b ON r.buyer_id = b.id
      JOIN users s ON p.seller_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.seller_id) {
      query += " AND p.seller_id = ?";
      params.push(filters.seller_id);
    }

    if (filters.buyer_id) {
      query += " AND r.buyer_id = ?";
      params.push(filters.buyer_id);
    }

    if (filters.status) {
      query += " AND r.status = ?";
      params.push(filters.status);
    }

    if (filters.payment_status) {
      query += " AND r.payment_status = ?";
      params.push(filters.payment_status);
    }

    query += " ORDER BY r.created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT r.*, p.name as product_name, p.seller_id,
              CONCAT(b.Firstname, ' ', b.LastName) as buyer_name,
              CONCAT(s.Firstname, ' ', s.LastName) as seller_name
       FROM rentals r
       JOIN products p ON r.product_id = p.id
       JOIN users b ON r.buyer_id = b.id
       JOIN users s ON p.seller_id = s.id
       WHERE r.id = ?`,
      [id],
    );
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      "UPDATE rentals SET status = ? WHERE id = ?",
      [status, id],
    );
    return result.affectedRows > 0;
  },

  updatePayment: async (id, paymentData) => {
    const { payment_status, refund_amount } = paymentData;
    let query = "UPDATE rentals SET payment_status = ?";
    const params = [payment_status];

    if (payment_status === "refunded") {
      query += ", refund_amount = ?, refunded_at = CURRENT_TIMESTAMP";
      params.push(refund_amount || 0);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  findByBuyerId: async (buyerId) => {
    return await Rental.findAll({ buyer_id: buyerId });
  },

  findBySellerId: async (sellerId) => {
    return await Rental.findAll({ seller_id: sellerId });
  },
};

module.exports = Rental;
