const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
  checkFavoriteStatus,
} = require("../Controllers/FavoriteController");
const authMiddleware = require("../middleware/authMiddleware");

// All favorite routes require authentication
router.use(authMiddleware);

router.post("/toggle", toggleFavorite);
router.get("/", getFavorites);
router.get("/status/:productId", checkFavoriteStatus);

module.exports = router;
