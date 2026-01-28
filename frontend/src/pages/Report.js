// frontend/src/pages/Report.js
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from 'react-bootstrap';

import Charts from '../components/Visualisations/Charts.js';
import Gauge from '../components/Visualisations/Gauge.js';
import { getUtmParams } from '../utils/utm.js';
import { sendMarketingEmail } from '../services/api.js';
import './../styles/Report.scss';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { scores, originalData, financialProfile: navProfile, marketingConsent } = location.state || {};
  const initialAnalysis = location.state?.analysis || location.state?.analysisText || '';

  const [reportText, setReportText] = useState(initialAnalysis);
  const [financialProfile, setFinancialProfile] = useState(navProfile || null);
  const [loadingReport, setLoadingReport] = useState(!initialAnalysis);

  const didInit = useRef(false);
  const didSendEmail = useRef(false);

  const utm = getUtmParams();
  const name = location.state?.contactInfo?.name || '';
  const email = location.state?.contactInfo?.email || '';
  const bookingUrl =
    'https://outlook.office.com/book/EchoFinancialAdvisorsLtd1@echo-financial-advisors.co.nz/';

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (!scores && !originalData) {
      navigate('/');
      return;
    }

    if (initialAnalysis && !originalData) {
      setLoadingReport(false);
      return;
    }

    let alive = true;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchUnifiedReport = async () => {
      try {
        setLoadingReport(true);

        const body = {
          originalData: originalData || undefined,
          calculatedMetrics: scores || financialProfile?.scores || undefined,
          consent: false,
        };

        console.debug('[Report] POST /api/financial-analysis (unified) body keys:', {
          hasOriginalData: !!originalData,
          hasScores: !!scores,
        });

        const resp = await axios.post(`${API_URL}/api/financial-analysis`, body, {
          timeout: 60000,
        });

        const payload = resp?.data?.data ?? resp?.data ?? null;
        if (!alive) return;

        const text = payload?.analysis || '';
        const profile = payload?.financialProfile || null;

        if (!text) {
          throw new Error('No analysis returned from /api/financial-analysis');
        }

        setReportText(text);
        setFinancialProfile(profile);

        // Send marketing email asynchronously if admin token is present
        if (!didSendEmail.current && marketingConsent) {
          const token = localStorage.getItem('token');
          if (token) {
            didSendEmail.current = true;
            sendMarketingEmail({
              analysisText: text,
              personalDetails: originalData?.personalDetails || {},
              calculatedMetrics: scores || profile?.scores || {},
              contactInfo: location.state?.contactInfo || {},
            })
              .then((campaignResponse) => {
                console.log('[Report] marketing email sent', campaignResponse.data);
              })
              .catch((campaignError) => {
                console.error('[Report] marketing email failed', campaignError);
              });
          }
        }
      } catch (err) {
        console.error('[Report] unified financial-analysis failed:', err);
        if (alive) {
          setReportText(
            "We were unable to generate your financial report at this time. Please try again shortly."
          );
        }
      } finally {
        if (alive) setLoadingReport(false);
      }
    };

    fetchUnifiedReport();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!scores) {
    navigate('/');
    return null;
  }

  const formatScoreLabel = (label) => {
    const map = {
      dtiScore: 'Debt to Income Score',
      savingsScore: 'Savings Score',
      emergencyFundScore: 'Emergency Fund Score',
      retirementScore: 'Retirement Score',
      growthOpportunityScore: 'Growth Opportunity Score',
      potentialForImprovementScore: 'Potential for Improvement Score',
      overallFinancialHealthScore: 'Overall Financial Health Score',
    };
    return map[label] || label.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  };

  const overallScore =
    scores.overallFinancialHealthScore || financialProfile?.scores?.overallFinancialHealthScore || 0;

  return (
    <div className="report-container">
      <main className="report-content">
        {/* Scores */}
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

        {/* Unified Report */}
        <section className="analysis-section section">
          <div className="container">
            <h3>Your Personalised Financial Report</h3>

            {loadingReport ? (
              <p>Generating your personalised report…</p>
            ) : (
              <div className="analysis-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{reportText}</ReactMarkdown>
              </div>
            )}

            <div className="mt-5">
              <h5>Next step</h5>
              <p>Turn these insights into an action plan with a free 15-minute consultation.</p>
              <Button
                as="a"
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                onClick={() => console.log('cta_book_clicked', { name, email, ...utm })}
              >
                Book your free consultation
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Report;
