const pool = require("../../../Config/db");

const Product = {
  create: async (productData, images) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        seller_id,
        category_id,
        name,
        description,
        price_per_hour,
        price_per_day,
        price_per_week,
        price_per_month,
        deposit_amount,
        location,
        total_rentals,
        total_earnings,
      } = productData;

      const [productResult] = await connection.query(
        `INSERT INTO products 
        (seller_id, category_id, name, description, price_per_hour, price_per_day, price_per_week, price_per_month, deposit_amount, location, total_rentals, total_earnings) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seller_id,
          category_id,
          name,
          description,
          price_per_hour,
          price_per_day,
          price_per_week,
          price_per_month,
          deposit_amount,
          location,
          total_rentals || 0,
          total_earnings || 0,
        ],
      );

      const productId = productResult.insertId;

      if (images && images.length > 0) {
        const imageQueries = images.map((img) => [
          productId,
          img.image_url,
          img.is_primary || false,
          img.sort_order || 0,
        ]);
        await connection.query(
          "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?",
          [imageQueries],
        );
      }

      await connection.commit();
      return productId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT p.*, pi.image_url as primary_image, c.name as category_name, 
             CONCAT(s.Firstname, ' ', s.LastName) as seller_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users s ON p.seller_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (!filters.showAll) {
      query += " AND p.is_active = TRUE";
    }

    if (filters.category_id) {
      query += " AND p.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.seller_id) {
      query += " AND p.seller_id = ?";
      params.push(filters.seller_id);
    }

    if (filters.name) {
      query += " AND p.name LIKE ?";
      params.push(`%${filters.name}%`);
    }

    if (filters.seller_name) {
      query += " AND CONCAT(s.Firstname, ' ', s.LastName) LIKE ?";
      params.push(`%${filters.seller_name}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findBySellerId: async (sellerId) => {
    let query = `
      SELECT p.*, pi.image_url as primary_image, c.name as category_name, 
             CONCAT(s.Firstname, ' ', s.LastName) as seller_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users s ON p.seller_id = s.id
      WHERE p.seller_id = ?
    `;
    const [rows] = await pool.query(query, [sellerId]);
    return rows;
  },

  findById: async (id) => {
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name, 
              CONCAT(s.Firstname, ' ', s.LastName) as seller_name
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users s ON p.seller_id = s.id
       WHERE p.id = ?`,
      [id]
    );
    if (products.length === 0) return null;

    const [images] = await pool.query(
      "SELECT id, image_url, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
      [id],
    );

    return { ...products[0], images };
  },

  update: async (id, productData, images) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        category_id,
        name,
        description,
        price_per_hour,
        price_per_day,
        price_per_week,
        price_per_month,
        deposit_amount,
        location,
        is_available,
        is_active,
        total_rentals,
        total_earnings,
      } = productData;

      await connection.query(
        `UPDATE products SET 
          category_id = ?, name = ?, description = ?, price_per_hour = ?, 
          price_per_day = ?, price_per_week = ?, price_per_month = ?, deposit_amount = ?, 
          location = ?, is_available = ?, is_active = ?, total_rentals = ?, total_earnings = ? 
        WHERE id = ?`,
        [
          category_id,
          name,
          description,
          price_per_hour,
          price_per_day,
          price_per_week,
          price_per_month,
          deposit_amount,
          location,
          is_available,
          is_active,
          total_rentals,
          total_earnings,
          id,
        ],
      );

      if (images) {
        await connection.query(
          "DELETE FROM product_images WHERE product_id = ?",
          [id],
        );
        if (images.length > 0) {
          const imageQueries = images.map((img) => [
            id,
            img.image_url,
            img.is_primary || false,
            img.sort_order || 0,
          ]);
          await connection.query(
            "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?",
            [imageQueries],
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = Product;
