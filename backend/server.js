require('dotenv').config(); // Must be at the very top to load env variables!
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
require('./config/redis'); // Initializes Redis automatically

// Connect Database
connectDB();

const app = express();

// Enterprise Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Enterprise MERN Engine is running smoothly!' });
});

// API Routes
const flashSaleRoutes = require('./routes/flashSaleRoutes');
app.use('/api/flash-sale', flashSaleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});