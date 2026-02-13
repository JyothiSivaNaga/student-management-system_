# 💰 Fees Module Setup Guide

## Database Setup

Run the following SQL queries in your MySQL database to create the required tables:

```sql
-- Create Fees Table
CREATE TABLE IF NOT EXISTS fees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL UNIQUE,
  total_fee DECIMAL(10, 2) NOT NULL,
  fee_due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create Payments Table
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
);
```

## Features Added

### 📊 Admin Features

1. **View All Fees** (`/admin/fees`)
   - See all students with their fee status
   - View summary cards (total students, paid, pending, total)
   - Filter by student
   - Quick action buttons

2. **Set Fees** (`/admin/fees/set`)
   - Set fee amount for any student
   - Set due date (optional)
   - Update existing fees

3. **Record Payments** (`/admin/fees/[id]/record-payment`)
   - Record payment for a student
   - Support multiple payment modes (Cash, Online, Cheque, DD)
   - Add transaction ID for online payments
   - Add notes

4. **Payment History** (`/admin/fees/[id]/history`)
   - View all payments for a student
   - See payment dates, amounts, modes
   - Track payment status

### 👨‍🎓 Student Features

1. **View My Fees** (`/students/fees`)
   - See total fee amount
   - See paid and pending amounts
   - View fee status (Paid/Partial/Pending)
   - See payment progress bar
   - View payment history

### 🔌 Backend API Endpoints

#### Admin Endpoints
- `GET /api/admin/fees` - Get all students' fees
- `GET /api/admin/fees/:studentId` - Get specific student's fees
- `POST /api/admin/fees` - Set or update fees
- `POST /api/admin/payments` - Record a payment
- `GET /api/admin/payments/:studentId` - Get student's payment history
- `GET /api/admin/payments/reports` - Get payment reports

#### Student Endpoints
- `GET /api/student/fees/:studentId` - Get own fees
- `GET /api/student/payments/:studentId` - Get own payment history

## Frontend Pages Structure

```
app/
├── admin/
│   └── fees/
│       ├── page.tsx (View all fees)
│       ├── set/
│       │   └── page.tsx (Set fee)
│       └── [id]/
│           ├── record-payment/
│           │   └── page.tsx (Record payment)
│           └── history/
│               └── page.tsx (Payment history)
└── (protected)/
    └── students/
        └── fees/
            └── page.tsx (Student view fees)
```

## Sidebar Navigation

Both admin and student menus have been updated:

**Admin Menu:**
- Fees Management
  - View Fees
  - Set Fee

**Student Menu:**
- 💰 Fees

## How to Use

### For Admin

1. **Set fees for a student:**
   - Go to Admin → Fees Management → Set Fee
   - Select student and enter fee amount
   - Optionally set due date

2. **Record payment:**
   - Go to Admin → Fees Management → View Fees
   - Click "Record Payment" for a student
   - Enter amount, payment mode, and optional transaction ID

3. **View payment history:**
   - Click "History" button next to a student
   - See all payments made

### For Student

1. **View fees:**
   - Go to Fees from sidebar
   - See total, paid, and pending amounts
   - View payment progress bar
   - Check payment history

## Payment Modes Supported

- Cash
- Online (with transaction ID)
- Cheque
- Demand Draft (DD)

## Fee Status Types

- **Paid** - Full amount paid
- **Partial** - Some amount paid but not complete
- **Pending** - No payment made yet
- **No Fee Set** - Fee not set by admin

## Notes

- All amounts are in Indian Rupees (₹)
- Payments are tracked by date and mode
- Student ID is retrieved from localStorage (set during login)
- Each student can have only one fee record
- Multiple payments can be made for the same student
