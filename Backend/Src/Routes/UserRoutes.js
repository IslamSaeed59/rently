const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");

// Get all users
router.get("/", UserController.getUsers);

// Get user by ID
router.get("/:id", UserController.getUserById);

module.exports = router;
