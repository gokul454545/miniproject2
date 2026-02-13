const mongoose = require('mongoose');

const privacyAssessmentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    answers: {
        type: Map, // Flexible structure for category: value
        of: String, // or Number, depending on how we store answers. Using Map for flexibility.
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    categoryScores: {
        type: Map, // Stores { 'Auth': 25, 'Social': 20, ... }
        of: Number,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['Critical', 'High', 'Moderate', 'Low'], // Updated enum
        required: true
    },
    weightingVersion: {
        type: String,
        default: 'v1.0'
    },
    weakAreas: {
        type: [String], // Array of categories or specific issues
        default: []
    },
    aiSuggestions: {
        type: String // AI generated suggestions stored as text/markdown
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PrivacyAssessment', privacyAssessmentSchema);
