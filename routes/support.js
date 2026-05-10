const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

// @route   POST /api/support/ticket
// @desc    Create a new support ticket
// @access  Private
router.post('/ticket', auth, async (req, res) => {
    try {
        const { category, message } = req.body;

        if (!category || !message) {
            return res.status(400).json({ message: 'Category and message are required' });
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
        const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
