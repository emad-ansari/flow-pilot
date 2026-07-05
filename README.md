# FlowPilot 🚀

> A modern full-stack order management system built with **React, Node.js, Express, TypeScript, MongoDB**, and an automated scheduler for order status progression.

## 📖 Overview

OrderPilot is a mini Order Management System that allows users to create and manage customer orders while automatically progressing order statuses using a scheduled background task.

The project demonstrates backend API design, database modeling, scheduler implementation, React dashboard development, and clean architecture.

---

# ✨ Features

## Order Management

- Create new orders
- View all orders
- Search by customer name or phone number
- Filter by order status
- Pagination support
- Payment status tracking

## Automated Scheduler

- Runs every **5 minutes**
- Automatically updates:
  - **Placed → Processing** (after 10 minutes)
  - **Processing → Ready To Ship** (after 20 minutes)
- Maintains complete order status history
- Stores scheduler execution logs
- Protected using a secret header

## Dashboard

- Responsive React Dashboard
- Orders Table
- Scheduler Logs
- Status Filter
- Search
- Pagination
- Loading, Empty and Error States

---

# 🏗 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- node-cron

---

# 📂 Project Structure

```
flow-pilot/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── src/
│     │
│     ├── config/
│     ├── controllers/
│     ├── cron/
│     ├── middlewares/
│     ├── models/
│     ├── routes/
│     ├── services/
│     ├── validators/
│     ├── utils/
│     └── server.ts
│
└── README.md
```

---

# 🗄 Database Design

## Orders Collection

Stores all customer orders.

Fields

- customerName
- phone
- productName
- amount
- paymentStatus
- orderStatus
- statusHistory
- createdAt
- updatedAt

---

## Scheduler Logs Collection

Stores every scheduler execution.

Fields

- runTime
- checked
- updated
- duration
- status
- trigger
- createdAt
- updatedAt

---

# 📜 Order Status Flow

```
Placed
   │
   │ (10 Minutes)
   ▼
Processing
   │
   │ (20 Minutes)
   ▼
Ready To Ship
```

Every transition is stored inside the `statusHistory` array.

---

# ⏰ Scheduler

The scheduler runs every **5 minutes** using **node-cron**.

Responsibilities

- Fetch eligible orders
- Check order age
- Update order status
- Maintain status history
- Store scheduler execution logs

---

# 🔒 Scheduler Security

Scheduler endpoint is protected using a secret header.

```
x-scheduler-secret: YOUR_SECRET
```

Unauthorized requests receive **401 Unauthorized**.

---

# ⚡ Race Condition Handling

To reduce race conditions, each update operation verifies both:

- MongoDB `_id`
- Current `orderStatus`

before updating the document.

This prevents duplicate status transitions if multiple scheduler executions overlap.

---

# 📑 API Documentation

## Orders

### Create Order

```
POST /api/orders
```

### Get Orders

```
GET /api/orders
```

Query Parameters

| Parameter | Description |
| ---------- | ----------- |
| page | Page number |
| limit | Items per page |
| orderStatus | Filter by status |
| search | Customer name or phone |

---

## Scheduler

### Run Scheduler

```
POST /api/scheduler/run
```

Headers

```
x-scheduler-secret
```

---

### Scheduler Logs

```
GET /api/scheduler/logs
```

---

# 🌍 Environment Variables

Backend

```env
PORT=5000

MONGODB_URI=

SCHEDULER_SECRET=

ENABLE_CRON=true

NODE_ENV=development
```

Frontend

```env
VITE_API_BASE_URL=
```

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/your-username/orderpilot.git
```

---

## Backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

---

# ⏱ Scheduler Setup

The scheduler uses **node-cron**.

To enable it:

```env
ENABLE_CRON=true
```

Cron Expression

```
*/5 * * * *
```

During development you can temporarily change it to:

```
* * * * *
```

to execute every minute.

---

# 📬 Postman Collection

A Postman collection containing all APIs is included in the repository.

- Orders APIs
- Scheduler APIs

---

# 💡 Design Decisions

### Why MongoDB?

MongoDB provides a flexible schema and allows embedding `statusHistory` directly inside each order, reducing joins and simplifying reads.

### Why Service Layer?

Business logic is isolated from controllers, improving maintainability and testability.

### Why node-cron?

Simple and lightweight solution for scheduled background tasks during local development and deployment on traditional Node.js hosting platforms.

### Why Bulk Updates?

Scheduler uses MongoDB bulk operations to efficiently update multiple orders in a single database call.

---


# 👨‍💻 Author

**Mohammad Emad**

Full Stack Developer