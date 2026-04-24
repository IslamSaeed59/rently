const RentalRequest = require("../../Models/Rental/RentalRequests");
const Product = require("../../Models/products/Products");
const BookingBlackout = require("../../Models/Rental/Booking");
const Rental = require("../../Models/Rental/Rentals");

const createRequest = async (req, res) => {
  try {
    const { product_id, start_datetime, end_datetime, rental_type, total_price, payment_method } = req.body;
    const buyer_id = req.user.userId || req.user.id;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller_id === buyer_id) {
      return res.status(400).json({ message: "You cannot rent your own product" });
    }

    const requestId = await RentalRequest.create({
      product_id,
      buyer_id,
      seller_id: product.seller_id,
      start_datetime,
      end_datetime,
      rental_type,
      total_price,
      payment_method,
    });

    res.status(201).json({ message: "Rental request submitted successfully", requestId });
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const buyer_id = req.user.userId || req.user.id;
    const requests = await RentalRequest.findByBuyerId(buyer_id);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get My Requests Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const seller_id = req.user.userId || req.user.id;
    const requests = await RentalRequest.findBySellerId(seller_id);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get Received Requests Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // accepted, rejected, cancelled_by_buyer
    const userId = req.user.userId || req.user.id;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    // Authorization logic
    if (status === "cancelled_by_buyer") {
      if (request.buyer_id !== userId) {
        return res.status(403).json({ message: "Not authorized to cancel this request" });
      }
    } else if (status === "accepted" || status === "rejected") {
      if (request.seller_id !== userId) {
        return res.status(403).json({ message: "Not authorized to respond to this request" });
      }
    }

    const success = await RentalRequest.updateStatus(id, status);
    if (success) {
      // If accepted, create a rental record and a blackout to block these dates
      if (status === "accepted") {
        // Create Rental record
        const rentalId = await Rental.create({
          product_id: request.product_id,
          buyer_id: request.buyer_id,
          start_datetime: request.start_datetime,
          end_datetime: request.end_datetime,
          rental_type: request.rental_type,
          total_price: request.total_price,
          rental_request_id: request.id,
          payment_method: request.payment_method,
          payment_status: "pending",
        });

        // Create Blackout and link to rental
        await BookingBlackout.create({
          product_id: request.product_id,
          start_datetime: request.start_datetime,
          end_datetime: request.end_datetime,
          rental_id: rentalId,
        });
      }
      res.status(200).json({ message: `Request ${status} successfully` });
    } else {
      res.status(400).json({ message: "Failed to update request status" });
    }
  } catch (error) {
    console.error("Update Request Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    // Admin only check
    if (req.user.Email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Access denied" });
    }
    const requests = await RentalRequest.findAll();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get All Requests Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  getAllRequests,
};
