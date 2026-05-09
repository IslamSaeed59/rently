const ProductReview = require("../Models/ProductReview");
const Product = require("../Models/products/Products");

const ProductReviewController = {
  addReview: async (req, res) => {
    try {
      const { product_id, rating, comment } = req.body;
      const user_id = req.user.userId || req.user.id;

      if (!product_id || !rating || !comment) {
        return res.status(400).json({ message: "All fields are required" });
      }

      await ProductReview.create({ product_id, user_id, rating, comment });
      res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await ProductReview.getByProductId(productId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId || req.user.id;
      const isAdmin = req.user.Email === "admin@gmail.com";

      const review = await ProductReview.getById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if user is owner of the product or admin
      const product = await Product.findById(review.product_id);
      
      if (userId !== product.seller_id && !isAdmin) {
        return res.status(403).json({ message: "Unauthorized to delete this review" });
      }

      await ProductReview.delete(id);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};

module.exports = ProductReviewController;
