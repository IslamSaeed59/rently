const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const idVerificationController = require("../Controllers/idVerificationController");
const authMiddleware = require("../middleware/authMiddleware");
const idUpload = require("../middleware/idUpload");

// Register (Send OTP)
router.post("/register", authController.register);

// Verify OTP (Finalize Registration)
router.post("/verify-otp", authController.verifyOtp);

// Login
router.post("/login", authController.login);

// Google Login
router.post("/google-login", authController.googleLogin);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);

// Reset Password
router.post("/reset-password", authController.resetPassword);

// ID Verification
router.post(
  "/verify-id",
  authMiddleware,
  idUpload.fields([
    { name: "id_front", maxCount: 1 },
    { name: "id_back", maxCount: 1 },
  ]),
  idVerificationController.verifyId
);

module.exports = router;
