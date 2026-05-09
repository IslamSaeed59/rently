const User = require("../Models/User");

const UserController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.status(200).json({ message: "User and all related records deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user. It might have active dependencies.", error: error.message });
    }
  }
};

module.exports = UserController;
