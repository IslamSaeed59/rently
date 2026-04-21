const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

// Register (Send OTP)
router.post("/register", authController.register);

// Verify OTP (Finalize Registration)
router.post("/verify-otp", authController.verifyOtp);

// Login
router.post("/login", authController.login);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);

// Reset Password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
