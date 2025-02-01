import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
            savingsScore: 'Savings Score',
            emergencyFundScore: 'Emergency Fund Score',
            retirementScore: 'Retirement Score',
            growthOpportunityScore: 'Growth Opportunity Score',
            overallFinancialHealthScore: 'Overall Financial Health Score',
            potentialForImprovementScore: 'Potential for Improvement Score',
        };

        return customLabels[label] || label
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    };

    const overallScore = scores.overallFinancialHealthScore || 0;

    const handleBookingClick = () => {
        window.open('https://echofinancialadvisors.trafft.com/', '_blank');
      };

    return (
        <div className="report-container">
             <main className="report-content">
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
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{insights}</ReactMarkdown>
                          </div>
                      )}
                  </div>
              </section>

              <section className="cta-section section">
                  <div className="container">
                    <h3>Next Steps</h3>
                    <p>
                      As the sole financial adviser at Echo Financial Advisers Ltd, I provide personalised and dedicated guidance tailored to your unique circumstances. To take the next step towards securing your financial future, please book your personal consultation.
                    </p>
                    <div className="text-center">
                        <button
                            onClick={handleBookingClick}
                            className="btn btn-primary btn-submit"
                         >
                         Book Your Personal Consultation
                       </button>
                    </div>
                  </div>
              </section>
          </main>
        </div>
    );
};

export default Report;