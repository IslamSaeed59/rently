const pool = require("../../../Config/db");

const Profile = {
  // Create a profile (usually handled automatically during user registration, but provided for completeness)
  createProfile: async (userId, profileData = {}) => {
    const {
      bio = null,
      governorate = null,
      city = null,
      profile_image = null,
    } = profileData;
    const [result] = await pool.query(
      "INSERT INTO profiles (user_id, bio, governorate, city, profile_image) VALUES (?, ?, ?, ?, ?)",
      [userId, bio, governorate, city, profile_image],
    );
    return result.insertId;
  },

  // Get a user's profile
  getProfileByUserId: async (userId) => {
    const query = `
      SELECT 
        u.Firstname, u.LastName, u.Email, u.PhoneNumber, 
        p.* 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows[0];
  },

  // Update a user's profile (COALESCE preserves the old value if the new one is undefined/null)
  updateProfile: async (userId, updateData) => {
    const {
      Firstname,
      LastName,
      Email,
      PhoneNumber,
      bio,
      governorate,
      city,
      profile_image,
    } = updateData;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update users table
      await connection.query(
        "UPDATE users SET Firstname = COALESCE(?, Firstname), LastName = COALESCE(?, LastName), Email = COALESCE(?, Email), PhoneNumber = COALESCE(?, PhoneNumber) WHERE id = ?",
        [Firstname, LastName, Email, PhoneNumber, userId],
      );

      // Update profiles table
      await connection.query(
        "UPDATE profiles SET bio = COALESCE(?, bio), governorate = COALESCE(?, governorate), city = COALESCE(?, city), profile_image = COALESCE(?, profile_image) WHERE user_id = ?",
        [bio, governorate, city, profile_image, userId],
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // changePassword
  changePassword: async (userId, newPassword) => {
    const [result] = await pool.query(
      "UPDATE users SET Password = ? WHERE id = ?",
      [newPassword, userId],
    );
    return result.affectedRows;
  },
};

module.exports = Profile;
