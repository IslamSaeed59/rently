const Rental = require("../../Models/Rental/Rentals");
const RentalRequest = require("../../Models/Rental/RentalRequests");

const createRental = async (req, res) => {
  try {
    const { rental_request_id, payment_method } = req.body;
    const userId = req.user.userId || req.user.id;

    // Typically a rental is created from an accepted request
    const request = await RentalRequest.findById(rental_request_id);
    if (!request) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    if (request.request_status !== "accepted") {
      return res.status(400).json({ message: "Request must be accepted before starting a rental" });
    }

    if (request.buyer_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to start this rental" });
    }

    const rentalId = await Rental.create({
      product_id: request.product_id,
      buyer_id: request.buyer_id,
      start_datetime: request.start_datetime,
      end_datetime: request.end_datetime,
      rental_type: request.rental_type,
      total_price: request.total_price,
      rental_request_id: request.id,
      payment_method,
      payment_status: "pending",
    });

    res.status(201).json({ message: "Rental record created successfully", rentalId });
  } catch (error) {
    console.error("Create Rental Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyRentals = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const rentals = await Rental.findByBuyerId(userId);
    res.status(200).json(rentals);
  } catch (error) {
    console.error("Get My Rentals Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSellerRentals = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const rentals = await Rental.findBySellerId(userId);
    res.status(200).json(rentals);
  } catch (error) {
    console.error("Get Seller Rentals Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Check if user is buyer, seller, or admin
    if (rental.buyer_id !== userId && rental.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(rental);
  } catch (error) {
    console.error("Get Rental By ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId || req.user.id;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Only seller or admin can update status generally
    if (rental.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const success = await Rental.updateStatus(id, status);
    if (success) {
      res.status(200).json({ message: "Rental status updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update rental status" });
    }
  } catch (error) {
    console.error("Update Rental Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, refund_amount } = req.body;
    const userId = req.user.userId || req.user.id;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Only admin can handle payment status updates in this simple version
    // or maybe the seller confirms receipt of cash
    if (rental.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const success = await Rental.updatePayment(id, { payment_status, refund_amount });
    if (success) {
      res.status(200).json({ message: "Payment status updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update payment status" });
    }
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Only buyer can confirm delivery
    if (rental.buyer_id !== userId) {
      return res.status(403).json({ message: "Only the buyer can confirm delivery" });
    }

    if (rental.delivery_status === 'confirmed') {
      return res.status(400).json({ message: "Delivery is already confirmed" });
    }

    // Handle uploaded photos
    const delivery_photos = req.files ? req.files.map(f => `/uploads/deliveries/${f.filename}`) : [];

    if (delivery_photos.length === 0) {
      return res.status(400).json({ message: "At least one condition photo is required" });
    }

    // Calculate new start and end times
    const originalStart = new Date(rental.start_datetime);
    const originalEnd = new Date(rental.end_datetime);
    const originalDurationMs = originalEnd.getTime() - originalStart.getTime();

    const newStartDatetime = new Date();
    const newEndDatetime = new Date(newStartDatetime.getTime() + originalDurationMs);

    const success = await Rental.confirmDelivery(id, {
      start_datetime: newStartDatetime,
      end_datetime: newEndDatetime,
      delivery_photos
    });

    if (success) {
      res.status(200).json({ 
        message: "Delivery confirmed successfully",
        new_start_datetime: newStartDatetime,
        new_end_datetime: newEndDatetime,
        delivery_photos
      });
    } else {
      res.status(400).json({ message: "Failed to confirm delivery" });
    }
  } catch (error) {
    console.error("Confirm Delivery Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getSellerRentals,
  getRentalById,
  updateRentalStatus,
  updatePaymentStatus,
  confirmDelivery,
};
