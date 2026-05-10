const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const ThreatDetails = require('../models/ThreatDetails');

// @route   GET /api/threats/:id
// @desc    Get details for a specific threat/alert
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }
        
        // Ensure the user owns this alert
        if (alert.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        let details = await ThreatDetails.findOne({ alertId: alert._id });

        // If no details exist, generate default ones dynamically based on the alert
        if (!details) {
            const defaultRiskFactors = [
                `Detected abnormal behavior related to ${alert.type}`,
                `System flagged risk level as ${alert.risk_level}`,
                `Time of detection: ${new Date(alert.createdAt).toLocaleString()}`
            ];
            
            const defaultRecommendations = [
                `Review recent activities associated with ${alert.type}`,
                `Consider disabling suspicious application permissions`,
                `Change passwords if an account compromise is suspected`
            ];

            details = new ThreatDetails({
                alertId: alert._id,
                risk_factors: defaultRiskFactors,
                recommended_actions: defaultRecommendations
            });
            await details.save();
        }

        res.json({
            alert,
            details
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Alert not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
