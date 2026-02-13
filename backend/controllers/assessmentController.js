const { updateGamification } = require('./gamificationController');
const PrivacyAssessment = require('../models/PrivacyAssessment');
const { calculatePrivacyScore } = require('../utils/privacyScorer');
const { generateAiSuggestions } = require('../utils/aiClient');

// @desc    Submit a new privacy assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = async (req, res) => {
    console.log("Submit Assessment Request Body:", req.body);
    console.log("User from Request:", req.user);

    if (!answers) {
        return res.status(400).json({ message: 'Please provide answers' });
    }

    try {
        // Calculate Score (Weighted)
        console.log("Calculating privacy score...");
        const { score, categoryScores, riskLevel, weakAreas } = calculatePrivacyScore(answers);
        console.log("Score calculated:", score);

        // Update Gamification (Badges, Streak, Maturity)
        console.log("Updating gamification...");
        const gamificationStats = await updateGamification(req.user.id, score);
        console.log("Gamification updated");

        // Generate AI Suggestions (Context-Aware)
        console.log("Generating AI suggestions...");
        const aiSuggestions = await generateAiSuggestions(score, riskLevel, weakAreas, categoryScores);
        console.log("AI suggestions generated");

        // Save to Database
        console.log("Saving assessment to DB...");
        const assessment = await PrivacyAssessment.create({
            user: req.user.id,
            answers,
            score,
            categoryScores,
            riskLevel,
            weakAreas,
            aiSuggestions
        });
        console.log("Assessment saved");

        res.status(201).json({ assessment, gamificationStats });
    } catch (error) {
        console.error("Submit Assessment Error:", error);
        console.error("Error Stack:", error.stack);
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
