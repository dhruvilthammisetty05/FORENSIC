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
    }
}, {
    timestamps: true
});

const Evidence = mongoose.model('Evidence', evidenceSchema);
module.exports = Evidence;
