# 🚀 Quick Start - Fees Module

## Step 1: Database Setup (5 minutes)

1. Open MySQL Workbench or any MySQL client
2. Connect to your `student_management` database
3. Copy and paste queries from `backend/SETUP_FEES_DATABASE.sql`
4. Run all queries

```sql
-- Copy from SETUP_FEES_DATABASE.sql and paste here
```

## Step 2: Verify Installation

```sql
-- Check if tables were created
DESCRIBE fees;
DESCRIBE payments;
```

Expected output:
```
fees table: id, student_id, total_fee, fee_due_date, created_at, updated_at
payments table: id, student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes, created_at
```

## Step 3: Start Backend

```bash
cd backend
npm start
```

Expected:
```
Server running on port 5000
MySQL Connected
```

## Step 4: Start Frontend

```bash
npm run dev
```

Expected:
```
▲ Next.js 16.1.1
- ready started server on 0.0.0.0:3000
```

## Step 5: Access the System

### 🔐 Login
- URL: http://localhost:3000/login
- Use admin account to test

### 👨‍💼 Admin Dashboard
- Navigate to: **Fees Management** → **View Fees**
- URL: http://localhost:3000/admin/fees

### 📋 Admin Actions
1. **Set Fee**: Click "+ Set Fee" button
2. **Record Payment**: Click "Record Payment" button
3. **View History**: Click "History" button

### 👨‍🎓 Student Portal
- Navigate to: **💰 Fees**
- URL: http://localhost:3000/students/fees
- See fee details and payment history

## Admin Workflow

```
Set Student Fee
    ↓
View Fee Status
    ↓
Record Payment
    ↓
View Payment History
    ↓
Track Progress
```

## Student Workflow

```
Login
    ↓
Click "Fees" in Sidebar
    ↓
View Fee Amount
    ↓
Check Payment History
    ↓
See Payment Progress
```

## Key Features at a Glance

### Admin
✅ Set fees for any student
✅ Record payments (Cash, Online, Cheque, DD)
✅ View payment history
✅ Track fee status per student
✅ Summary dashboard

### Student
✅ View total fee amount
✅ See paid vs pending amount
✅ Visual progress bar
✅ Complete payment history
✅ Fee status indicator

## Files Created/Modified

### New Files (5)
```
✓ app/admin/fees/page.tsx
✓ app/admin/fees/set/page.tsx
✓ app/admin/fees/[id]/record-payment/page.tsx
✓ app/admin/fees/[id]/history/page.tsx
✓ app/(protected)/students/fees/page.tsx
```

### Database Files (1)
```
✓ backend/SETUP_FEES_DATABASE.sql
✓ backend/fees_tables.sql
```

### Backend Modified (1)
```
✓ backend/server.js (Added 195 lines - 9 endpoints)
```

### Frontend Modified (1)
```
✓ components/Sidebar.tsx (Added fees navigation)
```

### Documentation (2)
```
✓ FEES_MODULE_SETUP.md
✓ FEES_MODULE_SUMMARY.md
```

## API Endpoints Summary

### Admin Endpoints
```
GET    /api/admin/fees                - Get all fees
GET    /api/admin/fees/:studentId     - Get student fee
POST   /api/admin/fees                - Set/update fee
POST   /api/admin/payments            - Record payment
GET    /api/admin/payments/:studentId - Get payment history
GET    /api/admin/payments/reports    - Get reports
```

### Student Endpoints
```
GET    /api/student/fees/:studentId      - Get own fee
GET    /api/student/payments/:studentId  - Get own payments
```

## Troubleshooting

### Issue: "Table 'fees' doesn't exist"
**Solution**: Run the SQL queries from SETUP_FEES_DATABASE.sql

### Issue: "Cannot GET /api/admin/fees"
**Solution**: Restart backend - `npm start`

### Issue: "Failed to fetch fees"
**Solution**: 
1. Check if backend is running on port 5000
2. Check browser console for errors
3. Verify database tables exist

### Issue: "Student ID is undefined"
**Solution**: Student ID should be stored in localStorage during login
- Check login endpoint stores studentId
- Current: Stored as `localStorage.getItem("studentId")`

## Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database tables created
- [ ] Can set fee for a student
- [ ] Can record payment
- [ ] Can view payment history
- [ ] Student can see their fees
- [ ] Sidebar navigation works
- [ ] No console errors
- [ ] Payment validation works (no overpayment)

## Contact & Support

For any issues:
1. Check console errors (F12)
2. Check network tab for API responses
3. Verify database has data
4. Restart backend and frontend

## Next Steps

1. Add test data (optional)
2. Test complete workflow
3. Consider adding:
   - Email notifications
   - Payment receipts
   - Fee reports
   - Installment plans
