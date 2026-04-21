const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    ipfsHash: {
        type: String,
        required: true
    },
    sha256Hash: {
        type: String,
        required: true
    },
    txHash: {
        type: String,
        required: true
    },
    evidenceId: {
        type: Number,
        required: true,
        unique: true
    },
    custodyHistory: [{
        handlerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        handlerName: String,
        action: String,
        timestamp: { type: Date, default: Date.now },
        notes: String
    }],
    pendingTransfers: [{
        fromId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        toId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        toEmail: String,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        initiatedAt: { type: Date, default: Date.now },
        notes: String
    }]
}, {
    timestamps: true
});

const Evidence = mongoose.model('Evidence', evidenceSchema);
module.exports = Evidence;
