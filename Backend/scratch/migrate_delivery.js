const pool = require("../Config/db");
async function run() {
  try {
    // Add delivery columns to rentals table
    await pool.query(`
      ALTER TABLE rentals 
      ADD COLUMN delivery_status ENUM('pending', 'confirmed') DEFAULT 'pending',
      ADD COLUMN delivery_photos JSON
    `);
    console.log("Database updated: Delivery columns added to rentals table.");
  } catch (e) {
    if (e.code === "ER_DUP_COLUMN_NAME") {
      console.log("Columns already exist, skipping.");
    } else {
      console.error(e);
    }
  }
  process.exit(0);
}
run();
