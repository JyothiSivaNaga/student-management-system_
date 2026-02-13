-- ============================================
-- SAMPLE FEES AND PAYMENTS DATA
-- ============================================
-- Run this script to populate sample data
-- Database: student_management

-- ============================================
-- 1. FIRST - CHECK EXISTING STUDENTS
-- ============================================
-- Run this to see what student IDs exist
SELECT id, name, email FROM students LIMIT 20;

-- ============================================
-- 2. INSERT SAMPLE FEES DATA
-- ============================================
-- Note: Modify student_id values based on your actual students
-- If your students are IDs 5,6,7 then use those instead of 1,2,3

INSERT IGNORE INTO fees (student_id, total_fee, fee_due_date) VALUES
(1, 5000.00, '2026-03-31'),
(2, 6000.00, '2026-03-31'),
(3, 5500.00, '2026-03-31'),
(4, 5000.00, '2026-03-31'),
(5, 6000.00, '2026-03-31');

-- ============================================
-- 3. INSERT SAMPLE PAYMENT DATA
-- ============================================

-- Student 1: Pending (No payments)
-- No records - fee is completely pending

-- Student 2: Partial Payment (3000 paid out of 6000)
INSERT INTO payments (student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes) VALUES
(2, 3000.00, '2026-01-10', 'Online', 'TXN001', 'Completed', 'First installment'),
(2, 1000.00, '2026-01-20', 'Cash', NULL, 'Completed', 'Second installment');

-- Student 3: Paid in Full (5500 paid out of 5500)
INSERT INTO payments (student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes) VALUES
(3, 5500.00, '2026-01-05', 'Cheque', 'CHQ12345', 'Completed', 'Full payment via cheque');

-- Student 4: Partial Payment (2000 paid out of 5000)
INSERT INTO payments (student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes) VALUES
(4, 2000.00, '2026-01-15', 'DD', 'DD98765', 'Completed', 'Demand Draft payment');

-- Student 5: Partial Payment (4500 paid out of 6000)
INSERT INTO payments (student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes) VALUES
(5, 2500.00, '2026-01-08', 'Online', 'TXN002', 'Completed', 'Online transfer'),
(5, 2000.00, '2026-01-18', 'Cash', NULL, 'Completed', 'Cash payment');

-- ============================================
-- 4. VERIFY DATA WAS INSERTED
-- ============================================

-- View all fees
SELECT 'FEES TABLE' AS 'Info';
SELECT * FROM fees;

-- View all payments
SELECT 'PAYMENTS TABLE' AS 'Info';
SELECT * FROM payments;

-- View comprehensive fee status
SELECT 'FEE STATUS REPORT' AS 'Info';
SELECT 
  st.id,
  st.name,
  f.total_fee,
  COALESCE(SUM(p.amount), 0) AS paid_amount,
  f.total_fee - COALESCE(SUM(p.amount), 0) AS pending_amount,
  CASE 
    WHEN f.total_fee = 0 THEN 'No Fee Set'
    WHEN COALESCE(SUM(p.amount), 0) = 0 THEN 'Pending'
    WHEN COALESCE(SUM(p.amount), 0) < f.total_fee THEN 'Partial'
    ELSE 'Paid'
  END AS status
FROM students st
LEFT JOIN fees f ON st.id = f.student_id
LEFT JOIN payments p ON st.id = p.student_id AND p.payment_status = 'Completed'
GROUP BY st.id, st.name, f.total_fee
ORDER BY st.id;

-- View payment history
SELECT 'PAYMENT HISTORY' AS 'Info';
SELECT 
  p.id,
  st.name AS student_name,
  p.amount,
  p.payment_date,
  p.payment_mode,
  p.transaction_id,
  p.payment_status
FROM payments p
JOIN students st ON p.student_id = st.id
ORDER BY p.payment_date DESC;

-- Summary Statistics
SELECT 'SUMMARY STATISTICS' AS 'Info';
SELECT 
  COUNT(DISTINCT f.student_id) AS total_students_with_fees,
  SUM(f.total_fee) AS total_fees,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  SUM(f.total_fee) - COALESCE(SUM(p.amount), 0) AS total_pending,
  ROUND((COALESCE(SUM(p.amount), 0) / SUM(f.total_fee) * 100), 2) AS percentage_paid
FROM fees f
LEFT JOIN payments p ON f.student_id = p.student_id AND p.payment_status = 'Completed';
