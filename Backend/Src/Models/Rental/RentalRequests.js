const pool = require("../../../Config/db");

const RentalRequest = {
  create: async (requestData) => {
    const {
      product_id,
      buyer_id,
      seller_id,
      start_datetime,
      end_datetime,
      rental_type,
      total_price,
      payment_method,
    } = requestData;

    const [result] = await pool.query(
      `INSERT INTO rental_requests 
      (product_id, buyer_id, seller_id, start_datetime, end_datetime, rental_type, total_price, payment_method) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id,
        buyer_id,
        seller_id,
        start_datetime,
        end_datetime,
        rental_type,
        total_price,
        payment_method,
      ],
    );
    return result.insertId;
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT rr.*, p.name as product_name, pi.image_url as primary_image,
             CONCAT(b.Firstname, ' ', b.LastName) as buyer_name,
             CONCAT(s.Firstname, ' ', s.LastName) as seller_name,
             r.payment_status, r.id as rental_id, r.dispute_status, r.dispute_reason, r.deposit_paid, r.notes
      FROM rental_requests rr
      JOIN products p ON rr.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      JOIN users b ON rr.buyer_id = b.id
      JOIN users s ON rr.seller_id = s.id
      LEFT JOIN rentals r ON rr.id = r.rental_request_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.seller_id) {
      query += " AND rr.seller_id = ?";
      params.push(filters.seller_id);
    }

    if (filters.buyer_id) {
      query += " AND rr.buyer_id = ?";
      params.push(filters.buyer_id);
    }

    if (filters.request_status) {
      query += " AND rr.request_status = ?";
      params.push(filters.request_status);
    }

    query += " ORDER BY rr.created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT rr.*, p.name as product_name, pi.image_url as primary_image,
              CONCAT(b.Firstname, ' ', b.LastName) as buyer_name,
              CONCAT(s.Firstname, ' ', s.LastName) as seller_name,
              rr.payment_method,
              r.payment_status, r.id as rental_id
       FROM rental_requests rr
       JOIN products p ON rr.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       JOIN users b ON rr.buyer_id = b.id
       JOIN users s ON rr.seller_id = s.id
       LEFT JOIN rentals r ON rr.id = r.rental_request_id
       WHERE rr.id = ?`,
      [id],
    );
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      "UPDATE rental_requests SET request_status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id],
    );
    return result.affectedRows > 0;
  },

  findByBuyerId: async (buyerId) => {
    return await RentalRequest.findAll({ buyer_id: buyerId });
  },

  findBySellerId: async (sellerId) => {
    return await RentalRequest.findAll({ seller_id: sellerId });
  },
};

module.exports = RentalRequest;
