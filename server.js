require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000'
];

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://apis.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://ui-avatars.com"],
            connectSrc: ["'self'", "ws:", "wss:", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"],
            frameSrc: ["'self'", "https://cyberguard-349a5.firebaseapp.com"]
        }
    }
}));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Input Sanitization Middleware to prevent XSS
const sanitizeInput = (req, res, next) => {
    // Skip sanitization for AI Agent endpoints to preserve natural punctuation (like apostrophes/quotes)
    if (req.path === '/api/agent/analyze' || req.path.startsWith('/api/agent/')) {
        return next();
    }
    const sanitizeValue = (val) => {
        if (typeof val === 'string') {
            return val
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        }
        if (typeof val === 'object' && val !== null) {
            for (let key in val) {
                if (Object.prototype.hasOwnProperty.call(val, key)) {
                    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                        continue;
                    }
                    val[key] = sanitizeValue(val[key]);
                }
            }
        }
        return val;
    };
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
};
app.use(sanitizeInput);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection...');
    socket.on('disconnect', () => {
        console.log('User has left');
    });
});

// Make io accessible to routes
app.set('io', io);

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/scan', require('./routes/scan'));
app.use('/api/scan_v2', require('./routes/scan_v2'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/agent', require('./routes/agent'));
app.use('/api/user', require('./routes/user'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/support', require('./routes/support'));
app.use('/api/threats', require('./routes/threats'));

// Serve static assets (frontend)
app.use(express.static(__dirname));

// Catch-all route removed for static files compatibility

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT} - Mobile Access Enabled`));
