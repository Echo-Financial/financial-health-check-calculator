import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import axios from 'axios';
import { styled } from '@mui/material';
import './../styles/Report.css';

const Report = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { scores } = location.state || {};
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(scores){
           fetchInsights();
        }
    }, [scores]);


    const fetchInsights = async () => {
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
    };


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
    <div className="container mt-5 report-container">
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

        <div style={{ backgroundColor: `hsl(120, 100%, 50%, 0.6)`, padding: '10px' }}>Test - HSL Color</div>
        <div style={{ backgroundColor: `var(--color-from-score-100)`, padding: '10px' }}>Test - var(--color-from-score-100)</div>
        <div style={{ backgroundColor: `var(--color-from-score-0)`, padding: '10px' }}>Test - var(--color-from-score-0)</div>

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
                Our experienced advisors at Echo Financial Advisors Ltd can provide detailed insights and a
                tailored plan to help you reach your goals.
            </p>
            <a href="https://echofinancialadvisors.trafft.com/" target="_blank" className="btn btn-primary btn-submit">
                Schedule a Consultation
            </a>
            {loading ? <p>Loading...</p> : null}
             {insights && <div className="mt-4 insight-container">{insights.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
            ))}</div>}
        </div>
    </div>
  );
};

export default Report;