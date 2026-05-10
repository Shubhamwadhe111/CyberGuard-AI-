const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Scan = require('../models/Scan');

// @route   GET /api/dashboard
// @desc    Get dashboard metrics for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch User profile info
        const user = await User.findById(userId).select('-password_hash');

        // Fetch latest scan
        const latestScan = await Scan.findOne({ userId }).sort({ createdAt: -1 });

        // Fetch active alerts count by type
        const activeAlerts = await Alert.find({ userId, status: 'active' });
        
        let metrics = {
            suspiciousMessages: 0,
            riskyLinks: 0,
            permissionRisks: 0,
            recentAlerts: activeAlerts.length,
            score: latestScan ? latestScan.score : 100, // Default to 100 if no scans yet
            lastScanTime: latestScan ? latestScan.createdAt : null,
            userName: user.name
        };

        // Calculate specifics
        activeAlerts.forEach(alert => {
            if (alert.type === 'sms') metrics.suspiciousMessages++;
            if (alert.type === 'link') metrics.riskyLinks++;
            if (alert.type === 'permission') metrics.permissionRisks++;
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
