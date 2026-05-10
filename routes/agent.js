const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const AgentLog = require('../models/AgentLog');

// @route   POST /api/agent/analyze
// @desc    Send a message to the AI agent
// @access  Private
router.post('/analyze', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const msgLower = message.toLowerCase();

        // Simulate thinking time
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500));

        let reply = "I am your CyberGuard AI assistant. I can help analyze threats, secure your device, or explain security concepts.";

        // Basic Rule-based logic
        if (msgLower.includes('scan') || msgLower.includes('virus')) {
            reply = "You can run a deep device scan from the 'Scan' tab. Our engine checks your apps, permissions, and network for malicious activity.";
        } else if (msgLower.includes('alert') || msgLower.includes('threat')) {
            // Check their actual alerts
            const alerts = await Alert.find({ userId: req.user.id, status: 'active' });
            if (alerts.length > 0) {
                reply = `I see you currently have ${alerts.length} active alerts. For example, the "${alerts[0].title}" threat requires your attention. Please go to the Alerts tab to review and resolve them.`;
            } else {
                reply = "Good news! You have zero active threats. Your device is secure.";
            }
        } else if (msgLower.includes('hello') || msgLower.includes('hi')) {
            reply = "Hello! I'm actively monitoring your system. How can I assist you with your digital security today?";
        } else if (msgLower.includes('phishing') || msgLower.includes('link')) {
            reply = "Phishing is when attackers send deceptive messages containing dangerous links. Always verify the sender and never click on shortened URLs from unknown sources.";
        }

        // Determine a simple risk score for the log based on keyword match
        let risk_score = 'safe';
        if (msgLower.includes('bank') || msgLower.includes('otp') || msgLower.includes('link')) risk_score = 'high';
        else if (msgLower.includes('alert') || msgLower.includes('threat')) risk_score = 'medium';

        // Log the interaction
        const logEntry = new AgentLog({
            userId: req.user.id,
            input_type: message.includes('http') ? 'link' : 'text',
            risk_score,
            user_message: message,
            response_summary: reply
        });
        await logEntry.save();

        res.json({ reply });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
