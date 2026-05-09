const pool = require('../Config/db'); 
async function run() { 
  try { 
    await pool.query("ALTER TABLE rental_requests MODIFY COLUMN payment_method ENUM('cash', 'vodafone_cash', 'instapay', 'wallet') NOT NULL"); 
    await pool.query("ALTER TABLE rentals MODIFY COLUMN payment_method ENUM('cash', 'vodafone_cash', 'instapay', 'wallet') NOT NULL"); 
    console.log('Database updated successfully'); 
  } catch(e) { 
    console.error(e); 
  } 
  process.exit(0); 
} 
run();
