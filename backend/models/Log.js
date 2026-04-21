const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., 'USER_LOGIN', 'EVIDENCE_UPLOAD', 'CASE_CREATED'
    level: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'INFO' },
    details: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipAddress: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', logSchema);
