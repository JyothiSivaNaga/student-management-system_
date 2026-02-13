-- ============================================
-- FEES MODULE - DATABASE SETUP
-- ============================================

-- Run these queries in your MySQL database
-- Database: student_management

-- ============================================
-- CREATE FEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS fees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL UNIQUE,
  total_fee DECIMAL(10, 2) NOT NULL,
  fee_due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id)
);

-- ============================================
-- CREATE PAYMENTS TABLE
-- ============================================
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
  INDEX idx_student_id (student_id),
  INDEX idx_payment_date (payment_date)
);

-- ============================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert sample fees (uncomment to use)
-- INSERT INTO fees (student_id, total_fee, fee_due_date) VALUES
-- (1, 5000.00, '2026-02-28'),
-- (2, 5000.00, '2026-02-28'),
-- (3, 5000.00, '2026-02-28');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'student_management' 
AND TABLE_NAME IN ('fees', 'payments');

-- View fees table structure
DESCRIBE fees;

-- View payments table structure
DESCRIBE payments;

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- Get all fees with payment status
SELECT 
  st.id,
  st.name,
  f.total_fee,
  COALESCE(SUM(p.amount), 0) AS paid,
  f.total_fee - COALESCE(SUM(p.amount), 0) AS pending
FROM students st
LEFT JOIN fees f ON st.id = f.student_id
LEFT JOIN payments p ON st.id = p.student_id AND p.payment_status = 'Completed'
GROUP BY st.id, st.name, f.total_fee;

-- Get payment history for a student
SELECT 
  p.id,
  p.amount,
  p.payment_date,
  p.payment_mode,
  p.transaction_id,
  p.payment_status
FROM payments p
WHERE p.student_id = 1
ORDER BY p.payment_date DESC;

-- Get fees summary
SELECT 
  COUNT(DISTINCT f.student_id) AS total_students,
  SUM(f.total_fee) AS total_fees,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  SUM(f.total_fee) - COALESCE(SUM(p.amount), 0) AS total_pending
FROM fees f
LEFT JOIN payments p ON f.student_id = p.student_id AND p.payment_status = 'Completed';
