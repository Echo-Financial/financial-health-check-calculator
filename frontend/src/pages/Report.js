import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import './../styles/Report.css';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores } = location.state || {};
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/gpt`, {
        dti: scores.debtToIncomeRatio,
        savingsRate: scores.savingsRate,
        emergencyFund: scores.emergencyFundScore,
        retirement: scores.retirementScore,
        growthOpportunity: scores.growthOpportunityScore,
        potentialForImprovement: scores.potentialForImprovementScore,
        overallFinancialHealth: scores.overallFinancialHealthScore,
      });
      setInsights(response.data.response);
    } catch (error) {
      console.error('Error fetching insights:', error);
      let errorMessage = 'Failed to fetch insights, please try again.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      setInsights(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [scores]);

  useEffect(() => {
    if (scores) {
      fetchInsights();
    }
  }, [scores, fetchInsights]);

  if (!scores) {
    navigate('/');
    return null;
  }

  const formatScoreLabel = (label) => {
    const customLabels = {
      dtiScore: 'Debt to Income Score',
    };

    if (customLabels[label]) {
      return customLabels[label];
    }

    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const overallScore = scores.overallFinancialHealthScore || 0;

  return (
    <div className="container mt-5 report-container">
      <h2>Your Financial Health Report</h2>
      <p>Below are your financial health scores:</p>

      <ul className="list-group mb-4">
        {Object.entries(scores).map(([key, value]) => (
          <li key={key} className="list-group-item">
            <strong>{formatScoreLabel(key)}:</strong> {value}
          </li>
        ))}
      </ul>

      <h3>Overall Financial Health</h3>
      <Gauge value={overallScore} label="Overall Health Score" />

      <h3 className="mt-4">Visual Overview</h3>
      <Charts scores={scores} />

      <div className="mt-4">
        <h4>Ready to Improve Your Financial Future?</h4>
        <p>
          Our experienced advisors at Echo Financial Advisors Ltd can provide detailed insights and a
          tailored plan to help you reach your goals.
        </p>
        <a
          href="https://echofinancialadvisors.trafft.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-submit"
        >
          Schedule a Consultation
        </a>
        {loading && <p>Loading...</p>}
        {insights && (
          <div className="mt-4 insight-container">
            {/* Render the GPT output as formatted Markdown */}
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
