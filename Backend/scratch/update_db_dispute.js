const pool = require('../Config/db'); 
async function run() { 
  try { 
    // Add dispute columns to rentals table
    await pool.query(`
      ALTER TABLE rentals 
      ADD COLUMN dispute_status ENUM('none', 'pending_resolution', 'resolved') DEFAULT 'none',
      ADD COLUMN dispute_reason TEXT,
      ADD COLUMN dispute_opened_at DATETIME
    `);
    console.log('Database updated: Dispute columns added to rentals table.');
  } catch(e) { 
    if (e.code === 'ER_DUP_COLUMN_NAME') {
        console.log('Columns already exist, skipping.');
    } else {
        console.error(e); 
    }
  } 
  process.exit(0); 
} 
run();
