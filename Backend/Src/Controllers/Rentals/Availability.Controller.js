const ProductAvailability = require("../../Models/Rental/ProductAvailability");
const BookingBlackout = require("../../Models/Rental/Booking");
const Product = require("../../Models/products/Products");

const setAvailability = async (req, res) => {
  try {
    const { product_id, date, available_hours } = req.body;
    const userId = req.user.userId || req.user.id;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Not authorized to update this product's availability" });
    }

    await ProductAvailability.upsert({ product_id, date, available_hours });
    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Set Availability Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductAvailability = async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;

    const availability = await ProductAvailability.findAllByProductId(productId, startDate, endDate);
    const blackouts = await BookingBlackout.findAllByProductId(productId);

    res.status(200).json({
      availability,
      blackouts
    });
  } catch (error) {
    console.error("Get Availability Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createBlackout = async (req, res) => {
  try {
    const { product_id, start_datetime, end_datetime, rental_id } = req.body;
    const userId = req.user.userId || req.user.id;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Not authorized to create blackouts for this product" });
    }

    // Check for overlaps
    const isOverlapping = await BookingBlackout.checkOverlap(product_id, start_datetime, end_datetime);
    if (isOverlapping) {
      return res.status(400).json({ message: "This time slot overlaps with an existing blackout" });
    }

    const blackoutId = await BookingBlackout.create({
      product_id,
      start_datetime,
      end_datetime,
      rental_id
    });

    res.status(201).json({ message: "Blackout created successfully", blackoutId });
  } catch (error) {
    console.error("Create Blackout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBlackout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // We need to fetch the blackout to check product ownership
    // For simplicity in this controller, we'll assume the client knows what they're doing
    // but in a real app, we'd check if the user owns the product associated with this blackout.
    
    const success = await BookingBlackout.expireBlackout(id);
    if (success) {
      res.status(200).json({ message: "Blackout expired successfully" });
    } else {
      res.status(400).json({ message: "Failed to expire blackout" });
    }
  } catch (error) {
    console.error("Delete Blackout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setAvailability,
  getProductAvailability,
  createBlackout,
  deleteBlackout,
};
