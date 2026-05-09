const pool = require('../Config/db');
const Wallet = require('../Src/Models/Wallet');
const Rental = require('../Src/Models/Rental/Rentals');

async function fix() {
  try {
    const rentalId = 28;
    const [rentals] = await pool.query(
      `SELECT r.*, rr.seller_id 
       FROM rentals r 
       JOIN rental_requests rr ON r.rental_request_id = rr.id 
       WHERE r.id = ?`, 
      [rentalId]
    );
    const rental = rentals[0];

    if (rental && rental.payment_status === 'held_in_escrow') {
      console.log(`Manually releasing funds for Rental ${rentalId} (Seller: ${rental.seller_id})...`);
      await Wallet.releaseEscrow(rental.seller_id, rentalId, 10);
      await pool.query("UPDATE rentals SET payment_status = 'released_to_lessor', status = 'returned' WHERE id = ?", [rentalId]);
      console.log("Done! Funds should be in Available Balance now.");
    } else {
      console.log("Rental already released or not found.");
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
fix();
