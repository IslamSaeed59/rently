const express = require("express");
const router = express.Router();
const availabilityController = require("../../Controllers/Rentals/Availability.Controller");
const authMiddleware = require("../../middleware/authMiddleware");

// Public routes
router.get("/:productId", availabilityController.getProductAvailability);

// Protected routes
router.use(authMiddleware);
router.post("/availability", availabilityController.setAvailability);
router.post("/blackout", availabilityController.createBlackout);
router.delete("/blackout/:id", availabilityController.deleteBlackout);

module.exports = router;
