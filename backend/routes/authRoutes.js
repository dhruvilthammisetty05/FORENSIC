const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/authMiddleware');
const Log = require('../models/Log');

router.post('/register', async (req, res) => {
    try {
        console.log("Register Attempt:", req.body);
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role });
        if (user) {
            console.log("User created successfully:", user._id);
            await Log.create({ action: 'USER_REGISTERED', level: 'INFO', details: `New user registered: ${email}`, user: user._id });
            generateToken(res, user._id);
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            console.log("User creation returned falsy");
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            await Log.create({ action: 'USER_LOGIN', level: 'INFO', details: `User logged in`, user: user._id });
            generateToken(res, user._id);
            res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
});

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'demo-client-id');

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        let payload;

        // Mock validation for demo if real client ID isn't provided
        if ((process.env.GOOGLE_CLIENT_ID || 'demo-client-id') === 'demo-client-id') {
            console.log("Mocking Google Login payload due to missing/default client id in backend env.");
            const base64Url = credential.split('.')[1];
            if (!base64Url) throw new Error("Invalid credential");
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            payload = JSON.parse(jsonPayload);
        } else {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        }

        const { email, name, sub } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Auto-register user with default 'Investigator' role if not exists
            user = await User.create({
                name,
                email,
                password: sub, // Use google id as placeholder password
                role: 'Investigator'
            });
        }

        generateToken(res, user._id);
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ message: 'Google Authentication Failed' });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        res.status(200).json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
