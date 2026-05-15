require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: { origin: "*" }
});

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // For local dev with many external scripts/fonts
}));
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

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
