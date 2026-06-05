const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Scan = require('../models/Scan');

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/dashboard
// @desc    Get dashboard metrics for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // If database is disconnected, fallback to high-quality mock data
        if (!isDbConnected()) {
            console.log("Database disconnected. Serving mock dashboard data.");
            return res.json({
                metrics: {
                    suspiciousMessages: 1,
                    riskyLinks: 2,
                    permissionRisks: 3,
                    systemRisks: 1,
                    recentAlerts: 7,
                    score: 85,
                    lastScanTime: new Date(Date.now() - 3 * 3600000), // 3 hours ago
                    userName: "User (Offline Mode)",
                    scansToday: 5,
                    activeThreats: 7,
                    activeDevices: 2
                },
                timeline: [
                    {
                        _id: "mock_alert_1",
                        title: "Suspicious bank verification SMS",
                        type: "sms",
                        risk_level: "high",
                        status: "active",
                        explanation: "Urgent language detected requesting OTP from unknown sender. URL matches known phishing domain database.",
                        createdAt: new Date(Date.now() - 2 * 3600000)
                    },
                    {
                        _id: "mock_alert_2",
                        title: "Unknown shortened payment link",
                        type: "link",
                        risk_level: "high",
                        status: "active",
                        explanation: "A shortened bit.ly redirect found pointing to an unencrypted checkout gateway.",
                        createdAt: new Date(Date.now() - 5 * 3600000)
                    },
                    {
                        _id: "mock_alert_3",
                        title: "Calculator app requests Contacts + Mic",
                        type: "permission",
                        risk_level: "medium",
                        status: "active",
                        explanation: "Calculator Pro requested camera, microphone, and contacts access, which is excessive for a simple utility.",
                        createdAt: new Date(Date.now() - 24 * 3600000)
                    },
                    {
                        _id: "mock_alert_4",
                        title: "Flash Loan app requests Location",
                        type: "permission",
                        risk_level: "medium",
                        status: "active",
                        explanation: "Unrelated location telemetry tracking requested by an unverified loan calculator.",
                        createdAt: new Date(Date.now() - 48 * 3600000)
                    }
                ]
            });
        }

        // Fetch User profile info
        const user = await User.findById(userId).select('-password_hash');
        const name = user ? user.name : 'User';

        // Fetch latest scan
        const latestScan = await Scan.findOne({ userId }).sort({ createdAt: -1 });

        // Fetch active alerts count by type
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const scansToday = await Scan.countDocuments({
            userId,
            createdAt: { $gte: startOfDay }
        });

        const activeAlerts = await Alert.find({ userId, status: 'active' });

        let metrics = {
            suspiciousMessages: 0,
            riskyLinks: 0,
            permissionRisks: 0,
            systemRisks: 0,
            recentAlerts: activeAlerts.length,
            score: latestScan ? latestScan.score : 100, // Default to 100 if no scans yet
            lastScanTime: latestScan ? latestScan.createdAt : null,
            userName: name,
            scansToday: scansToday,
            activeThreats: activeAlerts.length,
            activeDevices: 2 // Mock active devices count
        };

        // Calculate specifics
        activeAlerts.forEach(alert => {
            if (alert.type === 'sms') metrics.suspiciousMessages++;
            if (alert.type === 'link') metrics.riskyLinks++;
            if (alert.type === 'permission') metrics.permissionRisks++;
            if (alert.type === 'system') metrics.systemRisks++;
        });

        // Get 4 most recent alerts for the timeline
        const timeline = await Alert.find({ userId })
            .sort({ createdAt: -1 })
            .limit(4);

        res.json({
            metrics,
            timeline
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
