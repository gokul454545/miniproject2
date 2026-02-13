const User = require('../models/User');
const { differenceInDays } = require('date-fns');

const updateGamification = async (userId, score) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const now = new Date();
        let newBadges = [...(user.badges || [])];
        let streak = user.streak || 0;

        // 1. Update Streak
        if (user.lastAssessmentDate) {
            const daysDiff = differenceInDays(now, user.lastAssessmentDate);
            if (daysDiff === 1) {
                streak += 1; // Consecutive day
            } else if (daysDiff > 1) {
                streak = 1; // Streak broken, reset to current session
            }
            // If same day, streak remains same
        } else {
            streak = 1; // First assessment
        }

        // 2. Award Badges based on Score & Streak
        if (score >= 80 && !newBadges.includes('Privacy Guardian')) {
            newBadges.push('Privacy Guardian');
        }
        if (streak >= 3 && !newBadges.includes('Consistency Master')) {
            newBadges.push('Consistency Master');
        }
        if (score === 100 && !newBadges.includes('Perfectionist')) {
            newBadges.push('Perfectionist');
        }

        // 3. Update Maturity Level
        let maturityLevel = 'Novice';
        if (score >= 80) maturityLevel = 'Guardian';
        else if (score >= 60) maturityLevel = 'Pro';
        else if (score >= 40) maturityLevel = 'Aware';

        // Save Updates
        user.badges = newBadges;
        user.streak = streak;
        user.privacyMaturityLevel = maturityLevel;
        user.lastAssessmentDate = now;

        await user.save();

        return {
            badges: newBadges,
            streak,
            maturityLevel
        };

    } catch (error) {
        console.error("Gamification Error:", error);
    }
};

module.exports = { updateGamification };
