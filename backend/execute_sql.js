const mysql = require("mysql2");
const fs = require("fs");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Enter your MySQL password here
  database: "student_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to database");

  // Read SQL file
  const sql = fs.readFileSync("./SETUP_FEES_DATABASE.sql", "utf8");
  
  // Split by semicolon and execute each query
  const queries = sql.split(";").filter(q => q.trim().length > 0);
  
  let executed = 0;
  
  queries.forEach((query, index) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(`❌ Error in query ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Query ${index + 1} executed successfully`);
        executed++;
      }
      
      if (executed === queries.length) {
        console.log("\n🎉 All SQL queries executed successfully!");
        console.log("Fees and Payments tables are now created!");
        db.end();
        process.exit(0);
      }
    });
  });
});
