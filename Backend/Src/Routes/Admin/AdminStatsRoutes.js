const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
} = require("../../Controllers/Admin/AdminStats.Controller");
const jwt = require("jsonwebtoken");

// Simple Admin Auth Middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_secret_key",
    (err, decoded) => {
      if (err) {
        console.log("JWT Error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!decoded.Email || decoded.Email.toLowerCase() !== "admin@gmail.com") {
        console.log("Access Denied: Email mismatch", decoded.Email);
        return res.status(403).json({ message: "Access denied" });
      }
      req.userId = decoded.id;
      next();
    },
  );
};

router.get("/stats", verifyAdmin, getDashboardStats);

module.exports = router;
