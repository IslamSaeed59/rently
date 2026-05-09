const Wallet = require("../Models/Wallet");

const WalletController = {
  // Get user's wallet balance and transactions
  getMyWallet: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      
      const wallet = await Wallet.getWalletByUserId(userId);
      const transactions = await Wallet.getUserTransactions(userId);
      const withdrawals = await Wallet.getWithdrawalRequests(userId);

      res.status(200).json({
        wallet,
        transactions,
        withdrawals
      });
    } catch (error) {
      console.error("Get Wallet Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Submit a withdrawal request
  requestWithdrawal: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const { amount, account_details } = req.body;
      const method = "Vodafone Cash"; // Fixed to Vodafone cash as requested

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount." });
      }

      if (!account_details) {
        return res.status(400).json({ message: "Please provide your Vodafone Cash number." });
      }

      const withdrawalId = await Wallet.requestWithdrawal(userId, amount, method, account_details);
      
      res.status(200).json({ message: "Withdrawal request submitted successfully.", withdrawalId });
    } catch (error) {
      console.error("Request Withdrawal Error:", error);
      // Catch specific error from model
      if (error.message === "Insufficient available balance.") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Deposit funds (Top-up)
  depositFunds: async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const { amount, phone, method } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount." });
      }

      if (!phone || !method) {
        return res.status(400).json({ message: "Phone number and payment method are required." });
      }

      await Wallet.deposit(userId, amount, method, phone);
      res.status(200).json({ message: "Wallet topped up successfully." });
    } catch (error) {
      console.error("Deposit Funds Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = WalletController;
