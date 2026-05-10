const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true }, // e.g. 85/100
    summary: { type: String },
    results: { type: Object }, // JSON object holding scan results
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
