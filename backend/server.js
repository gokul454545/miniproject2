const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));

// Serve frontend in production (optional placeholder)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

app.listen(port, () => console.log(`Server started on port ${port}`));
