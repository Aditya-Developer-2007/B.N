require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { autoSeedIfEmpty } = require('./controllers/catalogController');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Lightweight)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Central API Routes under /api
app.use('/api', apiRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    company: 'B.N Enterprises',
    division: 'Wholesale Cosmetic Dealer & Distribution Hub',
    phone: '8527606769',
    helpline: '+91 8527606769',
    status: 'Operational',
    endpoints: {
      health: '/api/health',
      catalog: '/api/catalog',
      enquiries: '/api/enquiries',
    },
  });
});

// Database Connection & Auto-Seed
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/bn_enterprises';

mongoose
  .connect(MONGO_URI)
  .then(async (conn) => {
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  })
  .catch((err) => {
    console.warn(`[MongoDB] Offline or unreachable (${err.message}). Running with high-availability in-memory catalog and enquiry buffer.`);
  });

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on B.N Enterprises API server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Wholesale Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  B.N Enterprises B2B Backend API Server`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Health Desk: http://localhost:${PORT}/api/health`);
  console.log(`  Catalog API: http://localhost:${PORT}/api/catalog`);
  console.log(`  Trade Desk: 8527606769`);
  console.log('====================================================');
});
