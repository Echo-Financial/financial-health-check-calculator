
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores } = location.state || {};

  if (!scores) {
    // If no scores are available, redirect to Home
    navigate('/');
    return null;
  }

  // Helper function to format score labels
  const formatScoreLabel = (label) => {
    return label.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div>
      <h2>Your Financial Scores</h2>
      <ul className="list-group mb-4">
        {Object.entries(scores).map(([key, value]) => (
          <li key={key} className="list-group-item">
            <strong>{formatScoreLabel(key)}:</strong> {value}
          </li>
        ))}
      </ul>
      <Charts scores={scores} />
    </div>
  );
};

export default Results;
