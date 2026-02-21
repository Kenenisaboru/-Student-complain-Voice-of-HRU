const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Import DB connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'VoiceHU API is running',
        timestamp: new Date().toISOString()
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found.`
    });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 VoiceHU Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
