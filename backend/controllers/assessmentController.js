const { updateGamification } = require('./gamificationController');
const PrivacyAssessment = require('../models/PrivacyAssessment');
const { calculatePrivacyScore } = require('../utils/privacyScorer');
const { generateAiSuggestions } = require('../utils/aiClient');

// @desc    Submit a new privacy assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = async (req, res) => {
    const { answers } = req.body;

    if (!answers) {
        return res.status(400).json({ message: 'Please provide answers' });
    }

    try {
        // Calculate Score (Weighted)
        const { score, categoryScores, riskLevel, weakAreas } = calculatePrivacyScore(answers);

        // Update Gamification (Badges, Streak, Maturity)
        const gamificationStats = await updateGamification(req.user.id, score);

        // Generate AI Suggestions (Context-Aware)
        const aiSuggestions = await generateAiSuggestions(score, riskLevel, weakAreas, categoryScores);

        // Save to Database
        const assessment = await PrivacyAssessment.create({
            user: req.user.id,
            answers,
            score,
            categoryScores,
            riskLevel,
            weakAreas,
            aiSuggestions
        });

        res.status(201).json({ assessment, gamificationStats });
    } catch (error) {
        console.error("Submit Assessment Error:", error);
        res.status(500).json({ message: 'Server error processing assessment', error: error.message });
    }
};

// @desc    Get user's assessment history
// @route   GET /api/assessments
// @access  Private
const getHistory = async (req, res) => {
    try {
        const assessments = await PrivacyAssessment.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching history' });
    }
};

// @desc    Get latest assessment
// @route   GET /api/assessments/latest
// @access  Private
const getLatestAssessment = async (req, res) => {
    try {
        const assessment = await PrivacyAssessment.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        if (assessment) {
            res.status(200).json(assessment);
        } else {
            res.status(404).json({ message: 'No assessments found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching assessment' });
    }
};

module.exports = {
    submitAssessment,
    getHistory,
    getLatestAssessment
};
