const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1;

// In-Memory state for developer offline mode fallback
let mockAlerts = [
    {
        _id: "mock_alert_1",
        userId: "mock_user",
        title: "Suspicious bank verification message",
        type: "sms",
        risk_level: "high",
        status: "active",
        explanation: "Urgent language detected requesting OTP from unknown sender. URL matches known phishing domain database.",
        createdAt: new Date(Date.now() - 2 * 3600000)
    },
    {
        _id: "mock_alert_2",
        userId: "mock_user",
        title: "Fake banking login page intercepted",
        type: "link",
        risk_level: "high",
        status: "active",
        explanation: "Browser blocked access to a domain registered 2 days ago masquerading as a major bank's login portal.",
        createdAt: new Date(Date.now() - 9 * 3600000)
    },
    {
        _id: "mock_alert_3",
        userId: "mock_user",
        title: "Unknown shortened payment URL in clipboard",
        type: "link",
        risk_level: "warning",
        status: "active",
        explanation: "A bit.ly redirect found in clipboard pointing to an unverified payment gateway. Destination URL unknown.",
        createdAt: new Date(Date.now() - 24 * 3600000)
    },
    {
        _id: "mock_alert_4",
        userId: "mock_user",
        title: "Calculator App requests Contacts & Microphone",
        type: "permission",
        risk_level: "warning",
        status: "active",
        explanation: "Calculator Pro is requesting microphone and contact access — permissions unrelated to its core function.",
        createdAt: new Date(Date.now() - 32 * 3600000)
    },
    {
        _id: "mock_alert_5",
        userId: "mock_user",
        title: "Unsecured public Wi-Fi connection detected",
        type: "system",
        risk_level: "warning",
        status: "active",
        explanation: "Device connected to 'Free_Airport_WiFi' — an open network with no encryption. Data may be exposed.",
        createdAt: new Date(Date.now() - 48 * 3600000)
    },
    {
        _id: "mock_alert_6",
        userId: "mock_user",
        title: "Security patch available — Android KB-2024-05",
        type: "system",
        risk_level: "low",
        status: "active",
        explanation: "A new OS security patch is available. Updating keeps your device protected against newly discovered vulnerabilities.",
        createdAt: new Date(Date.now() - 72 * 3600000)
    },
    {
        _id: "mock_alert_7",
        userId: "mock_user",
        title: "Fake delivery notification from unknown sender",
        type: "sms",
        risk_level: "high",
        status: "resolved",
        explanation: "User blocked the sender and reported to carrier. Threat neutralized.",
        createdAt: new Date(Date.now() - 96 * 3600000)
    },
    {
        _id: "mock_alert_8",
        userId: "mock_user",
        title: "Flashlight app location access revoked",
        type: "permission",
        risk_level: "warning",
        status: "resolved",
        explanation: "User revoked GPS permission from Flashlight App. Risk eliminated.",
        createdAt: new Date(Date.now() - 120 * 3600000)
    }
];

// @route   GET /api/alerts
// @desc    Get all active alerts for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log("Database offline. Serving mock alerts list.");
            return res.json(mockAlerts);
        }
        const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/alerts/:id/resolve
// @desc    Mark an alert as resolved
// @access  Private
router.post('/:id/resolve', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log(`Database offline. Resolving mock alert ${req.params.id} in-memory.`);
            const alert = mockAlerts.find(a => a._id === req.params.id);
            if (!alert) {
                return res.status(404).json({ message: 'Alert not found' });
            }
            alert.status = 'resolved';
            return res.json({ message: 'Alert resolved', alert });
        }

        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        // Make sure user owns alert
        if (alert.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        alert.status = 'resolved';
        await alert.save();

        res.json({ message: 'Alert resolved', alert });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Alert not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
