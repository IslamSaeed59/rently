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
};

module.exports = User;
