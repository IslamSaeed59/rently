const Wallet = require("../Models/Wallet");

const AdminPayoutController = {
  // Get all withdrawal requests with filters
  getAllWithdrawals: async (req, res) => {
    try {
      // Ensure admin
      if (req.user.Email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { status, search } = req.query;
      const withdrawals = await Wallet.getAllWithdrawals(status, search);
      const stats = await Wallet.getWithdrawalStats();

      res.status(200).json({
        withdrawals,
        stats
      });
    } catch (error) {
      console.error("Get All Withdrawals Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Approve a withdrawal request
  approveWithdrawal: async (req, res) => {
    try {
      if (req.user.Email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { admin_notes } = req.body;

      await Wallet.approveWithdrawal(id, admin_notes || "Transfer successful");
      res.status(200).json({ message: "Withdrawal approved successfully." });
    } catch (error) {
      console.error("Approve Withdrawal Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Reject a withdrawal request
  rejectWithdrawal: async (req, res) => {
    try {
      if (req.user.Email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { admin_notes } = req.body;

      if (!admin_notes) {
        return res.status(400).json({ message: "Admin notes required for rejection." });
      }

      const success = await Wallet.rejectWithdrawal(id, admin_notes);
      if (!success) {
        return res.status(404).json({ message: "Withdrawal request not found." });
      }

      res.status(200).json({ message: "Withdrawal rejected and amount refunded to user." });
    } catch (error) {
      console.error("Reject Withdrawal Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// End of controller
module.exports = AdminPayoutController;
