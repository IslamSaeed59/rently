const authModel = require("../Models/Auth/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const authController = {
  // Step 1: Register and send OTP
  register: async (req, res) => {
    try {
      const {
        Firstname,
        LastName,
        Email,
        PhoneNumber,
        DateofBrith,
        Gender,
        Password,
      } = req.body;

      // Check if user already exists
      const existingUserEmail = await authModel.findByEmail(Email);
      if (existingUserEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const existingUserPhone = await authModel.findByPhone(PhoneNumber);
      if (existingUserPhone) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Save OTP to database
      await authModel.saveOtp(Email, otp, expiresAt);

      console.log(`[TESTING] OTP for ${Email} is ${otp}`);

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: Email,
        subject: "Your Verification Code (OTP)",
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Step 2: Verify OTP and create user
  verifyOtp: async (req, res) => {
    try {
      const { Email, otp, userData } = req.body;

      // Verify OTP
      const validOtp = await authModel.verifyOtp(Email, otp);
      if (!validOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // If userData is provided, it's a registration flow
      if (userData) {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.Password, 10);

        // Create user
        const userId = await authModel.createUser({
          ...userData,
          Email, // Ensure email matches verified one
          Password: hashedPassword,
        });

        // Delete OTP
        await authModel.deleteOtp(Email);

        return res.status(201).json({ message: "Account created successfully", userId });
      }

      // If no userData, it's just a verification step (e.g. for reset password)
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify OTP Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { identifier, Password } = req.body; // identifier can be Email or Phone

      // Find user
      const user = await authModel.findByEmailOrPhone(identifier);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT (5 hours)
      const token = jwt.sign(
        { userId: user.id, Email: user.Email },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "5h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          Firstname: user.Firstname,
          LastName: user.LastName,
          Email: user.Email,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Forgot Password: Check email and send OTP
  forgotPassword: async (req, res) => {
    try {
      const { Email } = req.body;

      // Check if user exists
      const user = await authModel.findByEmail(Email);
      if (!user) {
        return res.status(404).json({ message: "User with this email not found" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP
      await authModel.saveOtp(Email, otp, expiresAt);

      console.log(`[TESTING] Reset Password OTP for ${Email} is ${otp}`);

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: Email,
        subject: "Password Reset Code (OTP)",
        text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Reset OTP sent to your email" });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Reset Password: Verify OTP and update password
  resetPassword: async (req, res) => {
    try {
      const { Email, otp, newPassword } = req.body;

      // Verify OTP
      const validOtp = await authModel.verifyOtp(Email, otp);
      if (!validOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await authModel.updatePassword(Email, hashedPassword);

      // Delete OTP
      await authModel.deleteOtp(Email);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = authController;
