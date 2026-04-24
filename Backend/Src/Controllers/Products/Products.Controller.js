const Product = require("../../Models/products/Products");

const createProduct = async (req, res) => {
  try {
    const { category_name, ...productData } = req.body;
    const seller_id = req.user.userId || req.user.id;

    if (!seller_id) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    if (!productData.name || !productData.deposit_amount) {
      return res.status(400).json({ message: "Name and deposit amount are required" });
    }

    const images = req.files ? req.files.map((file, i) => ({
      image_url: `/uploads/${encodeURIComponent(category_name || 'Uncategorized')}/${file.filename}`,
      is_primary: i === 0,
      sort_order: i
    })) : [];

    const productId = await Product.create({ ...productData, seller_id }, images);
    res.status(201).json({ message: "Product created successfully", productId });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id,
      seller_id: req.query.seller_id,
      name: req.query.name,
      seller_name: req.query.seller_name,
      showAll: req.user && req.user.Email === "admin@gmail.com",
    };
    const products = await Product.findAll(filters);
    res.status(200).json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyListings = async (req, res) => {
  try {
    const seller_id = req.user.userId || req.user.id;
    if (!seller_id) {
      return res.status(401).json({ message: "User ID not found in token" });
    }
    const products = await Product.findBySellerId(seller_id);
    res.status(200).json(products);
  } catch (error) {
    console.error("Get My Listings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, ...productData } = req.body;
    const userId = req.user.userId || req.user.id;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership or admin
    if (existingProduct.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    await Product.update(id, productData, images);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership or admin
    if (existingProduct.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    const success = await Product.delete(id);
    if (success) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete product" });
    }
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getMyListings,
  updateProduct,
  deleteProduct,
};
