// src/components/Forms/LeadCaptureForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import PersonalDetails from '../InputSections/PersonalDetails';
import ExpensesAssets from '../InputSections/ExpensesAssets';
import RetirementPlanning from '../InputSections/RetirementPlanning';
import RetirementGoals from '../InputSections/RetirementGoals';
import CreditHealth from '../InputSections/CreditHealth'; // New component

// Updated validationSchema to include all fields used in each step
const validationSchema = Yup.object({
  age: Yup.number()
    .required('Age is required')
    .min(18, 'Must be at least 18'),
  annualIncome: Yup.number()
    .required('Annual Income is required')
    .min(0, 'Must be at least 0'),
  incomeFromInterest: Yup.number()
    .required('Income from Interest is required')
    .min(0, 'Must be at least 0'),
  incomeFromProperty: Yup.number()
    .required('Income from Property is required')
    .min(0, 'Must be at least 0'),
  monthlyExpenses: Yup.number()
    .required('Monthly Expenses are required')
    .min(0, 'Must be at least 0'),
  totalDebt: Yup.number()
    .required('Total Debt is required')
    .min(0, 'Must be at least 0'),
  savings: Yup.number()
    .required('Savings is required')
    .min(0, 'Must be at least 0'),
  emergencyFunds: Yup.number()
    .required('Emergency Funds are required')
    .min(0, 'Must be at least 0'),
  totalAssets: Yup.number()
    .required('Total Assets are required')
    .min(0, 'Must be at least 0'),
  currentRetirementSavings: Yup.number()
    .required('Current Retirement Savings is required')
    .min(0, 'Must be at least 0'),
  targetRetirementSavings: Yup.number()
    .required('Target Retirement Savings is required')
    .min(0, 'Must be at least 0'),
  retirementAge: Yup.number()
    .required('Retirement Age is required')
    .min(18, 'Must be at least 18'),
  expectedAnnualIncomeInRetirement: Yup.number()
    .required('Expected Annual Income in Retirement is required')
    .min(0, 'Must be at least 0'),
  creditScore: Yup.number()
    .required('Credit Score is required')
    .min(300, 'Minimum is 300')
    .max(850, 'Maximum is 850'),
});

// Function to transform Formik values from strings to numbers
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
    'totalAssets',
    'currentRetirementSavings',
    'targetRetirementSavings',
    'retirementAge',
    'expectedAnnualIncomeInRetirement',
    'creditScore',
  ];

  const transformed = { ...values };
  numberFields.forEach((field) => {
    transformed[field] = Number(values[field]);
  });

  return transformed;
};

const LeadCaptureForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const transformedValues = transformValues(values);
      await axios.post(`${API_URL}/api/submit`, transformedValues);
      resetForm();
      setShowModal(true);
      setSubmitting(false);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Submission failed. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  const handleNext = async (formik) => {
    const errors = await formik.validateForm();
    const currentStepErrors = getCurrentStepErrors(errors, step);
    if (Object.keys(currentStepErrors).length === 0) {
      setStep(step + 1);
    } else {
      Object.keys(currentStepErrors).forEach((field) =>
        formik.setFieldTouched(field, true)
      );
    }
  };

  const handlePrevious = () => setStep(step - 1);

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ['age', 'annualIncome', 'incomeFromInterest', 'incomeFromProperty'];
      case 2:
        return ['monthlyExpenses', 'totalDebt', 'savings', 'emergencyFunds'];
      case 3:
        return ['totalAssets', 'currentRetirementSavings'];
      case 4:
        return [
          'targetRetirementSavings',
          'retirementAge',
          'expectedAnnualIncomeInRetirement',
        ];
      case 5:
        return ['creditScore'];
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

  const renderStepFields = () => {
    switch (step) {
      case 1:
        return <PersonalDetails />;
      case 2:
        return <ExpensesAssets />;
      case 3:
        return <RetirementPlanning />;
      case 4:
        return <RetirementGoals />;
      case 5:
        return <CreditHealth />;
      default:
        return null;
    }
  };

  return (
    <div className="lead-form-container" data-testid="lead-capture-form">
      <h2>Complete Your Financial Health Check</h2>
      <p>
        Provide the essential details in a few simple steps. After submitting, you'll have the
        option to continue via LeadPal to receive your personalized report.
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
          totalAssets: '',
          currentRetirementSavings: '',
          targetRetirementSavings: '',
          retirementAge: '',
          expectedAnnualIncomeInRetirement: '',
          creditScore: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <ProgressBar
              now={(step / totalSteps) * 100}
              label={`${Math.round((step / totalSteps) * 100)}%`}
            />
            {renderStepFields()}
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
                  disabled={formik.isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="success" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Get Your Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Click below to continue and receive your financial health check results:
          </p>
          <Button
            href="https://your-leadpal-link.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue with Google, LinkedIn, or Outlook
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeadCaptureForm;
