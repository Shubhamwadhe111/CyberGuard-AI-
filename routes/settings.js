const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Settings = require('../models/Settings');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        if (!isDbConnected()) {
            console.log("Database offline. Serving mock settings data.");
            return res.json({
                userId: req.user.id,
                scan_frequency: 'weekly',
                notifications: true,
                privacy_mode: false,
                data_retention: '90',
                message_scan: true,
                link_check: true,
                app_perms: true,
                auto_scan: true
            });
        }

        let settings = await Settings.findOne({ userId: req.user.id });
        
        // If no settings exist yet, create default
        if (!settings) {
            settings = new Settings({ userId: req.user.id });
            await settings.save();
        }
        
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        const {
            scan_frequency,
            notifications,
            privacy_mode,
            data_retention,
            message_scan,
            link_check,
            app_perms,
            auto_scan
        } = req.body;

        if (!isDbConnected()) {
            console.log("Database offline. Bypassing settings update.");
            return res.json({
                userId: req.user.id,
                scan_frequency: scan_frequency !== undefined ? scan_frequency : 'weekly',
                notifications: notifications !== undefined ? notifications : true,
                privacy_mode: privacy_mode !== undefined ? privacy_mode : false,
                data_retention: data_retention !== undefined ? data_retention : '90',
                message_scan: message_scan !== undefined ? message_scan : true,
                link_check: link_check !== undefined ? link_check : true,
                app_perms: app_perms !== undefined ? app_perms : true,
                auto_scan: auto_scan !== undefined ? auto_scan : true
            });
        }

        let settings = await Settings.findOne({ userId: req.user.id });
        
        if (!settings) {
            settings = new Settings({ userId: req.user.id });
        }

        if (scan_frequency !== undefined) settings.scan_frequency = scan_frequency;
        if (notifications !== undefined) settings.notifications = notifications;
        if (privacy_mode !== undefined) settings.privacy_mode = privacy_mode;
        if (data_retention !== undefined) settings.data_retention = data_retention;
        if (message_scan !== undefined) settings.message_scan = message_scan;
        if (link_check !== undefined) settings.link_check = link_check;
        if (app_perms !== undefined) settings.app_perms = app_perms;
        if (auto_scan !== undefined) settings.auto_scan = auto_scan;

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
