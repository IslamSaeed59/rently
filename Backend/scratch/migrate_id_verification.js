const pool = require("../Config/db");

async function migrate() {
  try {
    console.log("Starting migration...");
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN id_front VARCHAR(255), 
      ADD COLUMN id_back VARCHAR(255), 
      ADD COLUMN verification_status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified', 
      ADD COLUMN id_number VARCHAR(50)
    `);
    
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN') {
        console.log("Columns already exist.");
        process.exit(0);
    }
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
