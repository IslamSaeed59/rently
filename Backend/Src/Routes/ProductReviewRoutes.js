const express = require("express");
const router = express.Router();
const ProductReviewController = require("../Controllers/ProductReviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Get reviews for a product
router.get("/:productId", ProductReviewController.getReviews);

// Add a review
router.post("/", authMiddleware, ProductReviewController.addReview);

// Delete a review
router.delete("/:id", authMiddleware, ProductReviewController.deleteReview);

module.exports = router;
