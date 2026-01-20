const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const helmet = require('helmet');



// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const imageRoutes = require('./routes/imageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();
// helmet middleware
app.use(helmet());

// Connect to database
connectDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// ---------------- HEALTH CHECK (PUBLIC) ----------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ---------------- API ROUTES ----------------
// Routes with authentication middleware applied at route level
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {

  // Clerk unauthenticated error fix
  if (err?.message === 'Unauthenticated') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid or missing token'
    });
  }

  console.error('Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ---------------- 404 HANDLER ----------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
