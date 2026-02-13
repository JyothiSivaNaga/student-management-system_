const db = require("./db");

console.log("🔍 Verifying Fees Module Setup...\n");

// Check if fees table exists
const checkFeesTable = () => {
  db.query(
    "SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'student_management' AND TABLE_NAME = 'fees'",
    (err, results) => {
      if (err) {
        console.error("❌ Error checking fees table:", err);
        return;
      }
      
      if (results.length > 0) {
        console.log("✅ Fees table exists");
      } else {
        console.log("❌ Fees table NOT FOUND - Running setup...");
        setupFeesTables();
      }
    }
  );
};

// Check if payments table exists
const checkPaymentsTable = () => {
  db.query(
    "SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'student_management' AND TABLE_NAME = 'payments'",
    (err, results) => {
      if (err) {
        console.error("❌ Error checking payments table:", err);
        return;
      }
      
      if (results.length > 0) {
        console.log("✅ Payments table exists");
      } else {
        console.log("❌ Payments table NOT FOUND - Running setup...");
        setupFeesTables();
      }
    }
  );
};

// Setup fees tables
const setupFeesTables = () => {
  const feesTableSql = `
    CREATE TABLE IF NOT EXISTS fees (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT NOT NULL UNIQUE,
      total_fee DECIMAL(10, 2) NOT NULL,
      fee_due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `;

  const paymentsTableSql = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      payment_mode ENUM('Cash', 'Online', 'Cheque', 'DD') NOT NULL,
      transaction_id VARCHAR(100),
      payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      INDEX (student_id, payment_date)
    )
  `;

  db.query(feesTableSql, (err) => {
    if (err) {
      console.error("❌ Error creating fees table:", err);
    } else {
      console.log("✅ Fees table created successfully");
    }
  });

  db.query(paymentsTableSql, (err) => {
    if (err) {
      console.error("❌ Error creating payments table:", err);
    } else {
      console.log("✅ Payments table created successfully");
    }
  });
};

// Run verification
setTimeout(() => {
  checkFeesTable();
  checkPaymentsTable();
}, 1000);

// Close connection after 3 seconds
setTimeout(() => {
  db.end();
  console.log("\n✅ Verification complete!");
}, 3000);
