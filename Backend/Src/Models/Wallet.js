const pool = require("../../Config/db");

const PLATFORM_EMAIL = "admin@gmail.com"; // Site's commission receiver

const Wallet = {
  // Internal helper to get wallet without triggering auto-release
  _getWalletByUserIdInternal: async (userId) => {
    let [rows] = await pool.query("SELECT * FROM wallets WHERE user_id = ?", [userId]);
    
    if (rows.length === 0) {
      await pool.query("INSERT INTO wallets (user_id, available_balance, pending_balance) VALUES (?, 0, 0)", [userId]);
      [rows] = await pool.query("SELECT * FROM wallets WHERE user_id = ?", [userId]);
    }
    return rows[0];
  },

  // Helper to get platform wallet
  getPlatformWallet: async () => {
    const [users] = await pool.query("SELECT id FROM users WHERE Email = ?", [PLATFORM_EMAIL]);
    if (users.length === 0) {
      throw new Error("Platform admin user not found. Please ensure admin@gmail.com exists.");
    }
    // Use internal helper to avoid recursion
    return await Wallet._getWalletByUserIdInternal(users[0].id);
  },

  // Create or get user wallet (Public method, triggers auto-release)
  getWalletByUserId: async (userId) => {
    const wallet = await Wallet._getWalletByUserIdInternal(userId);

    // Trigger auto-release check for this user whenever their wallet is accessed
    await Wallet.autoReleaseEscrow(userId);
    
    // Refresh and return fresh data
    return await Wallet._getWalletByUserIdInternal(userId);
  },

  // Automatically release escrow funds for completed rentals
  autoReleaseEscrow: async (userId) => {
    try {
      // Find rentals where end_datetime has passed, it's for this seller, and it's still in escrow
      const [completedRentals] = await pool.query(
        `SELECT r.* FROM rentals r 
         JOIN products p ON r.product_id = p.id 
         WHERE p.seller_id = ? AND r.payment_status = 'held_in_escrow' AND r.end_datetime <= CURRENT_TIMESTAMP`,
        [userId]
      );

      for (const rental of completedRentals) {
        console.log(`Auto-releasing escrow for Rental ${rental.id} (Seller ${userId})`);
        await Wallet.releaseEscrow(userId, rental.id, 10);
      }
    } catch (error) {
      console.error("Auto-release escrow error:", error);
    }
  },

  // Deposit funds (Top-up)
  deposit: async (userId, amount, method, phone) => {
    const wallet = await Wallet._getWalletByUserIdInternal(userId);
    await pool.query("UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?", [amount, wallet.id]);
    
    const description = `Wallet top-up via ${method} (${phone})`;
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description) VALUES (?, 'deposit_escrow', ?, ?)",
      [wallet.id, amount, description]
    );
    return true;
  },

  // Add to pending balance (Escrow Hold)
  holdInEscrow: async (sellerId, buyerId, amount, rentalId) => {
    const sellerWallet = await Wallet._getWalletByUserIdInternal(sellerId);
    const buyerWallet = await Wallet._getWalletByUserIdInternal(buyerId);
    
    // 0. Check if buyer has sufficient balance
    const currentBalance = parseFloat(buyerWallet.available_balance);
    const requiredAmount = parseFloat(amount);

    if (currentBalance < requiredAmount) {
      throw new Error("Insufficient wallet balance. Please top up your wallet.");
    }

    // 1. Deduct from buyer's available balance
    await pool.query("UPDATE wallets SET available_balance = available_balance - ? WHERE id = ?", [requiredAmount, buyerWallet.id]);

    // 2. Log transaction for buyer (Payment out to escrow)
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'payment_out', ?, 'Payment for rental (Held in escrow)', ?)",
      [buyerWallet.id, requiredAmount, rentalId]
    );

    // 3. Add to seller's pending balance
    await pool.query("UPDATE wallets SET pending_balance = pending_balance + ? WHERE id = ?", [requiredAmount, sellerWallet.id]);
    
    // 4. Log transaction for seller (Incoming escrow)
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'deposit_escrow', ?, 'Incoming escrow for rental', ?)",
      [sellerWallet.id, requiredAmount, rentalId]
    );
    
    return true;
  },

  // Release Escrow (after rental is completed)
  releaseEscrow: async (sellerId, rentalId, commissionPercentage) => {
    // 1. Fetch rental details to get fee and deposit (join with rental_requests to get seller_id)
    const [rentals] = await pool.query(
      `SELECT r.*, rr.seller_id 
       FROM rentals r 
       JOIN rental_requests rr ON r.rental_request_id = rr.id 
       WHERE r.id = ?`, 
      [rentalId]
    );
    if (rentals.length === 0) throw new Error("Rental not found");
    const rental = rentals[0];

    const totalRentalFee = parseFloat(rental.total_price); // This should be the rental fee only
    const depositAmount = parseFloat(rental.deposit_paid || 0);
    const buyerId = rental.buyer_id;

    const sellerWallet = await Wallet._getWalletByUserIdInternal(sellerId);
    const buyerWallet = await Wallet._getWalletByUserIdInternal(buyerId);
    const systemWallet = await Wallet.getPlatformWallet();
    
    const commissionAmount = (totalRentalFee * commissionPercentage) / 100;
    const amountToSeller = totalRentalFee - commissionAmount;

    // 2. Update Seller: Add rental fee (minus commission) to available
    await pool.query(
      "UPDATE wallets SET pending_balance = pending_balance - ?, available_balance = available_balance + ? WHERE id = ?", 
      [totalRentalFee + depositAmount, amountToSeller, sellerWallet.id]
    );
    
    // 3. Update Buyer: Refund security deposit to available
    await pool.query(
      "UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?",
      [depositAmount, buyerWallet.id]
    );

    // 4. Update System: Add commission
    await pool.query(
      "UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?",
      [commissionAmount, systemWallet.id]
    );

    // 5. Log transactions
    // Seller: Rental income
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'escrow_release', ?, 'Rental income released', ?)",
      [sellerWallet.id, amountToSeller, rentalId]
    );

    // Seller: Commission deduction
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'commission_deduction', ?, 'Platform commission deduction', ?)",
      [sellerWallet.id, commissionAmount, rentalId]
    );

    // Buyer: Deposit refund
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'deposit_escrow', ?, 'Security deposit refunded', ?)",
      [buyerWallet.id, depositAmount, rentalId]
    );

    // System: Commission earned
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'commission_earned', ?, 'Commission earned from rental', ?)",
      [systemWallet.id, commissionAmount, rentalId]
    );

    // 6. Update rental table
    await pool.query(
      "UPDATE rentals SET commission_amount = ?, commission_percentage = ?, payment_status = 'released_to_lessor' WHERE id = ?",
      [commissionAmount, commissionPercentage, rentalId]
    );

    return true;
  },

  // Request Withdrawal
  requestWithdrawal: async (userId, amount, method, accountDetails) => {
    const wallet = await Wallet.getWalletByUserId(userId);
    
    // Check if sufficient available balance
    if (wallet.available_balance < amount) {
      throw new Error("Insufficient available balance.");
    }

    // Deduct from available balance immediately to prevent double withdrawal
    await pool.query("UPDATE wallets SET available_balance = available_balance - ? WHERE id = ?", [amount, wallet.id]);

    // Create withdrawal request
    const [result] = await pool.query(
      "INSERT INTO withdrawal_requests (user_id, amount, method, account_details, status) VALUES (?, ?, ?, ?, 'pending')",
      [userId, amount, method, accountDetails]
    );

    // Log withdrawal transaction
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'withdrawal', ?, 'Withdrawal request created', ?)",
      [wallet.id, amount, result.insertId]
    );

    return result.insertId;
  },

  // Get user transactions
  getUserTransactions: async (userId) => {
    const wallet = await Wallet.getWalletByUserId(userId);
    const [rows] = await pool.query(
      "SELECT * FROM transactions WHERE wallet_id = ? ORDER BY created_at DESC", 
      [wallet.id]
    );
    return rows;
  },

  // Get Withdrawal Requests for user
  getWithdrawalRequests: async (userId) => {
    const [rows] = await pool.query(
      "SELECT * FROM withdrawal_requests WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  // Admin: Get all withdrawal requests with filtering
  getAllWithdrawals: async (status = null, search = null) => {
    let query = `
      SELECT w.*, u.Firstname, u.LastName, u.Email 
      FROM withdrawal_requests w 
      JOIN users u ON w.user_id = u.id
    `;
    const params = [];

    const conditions = [];
    if (status && status !== 'all') {
      conditions.push("w.status = ?");
      params.push(status);
    }

    if (search) {
      conditions.push("(u.Firstname LIKE ? OR u.LastName LIKE ? OR u.Email LIKE ? OR w.account_details LIKE ?)");
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY w.created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Admin: Get summary stats for withdrawals
  getWithdrawalStats: async () => {
    const [rows] = await pool.query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        SUM(amount) as total_amount 
      FROM withdrawal_requests 
      GROUP BY status
    `);
    return rows;
  },

  // Admin: Approve Withdrawal Request
  approveWithdrawal: async (withdrawalId, adminNotes) => {
    // If approved, the money is already deducted from available_balance when requested, 
    // we just update status.
    await pool.query(
      "UPDATE withdrawal_requests SET status = 'approved', admin_notes = ? WHERE id = ?",
      [adminNotes, withdrawalId]
    );
    return true;
  },

  // Admin: Reject Withdrawal Request
  rejectWithdrawal: async (withdrawalId, adminNotes) => {
    // Get the request details
    const [requests] = await pool.query("SELECT * FROM withdrawal_requests WHERE id = ?", [withdrawalId]);
    if (requests.length === 0) return false;
    
    const request = requests[0];
    
    // Update status to rejected
    await pool.query(
      "UPDATE withdrawal_requests SET status = 'rejected', admin_notes = ? WHERE id = ?",
      [adminNotes, withdrawalId]
    );

    // Refund the amount to the user's available balance
    const wallet = await Wallet.getWalletByUserId(request.user_id);
    await pool.query("UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?", [request.amount, wallet.id]);
    
    // Log refund transaction
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'withdrawal', ?, 'Withdrawal rejected (Refunded to wallet)', ?)",
      [wallet.id, request.amount, withdrawalId]
    );

    return true;
  },

  // Auto-release escrow for all completed rentals for a seller
  autoReleaseEscrow: async (sellerId) => {
    try {
      const [rentals] = await pool.query(
        `SELECT r.id, r.payment_status, r.dispute_status 
         FROM rentals r 
         JOIN rental_requests rr ON r.rental_request_id = rr.id
         WHERE rr.seller_id = ? AND r.end_datetime <= NOW() AND r.payment_status = 'held_in_escrow'`,
        [sellerId]
      );

      for (const rental of rentals) {
        // SAFETY CHECK: Never auto-release if there is a dispute
        if (rental.dispute_status !== 'none') {
          console.log(`[Auto-Release] Skipping disputed rental: ${rental.id}`);
          continue;
        }

        console.log(`[Auto-Release] Releasing funds for rental: ${rental.id}`);
        await Wallet.releaseEscrow(sellerId, rental.id, 10);
        await pool.query("UPDATE rentals SET payment_status = 'released_to_lessor' WHERE id = ?", [rental.id]);
      }
    } catch (error) {
      console.error("Auto-release error:", error);
    }
  },

  // Seller reports an issue: Release Rental Fee but LOCK Security Deposit
  reportRentalIssue: async (sellerId, rentalId, reason, imagePaths = []) => {
    const [rentals] = await pool.query(
      `SELECT r.*, rr.seller_id 
       FROM rentals r 
       JOIN rental_requests rr ON r.rental_request_id = rr.id 
       WHERE r.id = ?`, 
      [rentalId]
    );
    if (rentals.length === 0) throw new Error("Rental not found");
    const rental = rentals[0];

    if (rental.payment_status !== "held_in_escrow") {
      throw new Error("Funds are not in escrow.");
    }

    const totalRentalFee = parseFloat(rental.total_price);
    const depositAmount = parseFloat(rental.deposit_paid || 0);
    const commissionPercentage = 10;
    const commissionAmount = (totalRentalFee * commissionPercentage) / 100;
    const amountToSeller = totalRentalFee - commissionAmount;

    const sellerWallet = await Wallet._getWalletByUserIdInternal(sellerId);
    const systemWallet = await Wallet.getPlatformWallet();

    // 1. Release ONLY the Rental Fee (minus commission) to Seller
    await pool.query(
      "UPDATE wallets SET pending_balance = pending_balance - ?, available_balance = available_balance + ? WHERE id = ?", 
      [totalRentalFee + depositAmount, amountToSeller, sellerWallet.id]
    );

    // 2. Add commission to system
    await pool.query(
      "UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?",
      [commissionAmount, systemWallet.id]
    );

    // 3. Log transactions
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'escrow_release', ?, 'Partial release: Rental fee (Disputed)', ?)",
      [sellerWallet.id, amountToSeller, rentalId]
    );
    await pool.query(
      "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'commission_earned', ?, 'Commission from disputed rental', ?)",
      [systemWallet.id, commissionAmount, rentalId]
    );

    // 4. Build full dispute reason: include images JSON if present
    const fullReason = imagePaths.length > 0
      ? `${reason}\n__IMAGES__:${JSON.stringify(imagePaths)}`
      : reason;

    // 5. Update Rental Table: Mark as disputed and store the locked deposit amount
    await pool.query(
      "UPDATE rentals SET dispute_status = 'pending_resolution', dispute_reason = ?, dispute_opened_at = CURRENT_TIMESTAMP, payment_status = 'disputed', commission_amount = ? WHERE id = ?",
      [fullReason, commissionAmount, rentalId]
    );

    return true;
  },

  // Admin resolves the dispute: Manually distribute the security deposit
  resolveDispute: async (rentalId, amountToSeller, amountToBuyer, adminNotes) => {
    const [rentals] = await pool.query(
      `SELECT r.*, rr.seller_id, rr.buyer_id 
       FROM rentals r 
       JOIN rental_requests rr ON r.rental_request_id = rr.id 
       WHERE r.id = ?`, 
      [rentalId]
    );
    if (rentals.length === 0) throw new Error("Rental not found");
    const rental = rentals[0];

    if (rental.dispute_status !== "pending_resolution") {
      throw new Error("Rental is not in a disputed state.");
    }

    const sellerWallet = await Wallet._getWalletByUserIdInternal(rental.seller_id);
    const buyerWallet = await Wallet._getWalletByUserIdInternal(rental.buyer_id);

    // 1. Distribute Security Deposit
    if (amountToSeller > 0) {
      await pool.query("UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?", [amountToSeller, sellerWallet.id]);
      await pool.query(
        "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'escrow_release', ?, 'Dispute resolution: Damage compensation', ?)",
        [sellerWallet.id, amountToSeller, rentalId]
      );
    }

    if (amountToBuyer > 0) {
      await pool.query("UPDATE wallets SET available_balance = available_balance + ? WHERE id = ?", [amountToBuyer, buyerWallet.id]);
      await pool.query(
        "INSERT INTO transactions (wallet_id, type, amount, description, reference_id) VALUES (?, 'deposit_escrow', ?, 'Dispute resolution: Deposit refund', ?)",
        [buyerWallet.id, amountToBuyer, rentalId]
      );
    }

    // 2. Mark as resolved — embed amounts in notes for future display
    const resolutionNote = `\nAdmin Resolution: ${adminNotes}\n__SELLER_AWARD__:${amountToSeller}\n__BUYER_REFUND__:${amountToBuyer}`;
    await pool.query(
      "UPDATE rentals SET dispute_status = 'resolved', notes = CONCAT(COALESCE(notes,''), ?), payment_status = 'released_to_lessor' WHERE id = ?",
      [resolutionNote, rentalId]
    );

    return true;
  }
};

module.exports = Wallet;
