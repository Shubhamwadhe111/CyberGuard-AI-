const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
    },
    password_hash: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
