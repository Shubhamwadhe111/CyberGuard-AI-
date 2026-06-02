const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const AgentLog = require('../models/AgentLog');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CyberGuard AI System Prompt — defines the agent's personality & expertise
const SYSTEM_PROMPT = `You are CyberGuard AI, an expert cybersecurity assistant embedded inside the CyberGuard mobile security platform.

Your role is to:
- Help users understand and respond to cybersecurity threats on their device
- Analyze suspicious SMS messages, URLs, and files for phishing, malware, or scam indicators
- Educate users on how to stay safe online in simple, clear language
- Give actionable advice that a non-technical person can follow

Your personality:
- Professional but friendly and easy to understand
- Never use overly technical jargon without explaining it
- Keep responses concise (2-4 sentences for simple questions, up to 6 for complex ones)
- Always end with a clear action the user should take if a threat is detected

Rules:
- Never reveal your underlying model or that you are powered by Gemini
- Always respond as "CyberGuard AI"
- If a user shares a suspicious link or message, analyze it and rate it as Safe / Suspicious / Dangerous
- If you detect a threat, always advise the user NOT to click, share, or respond
- You should respond to greetings, introductions, and questions about who you are or what CyberGuard AI is in a helpful and welcoming way.
- While you focus on cybersecurity and mobile security, do not reject general questions completely; instead, answer them briefly and steer the conversation back to device safety. Only decline completely irrelevant, non-technical queries (e.g. creative writing, entertainment, sports, or recipes) politely.`;

// @route   POST /api/agent/analyze
// @desc    Send a message to the Gemini-powered AI agent
// @access  Private
router.post('/analyze', auth, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        // Fetch user's active alerts for context
        let alertContext = '';
        try {
            const alerts = await Alert.find({ userId: req.user.id, status: 'active' }).limit(3);
            if (alerts.length > 0) {
                alertContext = `\n\nUser's current active security alerts: ${alerts.map(a => `"${a.title}" (${a.risk_level} risk)`).join(', ')}. Reference these if the user asks about their threats.`;
            }
        } catch (e) {
            // Non-critical — proceed without alert context
        }

        // Build conversation context
        const fullPrompt = `${SYSTEM_PROMPT}${alertContext}\n\nUser message: ${message}`;

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(fullPrompt);
        const reply = result.response.text();

        // Determine risk score based on message content for logging
        const msgLower = message.toLowerCase();
        let risk_score = 'safe';
        if (msgLower.includes('bank') || msgLower.includes('otp') || msgLower.includes('password') || message.includes('http')) {
            risk_score = 'high';
        } else if (msgLower.includes('alert') || msgLower.includes('threat') || msgLower.includes('suspicious')) {
            risk_score = 'medium';
        }

        // Log the interaction
        try {
            const logEntry = new AgentLog({
                userId: req.user.id,
                input_type: message.includes('http') ? 'link' : 'text',
                risk_score,
                user_message: message,
                response_summary: reply.substring(0, 200)
            });
            await logEntry.save();
        } catch (logErr) {
            console.warn('AgentLog save failed (non-critical):', logErr.message);
        }

        res.json({ reply });

    } catch (err) {
        console.error('Gemini Agent Error:', err.message);

        // Graceful fallback if Gemini fails
        res.json({
            reply: "I'm having trouble connecting to my AI engine right now. Please try again in a moment. If you have an urgent security concern, check your Alerts tab immediately."
        });
    }
});

module.exports = router;
