const mongoose = require('mongoose');

const ThreatDetailsSchema = new mongoose.Schema({
    alertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
        required: true
    },
    risk_factors: {
        type: [String],
        required: true
    },
    recommended_actions: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('ThreatDetails', ThreatDetailsSchema);
