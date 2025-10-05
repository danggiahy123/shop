require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
// const { createServer } = require('http');
// const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waterdg_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO connection handling (temporarily disabled)
// io.on('connection', (socket) => {
//   console.log(`🔌 User connected: ${socket.id}`);
//   
//   // Handle authentication
//   socket.on('authenticate', (token) => {
//     try {
//       const jwt = require('jsonwebtoken');
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//       socket.userId = decoded.userId;
//       socket.join(`user_${decoded.userId}`);
//       console.log(`✅ User authenticated: ${decoded.userId}`);
//     } catch (error) {
//       console.log(`❌ Authentication failed: ${error.message}`);
//       socket.disconnect();
//     }
//   });
//   
//   // Handle real-time notifications
//   socket.on('request_notifications', () => {
//     if (socket.userId) {
//       socket.join(`notifications_${socket.userId}`);
//     }
//   });
//   
//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log(`🔌 User disconnected: ${socket.id}`);
//   });
// });

// Make io available to routes
// app.set('io', io);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/waterdg_shop'}`);
  console.log(`🔌 Socket.IO temporarily disabled`);
});

module.exports = app;
