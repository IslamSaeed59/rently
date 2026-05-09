const express = require("express");
const MockPaymentController = require("../Controllers/MockPaymentController");
const WalletController = require("../Controllers/WalletController");
const AdminPayoutController = require("../Controllers/AdminPayoutController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Mock Payment Routes (Buyer)
router.post("/pay", authMiddleware, MockPaymentController.payForRental);
router.post("/confirm-return", authMiddleware, MockPaymentController.confirmReturn);
router.post("/report-issue", authMiddleware, MockPaymentController.reportRentalIssue);
router.post("/resolve-dispute", authMiddleware, MockPaymentController.resolveRentalDispute);

// 2. Wallet Routes (Lessor/User)
router.get("/wallet", authMiddleware, WalletController.getMyWallet);
router.post("/wallet/withdraw", authMiddleware, WalletController.requestWithdrawal);
router.post("/wallet/deposit", authMiddleware, WalletController.depositFunds);

// 3. Admin Payout Routes
router.get("/admin/withdrawals", authMiddleware, AdminPayoutController.getAllWithdrawals);
router.post("/admin/withdrawals/:id/approve", authMiddleware, AdminPayoutController.approveWithdrawal);
router.post("/admin/withdrawals/:id/reject", authMiddleware, AdminPayoutController.rejectWithdrawal);

// End of routes
module.exports = router;
