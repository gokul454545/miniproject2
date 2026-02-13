import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrivacyForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [answers, setAnswers] = useState({
    '2fa_enabled': 'No',
    password_strength: 'Weak',
    social_media_visibility: 'Public',
    location_tracking: 'Always On',
    third_party_cookies: 'Allowed'
  });

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.post('http://localhost:5000/api/assessments', { answers }, config);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting assessment', error);
      alert('Error submitting assessment');
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <div className="container py-4 py-md-5">
        <div className="card card-shadow border-0 mx-auto" style={{ maxWidth: '900px' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="h3 fw-bold text-center mb-4">Advanced Privacy Risk Assessment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 pb-3 border-bottom">
                <h3 className="h5 fw-semibold text-primary mb-3">1. Authentication Risk</h3>
                <div className="mb-3">
                  <label className="form-label">Is Two-Factor Authentication (2FA) enabled on your primary accounts?</label>
                  <select name="2fa_enabled" value={answers['2fa_enabled']} onChange={handleChange} className="form-select">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">How would you rate your typical password strength?</label>
                  <select name="password_strength" value={answers.password_strength} onChange={handleChange} className="form-select">
                    <option value="Weak">Weak (e.g., password123, reused passwords)</option>
                    <option value="Medium">Medium (mixed chars, but reused)</option>
                    <option value="Strong">Strong (unique, generated, 12+ chars)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 pb-3 border-bottom">
                <h3 className="h5 fw-semibold text-info mb-3">2. Social Exposure Risk</h3>
                <label className="form-label">What is the default visibility of your social media profiles?</label>
                <select name="social_media_visibility" value={answers.social_media_visibility} onChange={handleChange} className="form-select">
                  <option value="Public">Public (everyone can see)</option>
                  <option value="Friends of Friends">Friends of Friends</option>
                  <option value="Friends Only">Friends Only</option>
                  <option value="Private">Private (Ghost Mode)</option>
                </select>
              </div>

              <div className="mb-4 pb-3 border-bottom">
                <h3 className="h5 fw-semibold text-warning mb-3">3. Device Security Risk</h3>
                <label className="form-label">How often do you allow apps to track your precise location?</label>
                <select name="location_tracking" value={answers.location_tracking} onChange={handleChange} className="form-select">
                  <option value="Always On">Always On</option>
                  <option value="While Using App">While Using App</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              <div className="mb-4 pb-2">
                <h3 className="h5 fw-semibold text-success mb-3">4. Data Sharing and Tracking</h3>
                <label className="form-label">Do you block third-party cookies and trackers in your browser?</label>
                <select name="third_party_cookies" value={answers.third_party_cookies} onChange={handleChange} className="form-select">
                  <option value="Allowed">Allowed (default)</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                Analyze Risks and Calculate Score
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyForm;
