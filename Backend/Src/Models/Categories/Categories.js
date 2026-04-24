const pool = require("../../../Config/db");

const Categories = {
  create: async (categoryData) => {
    const { name, icon, slug, parent_id = null } = categoryData;
    const [result] = await pool.query(
      "INSERT INTO categories (name, icon, slug, parent_id) VALUES (?, ?, ?, ?)",
      [name, icon, slug, parent_id]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categories");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0];
  },

  update: async (id, categoryData) => {
    const { name, icon, slug, parent_id } = categoryData;
    const [result] = await pool.query(
      "UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon), slug = COALESCE(?, slug), parent_id = COALESCE(?, parent_id) WHERE id = ?",
      [name, icon, slug, parent_id, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = Categories;
