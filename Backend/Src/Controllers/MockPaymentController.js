const Rental = require("../Models/Rental/Rentals");
const Wallet = require("../Models/Wallet");
const pool = require("../../Config/db");

const MockPaymentController = {
  // Simulate payment for a rental (Buyer pays)
  payForRental: async (req, res) => {
    try {
      const { rental_request_id, card_details } = req.body;
      const userId = req.user.userId || req.user.id;

      // Find rental by request ID and include seller_id from products table
      const [rentals] = await pool.query(
        `SELECT r.*, p.seller_id 
         FROM rentals r 
         JOIN products p ON r.product_id = p.id 
         WHERE r.rental_request_id = ?`, 
        [rental_request_id]
      );
      if (rentals.length === 0) return res.status(404).json({ message: "Rental record not found" });
      const rental = rentals[0];
      const rental_id = rental.id;

      if (rental.buyer_id !== userId) return res.status(403).json({ message: "You are not authorized" });
      if (rental.payment_status === "held_in_escrow" || rental.payment_status === "released_to_lessor") {
        return res.status(400).json({ message: "Rental is already paid." });
      }

      // -- MOCK PAYMENT SUCCESS --
      // In reality, we'd verify the payment intent or webhook from Paymob here.

      // 1. Calculate full amount to hold (Fee + Deposit)
      const fullAmount = parseFloat(rental.total_price) + parseFloat(rental.deposit_paid || 0);
      
      console.log(`Processing payment: Buyer ${userId} paying ${fullAmount} (Fee: ${rental.total_price}, Deposit: ${rental.deposit_paid})`);
      await Wallet.holdInEscrow(rental.seller_id, userId, fullAmount, rental_id);

      // 2. Only if wallet transaction succeeds, update rental payment status
      await Rental.updatePayment(rental_id, { payment_status: "held_in_escrow" });

      res.status(200).json({ message: "Payment successful. Funds are held in escrow safely." });
    } catch (error) {
      console.error("MockPayment Error:", error);
      if (error.message === "Insufficient wallet balance. Please top up your wallet.") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Seller confirms they received the item back safely
  confirmReturn: async (req, res) => {
    try {
      const { rental_id } = req.body;
      const userId = req.user.userId || req.user.id;

      const rental = await Rental.findById(rental_id);
      if (!rental) return res.status(404).json({ message: "Rental not found" });

      // Only the Seller (Lessor) can confirm they received the item back
      if (rental.seller_id !== userId && req.user.Email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Only the seller can confirm item return" });
      }

      if (rental.payment_status !== "held_in_escrow") {
        return res.status(400).json({ message: "Funds are not currently in escrow or already released." });
      }

      // Release funds: Rental fee to seller, Deposit to buyer
      await Wallet.releaseEscrow(rental.seller_id, rental_id, 10);

      // Update rental status to returned (completed) AND payment_status to released
      await Rental.updateStatus(rental_id, "returned");
      await Rental.updatePayment(rental_id, { payment_status: "released_to_lessor" });

      res.status(200).json({ 
        message: "Item return confirmed! Rental fee released to you, and security deposit refunded to the buyer." 
      });
    } catch (error) {
      console.error("Confirm Return Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Seller reports an issue with the returned item
  reportRentalIssue: async (req, res) => {
    try {
      const { rental_id, reason } = req.body;
      const userId = req.user.userId || req.user.id;

      if (!reason) return res.status(400).json({ message: "Reason is required to report an issue." });

      const rental = await Rental.findById(rental_id);
      if (!rental) return res.status(404).json({ message: "Rental not found" });

      if (rental.seller_id !== userId) {
        return res.status(403).json({ message: "Only the seller can report an issue." });
      }

      await Wallet.reportRentalIssue(userId, rental_id, reason);

      res.status(200).json({ 
        message: "Issue reported. Your rental fee has been released to your wallet, and the security deposit is held for admin review." 
      });
    } catch (error) {
      console.error("Report Issue Error:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  },

  // Admin resolves a dispute
  resolveRentalDispute: async (req, res) => {
    try {
      // Admin only check
      if (req.user.Email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { rental_id, amountToSeller, amountToBuyer, adminNotes } = req.body;

      if (!rental_id || amountToSeller === undefined || amountToBuyer === undefined) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      await Wallet.resolveDispute(rental_id, amountToSeller, amountToBuyer, adminNotes || "Resolved by Admin");

      res.status(200).json({ message: "Dispute resolved successfully." });
    } catch (error) {
      console.error("Resolve Dispute Error:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
};

module.exports = MockPaymentController;
