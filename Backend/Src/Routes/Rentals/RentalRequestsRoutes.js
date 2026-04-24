const express = require("express");
const router = express.Router();
const rentalRequestsController = require("../../Controllers/Rentals/RentalRequests.Controller");
const authMiddleware = require("../../middleware/authMiddleware");

// All routes are protected
router.use(authMiddleware);

router.post("/", rentalRequestsController.createRequest);
router.get("/buyer", rentalRequestsController.getMyRequests);
router.get("/seller", rentalRequestsController.getReceivedRequests);
router.get("/all", rentalRequestsController.getAllRequests); // Admin only internally handled
router.put("/:id/status", rentalRequestsController.updateRequestStatus);

module.exports = router;
