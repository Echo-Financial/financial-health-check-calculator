import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMarketingEmail } from '../services/api.js';
import './../styles/Report.scss';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure scores, analysis, and contactInfo from location.state:
  const { scores, analysis, contactInfo } = location.state || {};
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResponse, setEmailResponse] = useState('');

  // Fetch insights (original instant feedback)
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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
    window.open('https://echofinancialadvisors.trafft.com/', '_blank');
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

  // Function to handle sending the marketing email
  const handleSendMarketingEmail = async () => {
    if (!contactInfo || !contactInfo.email) {
      setEmailResponse('No contact information available.');
      return;
    }
    setEmailSending(true);
    try {
      const payload = {
        email: contactInfo.email,
        name: contactInfo.name,
        // Optionally, include more fields if needed.
      };
      const response = await sendMarketingEmail(payload);
      setEmailResponse('Marketing email sent successfully.');
      console.log('Marketing email response:', response.data);
    } catch (error) {
      console.error('Error sending marketing email:', error);
      setEmailResponse('Failed to send marketing email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="report-container">
      <main className="report-content">
        {/* Score Summary */}
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

        {/* Visual Overview */}
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

        {/* Instant Feedback Insights */}
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

        {/* Detailed Analysis */}
        <section className="analysis-section section">
          <div className="container">
            <h3>Detailed Financial Analysis (for Testing):</h3>
            {analysis ? (
              <div className="analysis-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <p>Loading analysis...</p>
            )}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="cta-section section">
          <div className="container">
            <h3>Next Steps</h3>
            <div className="cta-content">
              <h4>Ready to Transform Your Financial Future? Let’s Get Started.</h4>
              <p>
                I'm Kevin from Echo Financial Advisors, and at Echo we do things
                differently. Instead of pushing a one-size-fits-all solution, we build your financial strategy around your unique story.
              </p>
              <h5>Here's What Makes Us Special:</h5>
              <ul>
                <li>Cutting-Edge Analysis: We leverage the latest AI technology to decode complex financial data.</li>
                <li>Expert Oversight: Every insight is rigorously reviewed by a dedicated advisor committed to your success.</li>
                <li>Tailored Strategies: We deliver clear, actionable steps designed specifically for your financial journey.</li>
              </ul>
              <h5>What This Means for You:</h5>
              <ul>
                <li>✓ AI-powered analysis that cuts through the complexity</li>
                <li>✓ A dedicated advisor (that's me!) focused on your success</li>
                <li>✓ Clear, actionable steps toward your financial goals</li>
              </ul>
              <p>
                <strong>Trusted by New Zealanders:</strong>
                <br />
                Join clients nationwide who are already realising the benefits of a financial plan that integrates innovative technology with expert human insight.
              </p>
              <h5>Want to Know What's Possible for You?</h5>
              <ul>
                <li>A custom financial plan that blends state-of-the-art AI with hands-on advisory oversight.</li>
                <li>Data-driven insights paired with personalised strategy.</li>
                <li>A genuine, no-pressure conversation about your financial future.</li>
              </ul>
              <h5>Take the First Step Today:</h5>
              <p>
                Click below to schedule your free consultation and begin your journey towards financial transformation →
              </p>
              <div className="text-center">
                <button onClick={handleBookingClick} className="btn btn-primary btn-submit">
                  Let’s Shape Your Future
                </button>
              </div>
              <div style={{ marginTop: '60px' }}>
                <p>
                  <em>P.S. Spots fill up quickly, so don't wait too long to secure yours!</em>
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
