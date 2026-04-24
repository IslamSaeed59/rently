const express = require("express");
const router = express.Router();
const productsController = require("../../Controllers/Products/Products.Controller");
const authMiddleware = require("../../middleware/authMiddleware");
const optionalAuth = require("../../middleware/optionalAuth");
const upload = require("../../middleware/uploadMiddleware");

// Public routes (but enhanced if admin is logged in)
router.get("/", optionalAuth, productsController.getAllProducts);
router.get("/:id", productsController.getProductById);

// Protected routes
router.get("/seller/my-listings", authMiddleware, productsController.getMyListings);
router.post("/", authMiddleware, upload.array("images", 10), productsController.createProduct);
router.put("/:id", authMiddleware, upload.array("images", 10), productsController.updateProduct);
router.delete("/:id", authMiddleware, productsController.deleteProduct);

module.exports = router;
