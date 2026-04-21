const pool = require("../../../Config/db");

const auth = {
  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE Email = ?", [email]);
    return rows[0];
  },

  // Find user by phone
  findByPhone: async (phone) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE PhoneNumber = ?", [phone]);
    return rows[0];
  },

  // Find user by email or phone
  findByEmailOrPhone: async (identifier) => {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE Email = ? OR PhoneNumber = ?",
      [identifier, identifier]
    );
    return rows[0];
  },

  // Create new user
  createUser: async (userData) => {
    const {
      Firstname,
      LastName,
      Email,
      PhoneNumber,
      DateofBrith,
      Gender,
      Password,
    } = userData;
    const [result] = await pool.query(
      "INSERT INTO users (Firstname, LastName, Email, PhoneNumber, DateofBrith, Gender, Password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Firstname, LastName, Email, PhoneNumber, DateofBrith, Gender, Password]
    );
    return result.insertId;
  },

  // Save OTP
  saveOtp: async (email, otp, expiresAt) => {
    await pool.query("DELETE FROM otps WHERE Email = ?", [email]); // Remove old OTPs for this email
    await pool.query(
      "INSERT INTO otps (Email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const [rows] = await pool.query(
      "SELECT * FROM otps WHERE Email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );
    return rows[0];
  },

  // Delete OTP
  deleteOtp: async (email) => {
    await pool.query("DELETE FROM otps WHERE Email = ?", [email]);
  },

  // Forget password 
  updatePassword: async (email, hashedPassword) => {
    await pool.query("UPDATE users SET Password = ? WHERE Email = ?", [
      hashedPassword,
      email,
    ]);
  },
};

module.exports = auth;
