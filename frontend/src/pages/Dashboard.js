import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [gamification, setGamification] = useState({ badges: [], streak: 0, maturityLevel: 'Novice' });
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        try {
          const latestRes = await axios.get('http://localhost:5000/api/assessments/latest', config);
          setLatestAssessment(latestRes.data);

          const historyRes = await axios.get('http://localhost:5000/api/assessments', config);
          setHistory(historyRes.data);

          const userRes = await axios.get('http://localhost:5000/api/users/me', config);
          setGamification({
            badges: userRes.data.badges || [],
            streak: userRes.data.streak || 0,
            maturityLevel: userRes.data.privacyMaturityLevel || 'Novice'
          });
        } catch (error) {
          console.error('Error fetching data', error);
        }
      }
    };

    fetchData();
  }, [user?.token]);

  const radarData = {
    labels: ['Authentication', 'Social Exposure', 'Device Security', 'Data Sharing'],
    datasets: [
      {
        label: 'Risk Score (Higher is Better)',
        data:
          latestAssessment && latestAssessment.categoryScores
            ? [
                latestAssessment.categoryScores.Authentication || 0,
                latestAssessment.categoryScores['Social Exposure'] || 0,
                latestAssessment.categoryScores['Device Security'] || 0,
                latestAssessment.categoryScores['Data Sharing'] || 0
              ]
            : [0, 0, 0, 0],
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 2
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  const historyData = {
    labels: history
      .slice(0, 5)
      .reverse()
      .map((item) => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Overall Score Trend',
        data: history
          .slice(0, 5)
          .reverse()
          .map((item) => item.score),
        backgroundColor: 'rgba(25, 135, 84, 0.6)'
      }
    ]
  };

  const getRiskBadgeClass = (level) => {
    if (level === 'Critical') return 'text-bg-danger';
    if (level === 'High') return 'text-bg-warning';
    if (level === 'Moderate') return 'text-bg-info';
    return 'text-bg-success';
  };

  const getMaturityBadgeClass = (level) => {
    switch (level) {
      case 'Guardian':
        return 'text-bg-dark';
      case 'Pro':
        return 'text-bg-primary';
      case 'Aware':
        return 'text-bg-warning';
      default:
        return 'text-bg-secondary';
    }
  };

  const scoreClass = latestAssessment?.score >= 80 ? 'bg-success-subtle text-success' : latestAssessment?.score >= 60 ? 'bg-warning-subtle text-warning-emphasis' : 'bg-danger-subtle text-danger';

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h2 fw-bold mb-1">Privacy Dashboard</h1>
            <p className="text-muted mb-0">Welcome back, {user?.name}</p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`badge rounded-pill fs-6 ${getMaturityBadgeClass(gamification.maturityLevel)}`}>
              Level: {gamification.maturityLevel}
            </span>
            <span className="badge rounded-pill text-bg-warning fs-6">
              Streak: {gamification.streak} days
            </span>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card card-shadow border-0 mb-4">
              <div className="card-body text-center">
                <h2 className="h5 mb-3">Overall Privacy Score</h2>
                {latestAssessment ? (
                  <>
                    <div className={`score-circle ${scoreClass}`}>{latestAssessment.score}</div>
                    <span className={`badge rounded-pill mt-3 ${getRiskBadgeClass(latestAssessment.riskLevel)}`}>
                      {latestAssessment.riskLevel} Risk
                    </span>
                  </>
                ) : (
                  <p className="text-muted mb-0">No assessment data</p>
                )}
              </div>
            </div>

            <div className="card card-shadow border-0">
              <div className="card-body">
                <h2 className="h5 text-center mb-3">Category Breakdown</h2>
                {latestAssessment ? <Radar data={radarData} options={radarOptions} /> : <p className="text-muted text-center mb-0">No data yet</p>}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card card-shadow border-0 border-top border-4 border-primary mb-4">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-3">AI Privacy Roadmap</h2>
                {latestAssessment?.aiSuggestions ? (
                  <div className="alert alert-primary roadmap-text mb-0">{latestAssessment.aiSuggestions}</div>
                ) : (
                  <p className="text-muted mb-0">
                    Complete an assessment to generate your personalized AI improvement roadmap.
                  </p>
                )}
              </div>
            </div>

            <div className="card card-shadow border-0 mb-4">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Earned Badges</h2>
                {gamification.badges.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {gamification.badges.map((badge, idx) => (
                      <span key={idx} className="badge text-bg-warning rounded-pill px-3 py-2">
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No badges yet. Keep improving your score.</p>
                )}
              </div>
            </div>

            <div className="card card-shadow border-0">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Improvement Trend</h2>
                {history.length > 0 ? <Bar data={historyData} /> : <p className="text-muted mb-0">No history available.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
