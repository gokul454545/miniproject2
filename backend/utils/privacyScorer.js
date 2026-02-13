const calculatePrivacyScore = (answers) => {
    // 1. Define Weights
    const weights = {
        'Authentication': 0.30,
        'Social Exposure': 0.25,
        'Device Security': 0.25,
        'Data Sharing': 0.20
    };

    // 2. Map Answers to Categories & Values (Normalized 0-100 where 100 is best)
    // Structure: Category -> QuestionKey -> { Answer: Score }
    const scoringMap = {
        'Authentication': {
            '2fa_enabled': { 'Yes': 100, 'No': 0 },
            'password_strength': { 'Strong': 100, 'Medium': 50, 'Weak': 0 }
        },
        'Social Exposure': {
            'social_media_visibility': { 'Private': 100, 'Friends Only': 75, 'Friends of Friends': 25, 'Public': 0 }
        },
        'Device Security': {
            'location_tracking': { 'Never': 100, 'While Using App': 50, 'Always On': 0 }
        },
        'Data Sharing': {
            'third_party_cookies': { 'Blocked': 100, 'Allowed': 0 }
        }
    };

    let categoryScores = {
        'Authentication': 0,
        'Social Exposure': 0,
        'Device Security': 0,
        'Data Sharing': 0
    };

    let weakAreas = [];

    // 3. Calculate Category Scores
    for (const [category, questions] of Object.entries(scoringMap)) {
        let totalQuestions = Object.keys(questions).length;
        if (totalQuestions === 0) continue;

        let categoryRawSum = 0;

        for (const [questionKey, answerScores] of Object.entries(questions)) {
            const userAnswer = answers[questionKey];
            if (userAnswer && answerScores[userAnswer] !== undefined) {
                const score = answerScores[userAnswer];
                categoryRawSum += score;

                // Identify Weak Areas (Score < 50 is considered a weakness)
                if (score < 50) {
                    weakAreas.push(`${category}: ${questionKey.replace(/_/g, ' ')} (${userAnswer})`);
                }
            } else {
                // Default to 0 if answer invalid or missing (Strict grading)
                categoryRawSum += 0;
            }
        }

        // Average score for the category (0-100)
        categoryScores[category] = Math.round(categoryRawSum / totalQuestions);
    }

    // 4. Calculate Weighted Total Score
    let totalScore = 0;
    totalScore += categoryScores['Authentication'] * weights['Authentication'];
    totalScore += categoryScores['Social Exposure'] * weights['Social Exposure'];
    totalScore += categoryScores['Device Security'] * weights['Device Security'];
    totalScore += categoryScores['Data Sharing'] * weights['Data Sharing'];

    totalScore = Math.round(totalScore);

    // 5. Determine Risk Level
    let riskLevel;
    if (totalScore < 40) riskLevel = 'Critical';
    else if (totalScore < 60) riskLevel = 'High';
    else if (totalScore < 80) riskLevel = 'Moderate';
    else riskLevel = 'Low';

    return { score: totalScore, categoryScores, riskLevel, weakAreas };
};

module.exports = { calculatePrivacyScore };
