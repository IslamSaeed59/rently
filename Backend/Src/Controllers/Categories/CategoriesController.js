const Categories = require("../../Models/Categories/Categories");

const CategoriesController = {
  createCategory: async (req, res) => {
    try {
      const { name, icon, slug, parent_id } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required" });
      }

      const categoryId = await Categories.create({ name, icon, slug, parent_id });
      res.status(201).json({ message: "Category created successfully", categoryId });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Categories.findAll();
      
      // Optional: Build tree structure if requested
      if (req.query.tree === "true") {
        const tree = buildCategoryTree(categories);
        return res.status(200).json(tree);
      }

      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Categories.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Categories.update(id, req.body);
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Category not found or no changes made" });
      }
      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Categories.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};

// Helper function to build category tree
function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter(cat => cat.parent_id === parentId)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id)
    }));
}

module.exports = CategoriesController;
