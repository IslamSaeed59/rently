const Favorite = require("../Models/Favorite");

const toggleFavorite = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.userId || req.user.id;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const isFav = await Favorite.isFavorite(user_id, product_id);
    if (isFav) {
      await Favorite.remove(user_id, product_id);
      return res.status(200).json({ message: "Removed from favorites", isFavorite: false });
    } else {
      await Favorite.add(user_id, product_id);
      return res.status(200).json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFavorites = async (req, res) => {
  const user_id = req.user.userId || req.user.id;

  try {
    const favorites = await Favorite.findByUserId(user_id);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkFavoriteStatus = async (req, res) => {
  const { productId } = req.params;
  const user_id = req.user.userId || req.user.id;

  try {
    const isFavorite = await Favorite.isFavorite(user_id, productId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  checkFavoriteStatus
};
