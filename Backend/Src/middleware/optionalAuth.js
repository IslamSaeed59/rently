const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // Proceed without req.user
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid or expired, we still proceed but without req.user
    // Alternatively, we could return 401 if a token WAS provided but is invalid
    console.error("Optional Auth Error:", error);
    next();
  }
};

module.exports = optionalAuth;
