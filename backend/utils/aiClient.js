const axios = require('axios');

const generateAiSuggestions = async (score, riskLevel, weakAreas, categoryScores) => {
    // This function would ideally call an external AI API (like OpenAI).
    // For this project, we will mock the AI response if no API key is configured, 
    // or provide the structure to call the API.

    // Detailed Context-Aware Prompt
    const prompt = `
        User Privacy Score: ${score}/100
        Risk Level: ${riskLevel}
        Category Breakdown: ${JSON.stringify(categoryScores)}
        Weak Areas: ${weakAreas.join(', ')}

        Act as a Cyber Security Expert. Generate a prioritized improvement roadmap:
        1. **Critical Actions** (Immediate fixes for 'Authentication' & 'Device Security')
        2. **Behavioral Changes** (Long-term habits for 'Social Exposure')
        3. **Tech Tweaks** (Settings for 'Data Sharing')
        4. **Why this matters**: Explain the specific risks of their weak areas.
        
        Format as clear, actionable bullet points.
    `;

    console.log("AI Prompt Generated:", prompt);

    if (process.env.OPENAI_API_KEY) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("AI API Error:", error.response ? error.response.data : error.message);
            return "Unable to generate specific AI suggestions at this time. Please review your weak areas manually.";
        }
    } else {
        // Fallback Mock Response for demo purposes without API Key
        return `
            ### AI Privacy Analysis (Mock)
            
            **Personalized Advice:**
            Your privacy score is ${score}, indicating a ${riskLevel} risk level. ${weakAreas.length > 0 ? "You should focus on correcting settings related to " + weakAreas.join(", ") + "." : "Great job maintaining your privacy!"}

            **Action Plan:**
            ${weakAreas.includes('social_media_visibility') ? "- Switch social media profiles to 'Private' or 'Friends Only'." : ""}
            ${weakAreas.includes('2fa_enabled') ? "- Enable Two-Factor Authentication on all sensitive accounts immediately." : ""}
            ${weakAreas.includes('location_tracking') ? "- Review app permissions and disable location services for apps that don't need it." : ""}
            
            **Quick Wins:**
            - Install a password manager.
            - Review your browser's privacy settings.

            **Long-term Practices:**
            - Regularly audit your digital footprint.
            - Use privacy-focused tools like VPNs and encrypted messaging.
        `;
    }
};

module.exports = { generateAiSuggestions };
