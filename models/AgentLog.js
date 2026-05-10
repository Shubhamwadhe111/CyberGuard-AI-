const mongoose = require('mongoose');

const AgentLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    input_type: {
        type: String, // e.g. 'text', 'link'
        default: 'text'
    },
    risk_score: {
        type: String, // 'safe', 'medium', 'high'
        default: 'unknown'
    },
    user_message: {
        type: String,
        required: true
    },
    response_summary: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AgentLog', AgentLogSchema);
