import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { sendMarketingEmail } from '../../services/api.js';
import { getUtmParams } from '../../utils/utm';
import PersonalDetails from '../InputSections/PersonalDetails.js';
import ExpensesAssets from '../InputSections/ExpensesAssets.jsx';
import RetirementPlanning from '../InputSections/RetirementPlanning.jsx';
import CreditHealth from '../InputSections/CreditHealth.jsx';
import ContactDetails from '../InputSections/ContactDetails.jsx';

// Modify validation schema - remove agreeMarketing
const validationSchema = Yup.object({
  age: Yup.number().required('Age is required').min(18, 'Must be at least 18 years old'),
  annualIncome: Yup.number().required('Annual income is required').min(0, 'Must be at least 0'),
  incomeFromInterest: Yup.number().min(0, 'Must be at least 0'),
  incomeFromProperty: Yup.number().min(0, 'Must be at least 0'),
  monthlyExpenses: Yup.number().required('Monthly expenses are required').min(0, 'Must be at least 0'),
  totalDebt: Yup.number().required('Total debt is required').min(0, 'Must be at least 0'),
  savings: Yup.number().required('Savings are required').min(0, 'Must be at least 0'),
  emergencyFunds: Yup.number().required('Emergency funds are required').min(0, 'Must be at least 0'),
  totalInvestments: Yup.number().required('Total investments are required').min(0, 'Must be at least 0'),
  totalAssets: Yup.number().required('Total assets are required').min(0, 'Must be at least 0'),
  currentRetirementSavings: Yup.number().required('Current retirement savings are required').min(0, 'Must be at least 0'),
  targetRetirementSavings: Yup.number().required('Target retirement savings are required').min(0, 'Must be at least 0'),
  retirementAge: Yup.number().required('Retirement age is required').min(18, 'Must be at least 18'),
  creditScore: Yup.number().min(300, 'Credit score must be at least 300').max(850, 'Credit score must be at most 850'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  name: Yup.string().required('Name is required'),
  phone: Yup.string(),
  // agreeMarketing removed from validation
});

const transformValues = (values) => {
  const numberFields = [
    'age',
    'annualIncome',
    'incomeFromInterest',
    'incomeFromProperty',
    'monthlyExpenses',
    'totalDebt',
    'savings',
    'emergencyFunds',
    'totalInvestments',
    'totalAssets',
    'currentRetirementSavings',
    'targetRetirementSavings',
    'retirementAge',
    'creditScore',
  ];

  const transformed = { ...values };
  numberFields.forEach((field) => {
    transformed[field] = Number(values[field]);
  });
  return transformed;
};

const LeadCaptureForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [scores, setScores] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const utm = useMemo(() => getUtmParams(), []);
  const pageMeta = useMemo(() => ({
    referrer: document.referrer || null,
    landingPage: window.location.pathname + (window.location.search || ''),
  }), []);
  
  // State for marketing consent outside of Formik
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);

  const handleSubmit = async (values, formikHelpers) => {
    // Check marketing consent separately from Formik
    if (!marketingConsent) {
      setShowConsentError(true);
      formikHelpers.setSubmitting(false);
      return;
    }
    
    // Reset error state and set loading flag
    setShowConsentError(false);
    setIsLoading(true);
    setSubmitting(true);
    
    try {
      // Add marketing consent to the values object manually
      const submissionValues = {
        ...values,
        agreeMarketing: marketingConsent
      };
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const transformedValues = transformValues(submissionValues);

      // Build originalData payload
      const originalData = {
        personalDetails: {
          age: transformedValues.age,
          annualIncome: transformedValues.annualIncome,
          incomeFromInterest: transformedValues.incomeFromInterest,
          incomeFromProperty: transformedValues.incomeFromProperty,
        },
        expensesAssets: {
          monthlyExpenses: transformedValues.monthlyExpenses,
          emergencyFunds: transformedValues.emergencyFunds,
          savings: transformedValues.savings,
          totalDebt: transformedValues.totalDebt,
          totalInvestments: transformedValues.totalInvestments,
        },
        retirementPlanning: {
          retirementAge: transformedValues.retirementAge,
          targetRetirementSavings: transformedValues.targetRetirementSavings,
          currentRetirementSavings: transformedValues.currentRetirementSavings,
          adjustForInflation: values.adjustForInflation || false,
        },
        contactInfo: {
          email: transformedValues.email,
          name: transformedValues.name,
          phone: transformedValues.phone,
        },
      };

      // FIRST API CALL: /api/submit (for scores and instant feedback)
      // Include UTM/source data in the query string to avoid changing validated payload shape
      const qs = new URLSearchParams();
      Object.entries(utm).forEach(([k, v]) => {
        if (!v) return;
        if (k === 'landingPage' || k === 'referrer') return; // avoid duplicates; added separately below
        qs.append(k, v);
      });
      // Include page metadata and consent in query string to avoid altering validated body shape
      if (pageMeta.referrer) qs.append('referrer', pageMeta.referrer);
      if (pageMeta.landingPage) qs.append('landingPage', pageMeta.landingPage);
      qs.append('consent', marketingConsent ? 'true' : 'false');
      const submitUrl = `${API_URL}/api/submit${qs.toString() ? `?${qs.toString()}` : ''}`;
      const submitResponse = await axios.post(submitUrl, originalData);
      const scores = submitResponse.data.scores;
      setScores(scores);

      // Construct payload for /api/financial-analysis
      const analysisPayload = {
        originalData,
        calculatedMetrics: scores,
        utm, // safe to include; endpoint does not validate with Joi
        ...pageMeta,
        consent: marketingConsent === true,
      };

      // SECOND API CALL: /api/financial-analysis (for detailed report)
      const analysisResponse = await axios.post(`${API_URL}/api/financial-analysis`, analysisPayload);
      const analysisText = analysisResponse.data.analysis;

      console.log("Response from /api/submit:", submitResponse.data);
      console.log("Response from /api/financial-analysis:", analysisResponse.data);

      // If marketingConsent is true, trigger marketing email via sendMarketingEmail from services/api.js
      if (marketingConsent) {
        try {
          const campaignResponse = await sendMarketingEmail({
            to: transformedValues.email,
            name: transformedValues.name,
            analysisText, // dynamic analysis text from backend
            personalDetails: originalData.personalDetails,  // client's personal details
            contactInfo: originalData.contactInfo,          // include contact info with the name
            calculatedMetrics: scores, // scores used as calculatedMetrics
          });
          console.log("SendGrid campaign generated: ", campaignResponse.data);
        } catch (campaignError) {
          console.error("Failed to generate SendGrid campaign", campaignError);
        }
      }

      // Navigate to Report page with contactInfo included:
      navigate('/report', {
        state: {
          scores,
          analysis: analysisText,
          contactInfo: originalData.contactInfo,
        },
      });
      setShowModal(false);
    } catch (err) {
      let message = 'Submission failed. Please try again.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      formikHelpers.setSubmitting(false);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleNext = async (formik) => {
    // Clear consent error when changing steps
    setShowConsentError(false);
    
    const errors = await formik.validateForm();
    const currentStepErrors = getCurrentStepErrors(errors, step);
    if (Object.keys(currentStepErrors).length === 0) {
      if (step < totalSteps - 1) {
        const stepFields = getFieldsForStep(step);
        stepFields.forEach(field => formik.setFieldTouched(field, true));
      }
      if (step === totalSteps - 1) {
        formik.setTouched(prev => ({
          ...prev,
          email: false,
          name: false,
          phone: false,
        }));
      }
      setStep(step + 1);
    } else {
      Object.keys(currentStepErrors).forEach((field) =>
        formik.setFieldTouched(field, true)
      );
    }
  };

  const handlePrevious = () => {
    // Clear consent error when going back
    setShowConsentError(false);
    setStep(step - 1);
    setShowModal(false);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ['age', 'annualIncome', 'incomeFromInterest', 'incomeFromProperty'];
      case 2:
        return ['monthlyExpenses', 'totalDebt', 'savings', 'emergencyFunds', 'totalInvestments'];
      case 3:
        return ['totalAssets', 'currentRetirementSavings', 'targetRetirementSavings', 'retirementAge', 'adjustForInflation'];
      case 4:
        return ['creditScore'];
      case 5:
        return ['email', 'name', 'phone'];
      default:
        return [];
    }
  };

  const getCurrentStepErrors = (errors, step) => {
    const stepFields = getFieldsForStep(step);
    return stepFields.reduce((acc, field) => {
      if (errors[field]) acc[field] = errors[field];
      return acc;
    }, {});
  };

  const renderStepFields = (formik) => {
    switch (step) {
      case 1:
        return <PersonalDetails />;
      case 2:
        return <ExpensesAssets />;
      case 3:
        return <RetirementPlanning />;
      case 4:
        return <CreditHealth />;
      case 5:
        return (
          <>
            <ContactDetails />
            {/* Custom checkbox implementation outside of Formik */}
            <div className="form-group mt-3">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={marketingConsent}
                  onChange={(e) => {
                    setMarketingConsent(e.target.checked);
                    if (e.target.checked) setShowConsentError(false);
                  }}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ marginLeft: '0px' }}>
                  I agree to receive marketing materials and personalised offers.
                </span>
              </label>
              {/* Show error only when appropriate */}
              {showConsentError && (
                <div className="text-danger">
                  Please agree to receive personalised offers and exclusive insights to view your report.
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="lead-form-container" data-testid="lead-capture-form">
      <h2>Complete Your Financial Health Check</h2>
      <p className="form-subtext">
        Provide your essential details in just a few simple steps. Once you submit the form,
        we'll generate your personalised financial report, which you can review immediately.
      </p>
      {error && <p className="text-danger">{error}</p>}
      <Formik
        initialValues={{
          age: '',
          annualIncome: '',
          incomeFromInterest: '',
          incomeFromProperty: '',
          monthlyExpenses: '',
          totalDebt: '',
          savings: '',
          emergencyFunds: '',
          totalInvestments: '',
          totalAssets: '',
          currentRetirementSavings: '',
          targetRetirementSavings: '',
          retirementAge: '',
          adjustForInflation: false,
          creditScore: '',
          email: '',
          name: '',
          phone: '',
        }}
        initialTouched={{
          age: false,
          annualIncome: false,
          incomeFromInterest: false,
          incomeFromProperty: false,
          monthlyExpenses: false,
          totalDebt: false,
          savings: false,
          emergencyFunds: false,
          totalInvestments: false,
          totalAssets: false,
          currentRetirementSavings: false,
          targetRetirementSavings: false,
          retirementAge: false,
          adjustForInflation: false,
          creditScore: false,
          email: false,
          name: false,
          phone: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount={false}
      >
        {(formik) => {
          const pending = formik?.isSubmitting || submitting || isLoading;
          return (
            <Form>
              <fieldset disabled={pending}>
                <ProgressBar
                  now={((step - 1) / (totalSteps - 1)) * 100}
                  label={`${Math.round(((step - 1) / (totalSteps - 1)) * 100)}%`}
                />
                {renderStepFields(formik)}
                <div className="d-flex justify-content-between mt-4">
                  {step > 1 && (
                    <Button variant="secondary" onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}
                  {step < totalSteps ? (
                    <Button
                      variant="primary"
                      onClick={() => handleNext(formik)}
                      disabled={pending}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" variant="success" disabled={pending}>
                      {pending && <Spinner animation="border" size="sm" className="me-2" />}
                      {pending ? 'Submitting' : 'Submit'}
                    </Button>
                  )}
                </div>
                <div className="visually-hidden" aria-live="polite">
                  {pending ? 'Submitting, please wait' : ''}
                </div>
              </fieldset>
            </Form>
          );
        }}
      </Formik>
      {showModal && scores && (
        <div className="modal-container">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Get Your Results</h5>
            </div>
            <div className="modal-body">
              <p>Click below to continue and receive your financial health check results:</p>
              <Button
                onClick={() => {
                  navigate('/report', { state: { scores } });
                  setShowModal(false);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadCaptureForm;
