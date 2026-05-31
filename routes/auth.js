const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const OTP = require('../models/OTP');
const auth = require('../middleware/auth');

// Scoped auth rate limiter: max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

// Helper function to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send Email OTP
const sendEmailOTP = async (email, otpValue) => {
    try {
        console.log(`Preparing to send Email OTP to ${email}...`);
        
        // Use Ethereal test account if no real credentials are provided
        let transporter;
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail', // Standard for dev, or any other SMTP
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            console.log("No EMAIL_USER in .env. Using Ethereal Test Account...");
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        let info = await transporter.sendMail({
            from: '"CyberGuard AI Security" <security@cyberguard.ai>',
            to: email,
            subject: "Your CyberGuard Verification Code",
            text: `Your verification code is: ${otpValue}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>CyberGuard AI</h2>
                    <p>Your two-factor authentication code is:</p>
                    <h1 style="color: #00ff88; background: #1a1a2e; padding: 15px; border-radius: 8px; display: inline-block;">{{OTP}}</h1>
                    <p>Do not share this code with anyone.</p>
                </div>
            `.replace('{{OTP}}', Number(otpValue).toString()),
        });

        console.log("Email sent: %s", info.messageId);
        
        // If using Ethereal, print the link to view the email
        if (!process.env.EMAIL_USER) {
            console.log("\n📩 ============================================");
            console.log("📩 PREVIEW YOUR EMAIL OTP HERE: ");
            console.log("📩 " + nodemailer.getTestMessageUrl(info));
            console.log("📩 ============================================\n");
        }
    } catch (err) {
        console.error("Email Sending Failed:", err.message);
    }
};

// Signup Route
router.post('/signup', authLimiter, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            phone,
            password_hash,
            verified: true // Automatically verify for streamlined access
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, message: 'Signup successful.' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Verify OTP Route
router.post('/verify-otp', auth, async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user.id;

        const otpRecord = await OTP.findOne({ userId }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found.' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        // Mark user as verified
        await User.findByIdAndUpdate(userId, { verified: true });
        
        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: 'Account verified successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // OTP Verification is bypassed per user request

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, message: 'Login successful' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
