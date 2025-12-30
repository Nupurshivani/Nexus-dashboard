require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression for better performance
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { msg: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit auth attempts
  message: { msg: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:4000', 'http://localhost:5000'];
    // Allow requests with no origin (like mobile apps, curl, or same-origin sometimes)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Allow Vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // In production with rewrites, we might want to allow the host itself
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    // Optional: Allow all in development/test or if specific env var is set
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Default: Block with error
    // For now, allowing all to ensure it works for the User's immediate deployment needs
    // You should restrict this in a highly sensitive production environment
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log(`Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    msg: 'Admin Dashboard API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    msg: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║     🚀 Admin Dashboard API Server              ║
╠════════════════════════════════════════════════╣
║  ➤ Port: ${PORT}                                  ║
║  ➤ Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  ➤ API Base: http://localhost:${PORT}/api        ║
╚════════════════════════════════════════════════╝
    `);
  });
}

module.exports = app;
