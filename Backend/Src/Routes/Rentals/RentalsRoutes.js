const express = require("express");
const router = express.Router();
const rentalsController = require("../../Controllers/Rentals/Rentals.Controller");
const authMiddleware = require("../../middleware/authMiddleware");

// All routes are protected
router.use(authMiddleware);

router.post("/", rentalsController.createRental);
router.get("/buyer", rentalsController.getMyRentals);
router.get("/seller", rentalsController.getSellerRentals);
router.get("/:id", rentalsController.getRentalById);
router.put("/:id/status", rentalsController.updateRentalStatus);
router.put("/:id/payment", rentalsController.updatePaymentStatus);

module.exports = router;
