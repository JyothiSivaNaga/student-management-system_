# 🔧 Fees Module Troubleshooting Guide

## Issue: Fees module is not working

### Root Causes Fixed:
1. **Field Name Mismatch** - Backend returned `fee_status` but frontend expected `status` ✅ FIXED
2. **Student Name Field** - Backend returned `name` separately, frontend expected `student_name` ✅ FIXED
3. **Database Tables** - May not be initialized

---

## How to Verify & Fix

### Step 1: Check Database Setup
Run the verification script:
```bash
cd backend
node SETUP_VERIFICATION.js
```

Expected output:
```
✅ Fees table exists
✅ Payments table exists
```

### Step 2: If Tables Don't Exist
Run the setup SQL:
```bash
cd backend
node -e "const db = require('./db'); const fs = require('fs'); const sql = fs.readFileSync('fees_tables.sql', 'utf8'); sql.split(';').forEach(s => s.trim() && db.query(s)); setTimeout(() => db.end(), 2000);"
```

Or manually in MySQL:
```bash
mysql -u root -p student_management < fees_tables.sql
```

### Step 3: Restart Backend Server
```bash
cd backend
npm install  # (if needed)
node server.js
```

You should see:
```
MySQL Connected
Server running on port 5000
```

### Step 4: Test API Endpoints

#### Test 1: Get all fees (Admin)
```bash
curl http://localhost:5000/api/admin/fees
```

Expected response (array of fee objects with `student_name`, `total_fee`, `paid_amount`, `pending_amount`, `status`):
```json
[
  {
    "id": 1,
    "student_name": "John Doe",
    "email": "john@example.com",
    "total_fee": "50000.00",
    "paid_amount": "25000.00",
    "pending_amount": "25000.00",
    "status": "Partial",
    "fee_due_date": "2026-03-31"
  }
]
```

#### Test 2: Get student fees
```bash
curl http://localhost:5000/api/student/fees/1
```

### Step 5: Frontend Test
- Open http://localhost:3000 in browser
- Login as admin or student
- Navigate to Fees section
- Should see data from API

---

## Common Issues & Solutions

### ❌ "Cannot GET /api/admin/fees"
**Problem**: Backend server not running
**Solution**: 
```bash
cd backend
node server.js
```

### ❌ "Tables don't exist"
**Problem**: Database not initialized
**Solution**: Run `node SETUP_VERIFICATION.js` or manually import `fees_tables.sql`

### ❌ "CORS errors in browser console"
**Problem**: Frontend and backend on different domains
**Solution**: Ensure backend is running on `http://localhost:5000` and CORS is enabled (it is in server.js)

### ❌ "Empty fees list in frontend"
**Problem**: No fees data in database OR no students exist
**Solution**: 
1. Add students first via `/api/students`
2. Add fees via `/api/admin/fees` POST endpoint
3. Add payments via `/api/admin/payments` POST endpoint

---

## API Endpoints Reference

### Admin Endpoints
- `GET /api/admin/fees` - Get all student fees ✅
- `GET /api/admin/fees/:studentId` - Get specific student fee
- `POST /api/admin/fees` - Set/update fee for student
- `GET /api/admin/payments/:studentId` - Get payment history
- `POST /api/admin/payments` - Record a payment
- `GET /api/admin/payments/reports` - Get payment reports

### Student Endpoints
- `GET /api/student/fees/:studentId` - View own fees
- `GET /api/student/payments/:studentId` - View own payment history

---

## Data Model

### Fees Table
```sql
CREATE TABLE fees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL UNIQUE,
  total_fee DECIMAL(10, 2),
  fee_due_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP,
  payment_mode ENUM('Cash', 'Online', 'Cheque', 'DD'),
  transaction_id VARCHAR(100),
  payment_status ENUM('Pending', 'Completed', 'Failed'),
  notes TEXT
);
```

---

## Quick Test Script

Create `backend/test_fees.js`:
```javascript
const db = require('./db');

// Add test fee
const addFee = () => {
  db.query(
    "INSERT INTO fees (student_id, total_fee, fee_due_date) VALUES (1, 50000, '2026-03-31')",
    (err) => {
      if (err) console.error("Error:", err);
      else console.log("✅ Test fee added");
    }
  );
};

// Add test payment
const addPayment = () => {
  db.query(
    "INSERT INTO payments (student_id, amount, payment_mode, payment_status) VALUES (1, 25000, 'Online', 'Completed')",
    (err) => {
      if (err) console.error("Error:", err);
      else console.log("✅ Test payment added");
    }
  );
};

setTimeout(() => {
  addFee();
  addPayment();
  setTimeout(() => db.end(), 1000);
}, 500);
```

Run with: `node backend/test_fees.js`

---

## Still Not Working?

Check:
1. MySQL is running: `mysql -u root -p` (should connect)
2. Database exists: `SHOW DATABASES;` should list `student_management`
3. Tables exist: `SHOW TABLES;` should list `fees` and `payments`
4. Backend logs for errors: Check console output when running `node server.js`
5. Browser DevTools: F12 → Network tab → Check API response

