const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Authenticate with Google
// @route   POST /api/users/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { googleToken } = req.body;
        
        if (!googleToken) {
            return res.status(400).json({ message: 'Google token is required' });
        }

        const { OAuth2Client } = require('google-auth-library');
        // The GOOGLE_CLIENT_ID environment variable needs to be renamed from client_id
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.client_id);
        
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID || process.env.client_id,
        });

        const payload = ticket.getPayload();
        
        // Log the whole payload if needed for debugging
        // console.log("Google Payload: ", payload);

        const { email, name, sub: googleId } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
                name,
                email,
                googleId,
                // generate a random password to bypass model pre-save hook requirements if any
                password: Math.random().toString(36).slice(-8)
            });
        } else if (!user.googleId) {
            // If the user exists but doesn't have a googleId, linking it.
            user.googleId = googleId;
            await user.save();
        }

        // Send back standard local token
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                isNewUser: !user.lastAssessmentDate // Helpful for frontend to redirect specifically if it's their first time
            });
        }
    } catch (error) {
        console.error('Google verification Error:', error);
        res.status(401).json({ message: 'Invalid Google Token', error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
};
