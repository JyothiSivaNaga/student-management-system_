# Project Overview

## Purpose
This project is a student management system with a dedicated Fees module. It supports admin operations (setting fees, recording payments, viewing history) and student self-service (view fees and payment history).

## High-Level Architecture

Frontend (Next.js App Router)
  - UI pages for admin, faculty, and students
  - Shared layout and navigation

Backend (Node.js/Express)
  - REST API endpoints for fees and payments
  - Business rules and validation

Database (MySQL)
  - Fees and payments tables
  - Foreign key constraints and transaction history

## Core Modules

### Admin
- Fees dashboard and filters
- Set fee for a student
- Record payment (cash/online/cheque/DD)
- View payment history

### Student
- View personal fee summary
- Track paid vs pending amounts
- View payment history

## Key Workflows

### 1) Set Student Fee
Admin selects a student and sets total fee and due date.
The backend validates inputs and creates or updates the fee record.

### 2) Record Payment
Admin records a payment with amount and mode.
The backend validates amount <= pending fee and stores a payment record.

### 3) Student Views Fees
Student dashboard pulls fee summary and payment history via API and displays status.

## Data Model Summary
- fees
  - One fee record per student
  - Total fee, due date, timestamps
- payments
  - Multiple payments per student
  - Amount, mode, status, transaction reference, timestamps

## Validation Rules (Summary)
- Fee amount must be positive.
- Payment amount must be positive and not exceed pending fee.
- Online payments require a transaction id.

## Status Tracking
Fee status is derived from total vs paid amounts:
- Pending: paid = 0
- Partial: 0 < paid < total
- Paid: paid = total

## Notes
- Frontend and backend are separated for clarity.
- All fee and payment actions are recorded for audit and history views.
