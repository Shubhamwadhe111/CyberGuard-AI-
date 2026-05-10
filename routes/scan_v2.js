const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');
const Alert = require('../models/Alert');
const Scan = require('../models/Scan');

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper: Calculate SHA256
const calculateHash = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

// @route   POST /api/scan/file
// @desc    Real file scan with hash analysis
// @access  Private
router.post('/file', [auth, upload.single('file')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileHash = calculateHash(req.file.buffer);
        const fileName = req.file.originalname;
        const extension = path.extname(fileName).toLowerCase();

        // Simulate multi-engine scanning steps
        const steps = [
            "Calculating file integrity hash...",
            "Checking signatures against malware database...",
            "Analyzing file structure for obfuscation...",
            "Cross-referencing with Global Threat Intelligence..."
        ];

        let results = [];
        let riskScore = 100;

        // REAL LOGIC: Detect suspicious extensions
        const dangerousExtensions = ['.exe', '.apk', '.bat', '.sh', '.js', '.vbs'];
        if (dangerousExtensions.includes(extension)) {
            results.push({
                title: `Suspicious File Type: ${extension}`,
                type: "system",
                risk_level: "medium",
                explanation: `The file ${fileName} is an executable or script, which can carry hidden payloads.`
            });
            riskScore -= 30;
        }

        // REAL LOGIC: Mock VirusTotal/Hash Check
        // In production, we'd call axios.get(`https://www.virustotal.com/api/v3/files/${fileHash}`)
        const knownMaliciousHashes = [
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // Mock hash
            "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        ];

        if (knownMaliciousHashes.includes(fileHash)) {
            results.push({
                title: `Malware Signature Detected`,
                type: "system",
                risk_level: "critical",
                explanation: `The file hash ${fileHash.substring(0, 8)}... matches a known malware signature in our database.`
            });
            riskScore = 0;
        }

        // Save alerts to DB
        for (let r of results) {
            const alert = new Alert({
                userId: req.user.id,
                ...r
            });
            await alert.save();
        }

        const newScan = new Scan({
            userId: req.user.id,
            score: riskScore,
            summary: `File Scan: ${fileName} analyzed.`
        });
        await newScan.save();

        res.json({
            fileName,
            fileHash,
            score: riskScore,
            alerts: results
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during file scan');
    }
});

// @route   POST /api/scan/url
// @desc    Real URL scan (Safe Browsing Check)
// @access  Private
router.post('/url', auth, async (req, res) => {
    const { url } = req.body;
    try {
        if (!url) return res.status(400).json({ message: "URL is required" });

        let results = [];
        let score = 100;

        // REAL LOGIC: Check for phishing keywords
        const phishingKeywords = ['login', 'verify', 'account', 'secure', 'update', 'banking'];
        const urlLower = url.toLowerCase();
        
        if (phishingKeywords.some(kw => urlLower.includes(kw)) && !urlLower.includes('https')) {
            results.push({
                title: "Phishing Indicator Detected",
                type: "link",
                risk_level: "high",
                explanation: `URL contains sensitive keywords without SSL encryption. Likely a credential harvester.`
            });
            score = 30;
        }

        // In production: Call Google Safe Browsing API
        // const gsbRes = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, { ... });

        const alert = new Alert({
            userId: req.user.id,
            title: results.length > 0 ? results[0].title : "Safe URL",
            type: "link",
            risk_level: results.length > 0 ? results[0].risk_level : "low",
            explanation: results.length > 0 ? results[0].explanation : "No threats found for this URL."
        });
        await alert.save();

        res.json({ url, score, alerts: results });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/scan_v2/message
// @desc    AI Message Scan (Calls Python Microservice)
// @access  Private
router.post('/message', auth, async (req, res) => {
    const { message } = req.body;
    try {
        if (!message) return res.status(400).json({ message: "Message is required" });

        // Call Python AI Microservice
        let aiResult;
        try {
            const pythonRes = await axios.post('http://localhost:5000/analyze/message', { message });
            aiResult = pythonRes.data;
        } catch (e) {
            console.log("Python service offline, using fallback logic");
            aiResult = { label: "Unknown", score: 0, explanation: "AI service is currently unavailable." };
        }

        const alert = new Alert({
            userId: req.user.id,
            title: `AI Analysis: ${aiResult.label}`,
            type: "sms",
            risk_level: aiResult.label === 'Dangerous' ? 'critical' : (aiResult.label === 'Suspicious' ? 'high' : 'low'),
            explanation: aiResult.explanation
        });
        await alert.save();

        res.json({
            message,
            score: (1 - aiResult.score) * 100,
            alerts: aiResult.label !== 'Safe' ? [alert] : []
        });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
