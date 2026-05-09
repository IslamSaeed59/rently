const pool = require("../../Config/db");

const User = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, Firstname, LastName, Email, PhoneNumber, DateofBrith, Gender,  created_at FROM users",
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, Firstname, LastName, Email, PhoneNumber, DateofBrith, Gender, id_front, id_back, verification_status, id_number, created_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  },

  updateVerification: async (id, data) => {
    const { id_front, id_back, verification_status, id_number } = data;
    await pool.query(
      "UPDATE users SET id_front = ?, id_back = ?, verification_status = ?, id_number = ? WHERE id = ?",
      [id_front, id_back, verification_status, id_number, id]
    );
  },

  delete: async (id) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Delete Financial Records
      await connection.query("DELETE FROM withdrawal_requests WHERE user_id = ?", [id]);
      await connection.query(
        "DELETE FROM transactions WHERE wallet_id IN (SELECT id FROM wallets WHERE user_id = ?)",
        [id]
      );
      await connection.query("DELETE FROM wallets WHERE user_id = ?", [id]);

      // 2. Delete Reviews (buyer reviews and reviews on user's products)
      await connection.query("DELETE FROM reviews WHERE buyer_id = ? OR product_id IN (SELECT id FROM products WHERE seller_id = ?)", [id, id]);

      // 3. Delete Rentals and Rental Requests
      // Delete rentals where user is buyer or owner of the product
      await connection.query(
        "DELETE FROM rentals WHERE buyer_id = ? OR product_id IN (SELECT id FROM products WHERE seller_id = ?)",
        [id, id]
      );
      await connection.query("DELETE FROM rental_requests WHERE buyer_id = ? OR seller_id = ?", [id, id]);

      // 4. Delete Products and related data (Images/Availability)
      // product_images and product_availability usually have CASCADE, but let's be safe
      await connection.query("DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE seller_id = ?)", [id]);
      await connection.query("DELETE FROM product_availability WHERE product_id IN (SELECT id FROM products WHERE seller_id = ?)", [id]);
      await connection.query("DELETE FROM products WHERE seller_id = ?", [id]);

      // 5. Finally Delete User
      // profiles, conversations, messages, favorites, notifications have ON DELETE CASCADE in SQL
      await connection.query("DELETE FROM users WHERE id = ?", [id]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = User;
