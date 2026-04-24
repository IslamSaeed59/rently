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
      "SELECT id, Firstname, LastName, Email, PhoneNumber, DateofBrith, Gender, role, created_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  },
};

module.exports = User;
