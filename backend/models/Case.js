const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Open', 'Closed', 'Paused'], default: 'Open' },
    investigators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evidenceList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
