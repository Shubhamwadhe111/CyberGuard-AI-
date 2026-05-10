const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['sms', 'link', 'permission', 'system'], required: true },
    risk_level: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    explanation: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
