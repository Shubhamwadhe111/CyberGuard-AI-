const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

// @route   GET /api/alerts
// @desc    Get all active alerts for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
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
