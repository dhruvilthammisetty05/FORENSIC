const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');

// Get all cases
router.get('/', protect, async (req, res) => {
    try {
        const cases = await Case.find().populate('creator', 'name email').populate('investigators', 'name email').sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new case
router.post('/', protect, async (req, res) => {
    try {
        const { title, description } = req.body;

        const newCase = new Case({
            title,
            description,
            creator: req.user._id,
            investigators: [req.user._id]
        });

        const savedCase = await newCase.save();

        await Log.create({ action: 'CASE_CREATED', level: 'INFO', details: `Created new case: ${title}`, user: req.user._id });

        res.status(201).json(savedCase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
