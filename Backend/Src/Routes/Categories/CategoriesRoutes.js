const express = require("express");
const router = express.Router();
const CategoriesController = require("../../Controllers/Categories/CategoriesController");

// Create a new category
router.post("/", CategoriesController.createCategory);

// Get all categories
router.get("/", CategoriesController.getAllCategories);

// Get a category by ID
router.get("/:id", CategoriesController.getCategoryById);

// Update a category by ID
router.put("/:id", CategoriesController.updateCategory);

// Delete a category by ID
router.delete("/:id", CategoriesController.deleteCategory);

module.exports = router;
