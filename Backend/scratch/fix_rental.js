const pool = require('../Config/db');
async function fix() {
  try {
    await pool.query("UPDATE rentals SET payment_status = 'held_in_escrow' WHERE id = 18");
    console.log('Rental 18 status updated to held_in_escrow');
  } catch (err) {
    console.error('Error fixing rental:', err);
  } finally {
    process.exit();
  }
}
fix();
