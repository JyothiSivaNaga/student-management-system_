# Student Management System

Full-stack student management system with a dedicated Fees module for admin and student workflows.

## What This Project Includes

- Admin workflows: set fees, record payments, view payment history
- Student workflows: view fee summary and payment history
- Backend REST API for fees and payments
- MySQL database schema and sample data

For deeper details, see [FEES_MODULE_COMPLETE.md](FEES_MODULE_COMPLETE.md) and [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript
- Backend: Node.js, Express
- Database: MySQL

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+

## Complete Setup Steps

### 1) Clone and install frontend dependencies

```bash
npm install
```

### 2) Configure the database connection

Edit the MySQL credentials in [backend/db.js](backend/db.js) to match your local setup.

### 3) Create the database and tables

Run the SQL in [backend/SETUP_FEES_DATABASE.sql](backend/SETUP_FEES_DATABASE.sql) using MySQL Workbench or the MySQL CLI.

### 4) Install backend dependencies

```bash
cd backend
npm install
```

### 5) Start the backend API

```bash
npm run dev
```

### 6) Start the frontend

Open a new terminal at the project root:

```bash
npm run dev
```

### 7) Verify the app

- Frontend: http://localhost:3000
- Check server logs for "MySQL Connected"

## Useful Scripts

Frontend:

- `npm run dev` - Start the Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Run the production build

Backend (run inside `backend/`):

- `npm run dev` - Start backend with nodemon
- `npm run start` - Start backend with node

## Folder Structure (Key)

- [app/](app/) - Next.js pages and layouts
- [backend/](backend/) - Express API and database setup
- [components/](components/) - Shared UI components

## Notes

- If MySQL connection fails, verify credentials in [backend/db.js](backend/db.js).
- If ports are busy, stop conflicting processes or change ports in your local setup.
