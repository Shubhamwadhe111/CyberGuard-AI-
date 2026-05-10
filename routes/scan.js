const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');

// Helper to generate a random delay to simulate scanning
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// @route   POST /api/scan/start
// @desc    Trigger a system scan
// @access  Private
const fs = require('fs');
const path = require('path');

// Helper to recursively scan a directory
async function scanDirectory(dir, results = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                await scanDirectory(filePath, results);
            }
        } else {
            // Real Scan Logic
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 1. Check for hardcoded secrets
            if (content.match(/(api_key|secret|password|token)\s*=\s*['"][a-zA-Z0-9]{10,}['"]/i)) {
                results.push({
                    title: `Potential Secret Exposure in ${file}`,
                    type: "system",
                    risk_level: "critical",
                    explanation: `Hardcoded credential pattern found in ${filePath}. This is a real security risk.`
                });
            }
            
            // 2. Check for dangerous functions
            if (content.includes('eval(') || content.includes('exec(')) {
                results.push({
                    title: `Dangerous Function in ${file}`,
                    type: "permission",
                    risk_level: "high",
                    explanation: `Use of 'eval' or 'exec' detected. These can be used for Remote Code Execution (RCE).`
                });
            }

            // 3. Check for suspicious file types
            if (file.endsWith('.exe') || file.endsWith('.bat') || file.endsWith('.sh')) {
                results.push({
                    title: `Executable File Detected`,
                    type: "system",
                    risk_level: "medium",
                    explanation: `Binary or script file ${file} found in workspace. Verify its origin.`
                });
            }
        }
    }
    return results;
}

// @route   POST /api/scan/start
// @desc    Trigger a real system scan (Workspace Auditor)
// @access  Private
router.post('/start', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const workspacePath = path.join(__dirname, '..'); // Scan the project root

        // Perform the REAL scan
        const foundThreats = await scanDirectory(workspacePath);

        let newAlerts = [];
        
        // Save found threats to Database
        for (let alertData of foundThreats) {
            const newAlert = new Alert({
                userId,
                title: alertData.title,
                type: alertData.type,
                risk_level: alertData.risk_level,
                explanation: alertData.explanation
            });
            await newAlert.save();
            newAlerts.push(newAlert);
        }

        // Calculate a score (Real calculation)
        let score = 100;
        let deductions = newAlerts.length * 10;
        score = Math.max(0, score - deductions);

        // Save Scan history
        const newScan = new Scan({
            userId,
            score,
            summary: `Real Workspace Scan completed. Analyzed files in ${workspacePath}. Found ${newAlerts.length} vulnerabilities.`
        });
        await newScan.save();

        res.status(200).json({
            message: 'Real workspace scan completed successfully',
            score,
            alertsFound: newAlerts.length,
            newAlerts
        });

    } catch (err) {
        console.error("Scan Error:", err);
        res.status(500).send('Server Error during real scan');
    }
});

// @route   POST /api/scan/save
// @desc    Manually record a scan result
// @access  Private
router.post('/save', auth, async (req, res) => {
    try {
        const { scanType, score, threatsFound } = req.body;
        const newScan = new Scan({
            userId: req.user.id,
            score: score || 100,
            summary: `${scanType.toUpperCase()} Scan completed. Detected ${threatsFound} items.`
        });
        await newScan.save();
        res.json({ message: 'Scan recorded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
