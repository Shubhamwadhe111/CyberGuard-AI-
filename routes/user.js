const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/user/profile
// @desc    Get user profile data
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log("Database offline. Serving mock user profile data.");
            return res.json({
                _id: req.user.id,
                name: "Developer User",
                email: "dev@cyberguard.ai",
                phone: "+919999999999",
                verified: true
            });
        }
        const user = await User.findById(req.user.id).select('-password_hash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile data
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        if (!isDbConnected()) {
            console.log("Database offline. Bypassing database update for profile.");
            return res.json({
                _id: req.user.id,
                name: name || "Developer User",
                email: "dev@cyberguard.ai",
                phone: phone || "+919999999999",
                verified: true
            });
        }

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
