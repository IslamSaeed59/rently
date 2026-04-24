const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require("../Controllers/ProfileController");
const authMiddleware = require("../Middleware/authMiddleware");

// Apply authentication middleware to verify user identity
router.use(authMiddleware); 
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/change-password", changePassword);

module.exports = router;
