import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './../styles/Report.scss';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure BOTH scores AND analysis from location.state:
  const { scores, analysis } = location.state || {};
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  // Keep fetchInsights as is (for original instant feedback):
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      // Use the keys returned by financialCalculations.js - THIS IS YOUR ORIGINAL INSTANT FEEDBACK
      const response = await axios.post(`${API_URL}/api/gpt`, {
        dti: scores.dtiScore,
        savingsRate: scores.savingsScore,
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
    navigate('/'); // Redirect if no scores (shouldn't happen, but good practice)
    return null;
  }

    const handleBookingClick = () => {
        window.open('https://echofinancialadvisors.trafft.com/', '_blank'); // Replace with your actual booking link
    };

  const formatScoreLabel = (label) => {
    const customLabels = {
      dtiScore: 'Debt to Income Score',
      savingsScore: 'Savings Score',
      emergencyFundScore: 'Emergency Fund Score',
      retirementScore: 'Retirement Score',
      growthOpportunityScore: 'Growth Opportunity Score',
      overallFinancialHealthScore: 'Overall Financial Health Score',
      potentialForImprovementScore: 'Potential for Improvement Score',
    };
    return customLabels[label] || label.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const overallScore = scores.overallFinancialHealthScore || 0;

  return (
    <div className="report-container">
      <main className="report-content">
        {/* Existing Sections (Scores, Gauge, Charts) - Keep these as they are */}
        <section className="score-summary section">
          <div className="container">
            <h3>Financial Health Scores</h3>
            <ul className="list-group mb-4">
              {Object.entries(scores).map(([key, value]) => (
                <li key={key} className="list-group-item">
                  <strong>{formatScoreLabel(key)}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="visual-overview section">
          <div className="container">
            <h3 className="text-center">Overall Financial Health</h3>
            <div className="gauge-container text-center">
              <Gauge value={overallScore} label="Overall Health Score" />
            </div>
            <h3 className="mt-4 text-center">Visual Overview</h3>
            <Charts scores={scores} />
          </div>
        </section>

        <section className="insights-section section">
          <div className="container">
            <h3>Financial Assessment Summary</h3>
            {loading && <p>Loading insights…</p>}
            {insights && (
              <div className="insight-container">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {insights}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        {/* Display Analysis Text (from state) */}
        <section className="analysis-section section">
          <div className="container">
            <h3>Detailed Financial Analysis (for Testing):</h3>
            {analysis ? (
              <div className="analysis-text">
                {/* Use ReactMarkdown for the analysis as well */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <p>Loading analysis...</p>
            )}
          </div>
        </section>

        {/* Hardcoded CTA Section */}
        <section className="cta-section section">
          <div className="container">
            <h3>Next Steps</h3>
            <div className="cta-content">
              <h4>
                Ready to Transform Your Financial Future? Let's Do It Together.
              </h4>
              <p>
                Hey there! I'm from Echo Financial Advisors, and we do things
                differently. Instead of pushing a one-size-fits-all solution, we
                start with your story and build from there.
              </p>
              <h5>Here's What Makes Us Special:</h5>
              <ul>
                <li>
                  We combine cutting-edge AI technology with a personal touch
                </li>
                <li>Your goals and dreams drive everything we do</li>
                <li>
                  You get strategies that actually make sense for{' '}
                  <strong>YOUR</strong> life
                </li>
              </ul>
              <h5>What This Means for You:</h5>
              <ul>
                <li>✓ Smart, AI-powered analysis that cuts through the complexity</li>
                <li>✓ A dedicated advisor (that's me!) focused on your success</li>
                <li>✓ Clear, actionable steps toward your financial goals</li>
              </ul>
              <p>
                <strong>Don't Just Take My Word For It:</strong>
                <br />
                Join New Zealanders just like you, from across the country, who
                have started their journey with us. They're already seeing their
                financial dreams take shape.
              </p>
              <h5>Want to Know What's Possible for You?</h5>
              <ul>
                <li>
                  Your custom financial roadmap, powered by AI, with personalised
                  human oversight
                </li>
                <li>Real strategies that fit your life and goals</li>
                <li>
                  A genuine conversation about your future (no sales pitch, promise!)
                </li>
              </ul>
              <h5>Ready to Take the First Step?</h5>
              <p>Click Below to Schedule Your Free Consultation →</p>
              <div className="text-center">
                <button
                  onClick={handleBookingClick}
                  className="btn btn-primary btn-submit"
                >
                  Let's Talk About Your Future
                </button>
              </div>
              <div style={{ marginTop: '60px' }}>
                <p>
                  <em>
                    P.S. Spots fill up quickly, so don't wait too long to secure yours!
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Report;