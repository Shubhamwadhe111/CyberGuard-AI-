const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scan_frequency: {
        type: String,
        default: 'weekly' // daily, weekly, monthly
    },
    notifications: {
        type: Boolean,
        default: true
    },
    privacy_mode: {
        type: Boolean,
        default: false
    },
    data_retention: {
        type: String,
        default: '90' // days
    },
    message_scan: {
        type: Boolean,
        default: true
    },
    link_check: {
        type: Boolean,
        default: true
    },
    app_perms: {
        type: Boolean,
        default: true
    },
    auto_scan: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Settings', SettingsSchema);
