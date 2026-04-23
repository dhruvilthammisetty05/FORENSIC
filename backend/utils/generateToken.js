const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Required for sameSite: 'none'
        sameSite: 'none', // Allows cross-domain cookies from Vercel to Ngrok
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

module.exports = generateToken;
