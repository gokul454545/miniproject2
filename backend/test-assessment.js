const fetch = require('node-fetch'); // May need to install or just use http

async function test() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        console.log("Registering...", email);
        const regRes = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
        });
        const user = await regRes.json();
        console.log("Registered:", user);

        console.log("Submitting assessment...");
        const assRes = await fetch('http://localhost:5000/api/assessments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token 
            },
            body: JSON.stringify({ 
                answers: { 
                    '2fa_enabled': 'No', 
                    'password_strength': 'Weak', 
                    'social_media_visibility': 'Public', 
                    'location_tracking': 'Always On', 
                    'third_party_cookies': 'Allowed' 
                } 
            })
        });
        const result = await assRes.text();
        console.log("Result:", result);
    } catch(e) {
        console.error("Test failed:", e);
    }
}
test();
