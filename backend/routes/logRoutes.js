const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all system logs (Admin Only)
router.get('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const logs = await Log.find().populate('user', 'name role email').sort({ createdAt: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a log entry (Internal API helper)
router.post('/', protect, async (req, res) => {
    try {
        const { action, level, details } = req.body;
        const newLog = new Log({
            action,
            level,
            details,
            user: req.user ? req.user._id : null
        });
        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
