const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/support/ticket
// @desc    Create a new support ticket
// @access  Private
router.post('/ticket', auth, async (req, res) => {
    try {
        const { category, message } = req.body;

        if (!category || !message) {
            return res.status(400).json({ message: 'Category and message are required' });
        }

        if (!isDbConnected()) {
            console.log("Database offline. Generating mock ticket details in memory.");
            return res.status(201).json({
                message: 'Support ticket submitted successfully (Offline Mode)',
                ticket: {
                    _id: `mock_ticket_${Date.now()}`,
                    userId: req.user.id,
                    category,
                    message,
                    status: 'open',
                    createdAt: new Date()
                }
            });
        }

        const newTicket = new SupportTicket({
            userId: req.user.id,
            category,
            message
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Support ticket submitted successfully',
            ticket: newTicket
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/support/tickets
// @desc    Get user's support tickets
// @access  Private
router.get('/tickets', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log("Database offline. Serving empty support tickets list.");
            return res.json([]);
        }
        const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
