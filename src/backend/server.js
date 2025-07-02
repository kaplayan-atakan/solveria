const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import route modules
const signupRoutes = require('./routes/signup-api');
const ocrRoutes = require('./routes/ocr-api');
const solverRoutes = require('./routes/solver-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:8080'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/solveria';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Connected to: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Don't exit in development, just warn
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            console.warn('⚠️  Running without database in development mode');
        }
    }
};

// Connect to database
connectDB();

// API Routes
app.use('/', signupRoutes);
app.use('/', ocrRoutes);
app.use('/', solverRoutes);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/solveria-landing.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/signup-form.html'));
});

app.get('/solve', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/math-solver.html'));
});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/text-editor.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/test.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Solveria API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: Object.values(error.errors).map(e => e.message)
        });
    }
    
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry'
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Solveria server running on port ${PORT}`);
    console.log(`🌐 Landing page: http://localhost:${PORT}`);
    console.log(`📝 Signup: http://localhost:${PORT}/signup`);
    console.log(`🧮 Math Solver: http://localhost:${PORT}/solve`);
    console.log(`📋 Text Editor: http://localhost:${PORT}/editor`);
});

module.exports = app;
