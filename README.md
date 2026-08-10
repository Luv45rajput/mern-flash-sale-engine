# Amazon-Scale Flash Sale Engine

A high-concurrency e-commerce flash sale backend engine designed to prevent overselling during high-demand events. This project demonstrates advanced distributed systems concepts, including atomic memory-level locking, idempotency guarantees, and dual-layer architecture (In-Memory Cache + Persistent Storage).

## 🚀 Key Architectural Features

- **High-Concurrency Race Condition Prevention**: Utilizes **Redis atomic operations (`decrBy`)** to handle stock decrements in memory. This eliminates the race conditions inherent in database read-modify-write cycles, ensuring stock is never oversold even under extreme traffic.
- **Dual-Layer Data Strategy**:
    - **Redis (In-Memory Cache)**: Serves as the high-speed bottleneck tier to validate stock and perform instantaneous decrements.
    - **MongoDB (Persistent Storage)**: Acts as the durable system of record for final order transactions and inventory synchronization.
- **Idempotency Guarantee**: Implements strict idempotency checks using unique keys for every checkout request, preventing duplicate charges or race-condition transaction overlaps in the event of network retries.
- **MERN Stack Integration**: A robust full-stack implementation using MongoDB, Express.js, React (with Vite), and Node.js.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching/Concurrency**: Redis (In-Memory)
- **Frontend**: React.js, Vite, Axios
- **Security**: Helmet, CORS

## 🏗 System Design Overview

The engine processes flash sales by decoupling the high-traffic validation from long-running database transactions:

1. **Request Received**: API endpoint receives a checkout request with an idempotency key.
2. **Idempotency Check**: The system verifies in MongoDB if the request has already been processed.
3. **Atomic Decrement**: The system attempts an atomic `DECRBY` operation on the Redis stock key.
4. **Transaction Commitment**: If stock is available, a success record is created in MongoDB and the primary database stock is updated asynchronously.

## 📦 How to Run

1. **Clone the repository.**
2. **Setup environment**: Ensure a local MongoDB instance is running and Redis is configured.
3. **Start Backend**:
   ```bash
   cd backend
   npm run dev