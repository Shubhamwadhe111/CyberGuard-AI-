const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const ThreatDetails = require('../models/ThreatDetails');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/threats/:id
// @desc    Get details for a specific threat/alert
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log(`Database offline. Serving mock details for alert ${req.params.id}.`);
            return res.json({
                alert: {
                    _id: req.params.id,
                    userId: req.user.id,
                    title: "Vulnerability Flagged in Workspace",
                    type: "system",
                    risk_level: "high",
                    status: "active",
                    explanation: "Development scanner found RCE risk or exposed secret parameters inside the codebase directory.",
                    createdAt: new Date()
                },
                details: {
                    alertId: req.params.id,
                    risk_factors: [
                        "Code content matches credential/token variable patterns.",
                        "Dangerous utility function (eval/exec) executed in global scope.",
                        "Executable script file (.exe/.bat/.sh) present without authorization."
                    ],
                    recommended_actions: [
                        "Revoke/regenerate the exposed API keys immediately.",
                        "Sanitize inputs to avoid Remote Code Execution (RCE) vectors.",
                        "Isolate or delete suspicious files from the server directories."
                    ]
                }
            });
        }

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
