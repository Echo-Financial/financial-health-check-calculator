import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores } = location.state || {};

  // If no scores are present, redirect to home
  if (!scores) {
    navigate('/');
    return null;
  }

  /**
   * Helper to make keys like "overallFinancialHealthScore" 
   * appear more user-friendly in a list (e.g. "Overall Financial Health Score").
   */
  const formatScoreLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Extract the "overallFinancialHealthScore" (change this property name if your backend uses a different key)
  const overallScore = scores.overallFinancialHealthScore || 0;

  return (
    <div className="container mt-5">
      <h2>Your Financial Health Report</h2>
      <p>Below are your financial health scores:</p>

      {/* List each score in a bullet list */}
      <ul className="list-group mb-4">
        {Object.entries(scores).map(([key, value]) => (
          <li key={key} className="list-group-item">
            <strong>{formatScoreLabel(key)}:</strong> {value}
          </li>
        ))}
      </ul>

      {/* Highlight the overall financial health with a radial gauge */}
      <h3>Overall Financial Health</h3>
      <Gauge value={overallScore} label="Overall Health Score" />

      {/* Bar chart to show comparisons across all scores */}
      <h3 className="mt-4">Visual Overview</h3>
      <Charts scores={scores} />

      {/* Optional marketing / CTA section */}
      <div className="mt-4">
        <h4>Ready to Improve Your Financial Future?</h4>
        <p>
          Our experienced advisors at Echo can provide detailed insights and a 
          tailored plan to help you reach your goals.
        </p>
        {/* Insert your "Schedule a Consultation" or next-step button here */}
      </div>
    </div>
  );
};

export default Report;
