const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { initWeb3 } = require('./config/web3');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow all origins (including dynamic Ngrok URLs) to pass CORS
    credentials: true,
}));

// Connect to MongoDB
connectDB();

// Initialize Web3
initWeb3();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

app.get('/', (req, res) => {
    res.send('API is running... Health OK.');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
