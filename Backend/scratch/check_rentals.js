const pool = require('../Config/db'); 
async function run() { 
  try { 
    const [rows] = await pool.query('DESCRIBE rentals'); 
    console.log(JSON.stringify(rows, null, 2)); 
    
    const [reqRows] = await pool.query('DESCRIBE rental_requests');
    console.log("Rental Requests Schema:");
    console.log(JSON.stringify(reqRows, null, 2));
  } catch(e) { 
    console.error(e); 
  } 
  process.exit(0); 
} 
run();
