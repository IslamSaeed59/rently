const pool = require('../Config/db');
async function check() {
  try {
    const [wallets] = await pool.query("SELECT * FROM wallets");
    console.log("--- WALLETS ---");
    console.table(wallets);

    const [rentals] = await pool.query("SELECT id, total_price, deposit_paid, payment_status, dispute_status FROM rentals ORDER BY id DESC LIMIT 5");
    console.log("--- RECENT RENTALS ---");
    console.table(rentals);

    const [transactions] = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5");
    console.log("--- RECENT TRANSACTIONS ---");
    console.table(transactions);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
check();
