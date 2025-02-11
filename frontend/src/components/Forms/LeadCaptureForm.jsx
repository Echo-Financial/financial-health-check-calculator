// LeadCaptureForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, ProgressBar } from 'react-bootstrap';
import PersonalDetails from '../InputSections/PersonalDetails.js';
import ExpensesAssets from '../InputSections/ExpensesAssets.jsx';
import RetirementPlanning from '../InputSections/RetirementPlanning.jsx';
import CreditHealth from '../InputSections/CreditHealth.jsx';
import ContactDetails from '../InputSections/ContactDetails.jsx';

// Updated validationSchema to include adjustForInflation as an optional boolean.
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
    totalInvestments: Yup.number()
        .required('Total Investments are required')
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
    // New field for inflation adjustment
    adjustForInflation: Yup.boolean().optional(),
    creditScore: Yup.number()
        .required('Credit Score is required')
        .min(300, 'Minimum is 300')
        .max(850, 'Maximum is 850'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    name: Yup.string()
        .required('Name is required'),
    phone: Yup.string().optional(),
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
    // Set the initial step to 1 (steps 1–5)
    const [step, setStep] = useState(1);
    const totalSteps = 5;
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [scores, setScores] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // added loading state

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('handleSubmit called');
        setIsLoading(true); // Start loading
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const transformedValues = transformValues(values);

            const payload = {
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
                    currentRetirementSavings: transformedValues.currentRetirementSavings, // <-- ADDED
                    adjustForInflation: values.adjustForInflation || false, // Default to false if not provided
                },
                contactInfo: {
                    email: transformedValues.email,
                    name: transformedValues.name,
                    phone: transformedValues.phone,
                },
            };

            const response = await axios.post(`${API_URL}/api/submit`, payload);
            setScores(response.data.scores);
            setShowModal(true);  // move inside try
        } catch (err) {
            let message = 'Submission failed. Please try again.';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            }
            setError(message);
            setSubmitting(false);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Modified handleNext: For non-final steps, mark current step fields as touched.
    // When transitioning to the final step (step 5), explicitly reset touched for email, name, and phone.
    const handleNext = async (formik) => {
        const errors = await formik.validateForm();
        const currentStepErrors = getCurrentStepErrors(errors, step);
        if (Object.keys(currentStepErrors).length === 0) {
            // For steps before the final one, mark current fields as touched.
            if (step < totalSteps - 1) {
                const stepFields = getFieldsForStep(step);
                stepFields.forEach(field => formik.setFieldTouched(field, true));
            }
            // When transitioning to the final step, reset touched for the final fields.
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
        setStep(step - 1);
        setShowModal(false);  // close modal when navigating backwards
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

    const renderStepFields = () => {
        switch (step) {
            case 1:
                return <PersonalDetails />;
            case 2:
                return <ExpensesAssets />;
            case 3:
                return <RetirementPlanning />;  // Renders a checkbox for adjustForInflation if desired.
            case 4:
                return <CreditHealth />;
            case 5:
                return <ContactDetails />;
            default:
                return null;
        }
    };

    return (
        <div className="lead-form-container" data-testid="lead-capture-form">
            <h2>Complete Your Financial Health Check</h2>
            <p>
                Provide your essential details in just a few simple steps. Once you submit the form,
                we'll generate your personalized financial report, which you can review immediately.
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
                    // New field for inflation adjustment (default is false)
                    adjustForInflation: false,
                    creditScore: '',
                    email: '',
                    name: '',
                    phone: '',
                }}
                // Ensure no fields are touched on mount.
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
                                <Button type="submit" variant="success" disabled={formik.isSubmitting || isLoading}>
                                    {isLoading ? 'Submitting...' : formik.isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </Form>
                )}
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
