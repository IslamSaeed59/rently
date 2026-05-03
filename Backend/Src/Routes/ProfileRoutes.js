const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadImage,
} = require("../Controllers/ProfileController");
const profileUpload = require("../middleware/profileUpload");
const authMiddleware = require("../Middleware/authMiddleware");

// Apply authentication middleware to verify user identity
router.use(authMiddleware); 
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/change-password", changePassword);
router.post(
  "/upload-image",
  profileUpload.single("profile_image"),
  uploadImage,
);

module.exports = router;
