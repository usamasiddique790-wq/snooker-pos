# 🎱 Snooker POS System

A full-featured Snooker Club Point of Sale (POS) and Management System built with:

* React (Frontend)
* Node.js + Express (Backend)
* PostgreSQL (Database)
* JWT Authentication

---

# Features

## Authentication

* Secure Login System
* JWT Token Authentication
* Admin & Cashier Roles
* Protected APIs

---

## Table Management

* 18 Snooker Tables Support
* Real-time Table Status
* Available / Running States
* Live Session Tracking
* Modern Snooker Table UI

---

## Game Modes

Each table supports:

* Century (Hourly Billing)
* 1 Ball
* 6 Ball
* 10 Ball
* Full Frame

Admin can configure rates for all game modes.

---

## Session Management

* Start Game
* End Game
* Live Timer
* Live Bill Calculation
* Session History

---

## Billing System

* Automatic Invoice Generation
* Printable Receipt
* Invoice Number Format

Example:

SNK-00049

* Invoice Reprint
* Invoice Search

---

## Product Management

* Add Product
* Edit Product
* Delete Product
* Product Categories
* Stock Tracking

Products can be added directly to a running table bill.

---

## Sales Reports

* Date Range Reports
* Daily Reports
* Total Revenue
* Game Revenue
* Product Revenue
* Completed Sessions

Invoice list available inside reports.

---

## Dashboard

Shows:

* Total Tables
* Running Sessions
* Products Count
* Users Count
* Daily Revenue

---

## Credit / Udhar System

### Add Credit

Customer can leave remaining balance as credit.

Example:

Customer Bill = 1000

Paid = 700

Remaining = 300

Save as Udhar.

---

### Credit Features

* Save Credit
* Customer Name
* Invoice Reference
* Search Customer
* Partial Payment
* Full Payment Delete
* Real-time Credit Updates

---

## Cash Calculation

Daily Sales Report supports:

* Total Sale
* Total Credit
* Daily Expenditure
* Cash In Hand

Formula:

Cash In Hand =
Total Sale

* Total Credit
* Daily Expenditure

---

## Admin Features

### Users

* Create User
* Edit User
* Delete User

### Tables

* Update Century Rate
* Update 1 Ball Rate
* Update 6 Ball Rate
* Update 10 Ball Rate
* Update Full Frame Rate

### Products

* Full Product CRUD

---

# Database

Main Tables:

* users
* snooker_tables
* sessions
* products
* session_products
* credits
* credit_transactions

---

# API Modules

## Auth

* POST /auth/login

## Tables

* GET /tables/live
* PUT /tables/:id

## Sessions

* POST /sessions/start
* POST /sessions/end

## Products

* GET /products
* POST /products

## Reports

* GET /reports/sales
* GET /reports/invoice/:id

## Credits

* POST /credits/add
* POST /credits/payment
* GET /credits
* DELETE /credits/:id

---

# Current Status

✅ Authentication

✅ Dashboard

✅ Table Management

✅ Multiple Game Modes

✅ Product Billing

✅ Invoice Printing

✅ Invoice Reprint

✅ Sales Reports

✅ Credit / Udhar Management

✅ Partial Credit Payments

✅ Searchable Credits

🚧 Expense Management (Next)

🚧 Auto Stock Deduction

🚧 Low Stock Alerts

🚧 Backup & Restore

---

# Author

Usama Siddique
Snooker POS System
