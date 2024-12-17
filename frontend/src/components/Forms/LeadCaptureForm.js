
import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  personalDetails: Yup.object({
    age: Yup.number().required('Age is required').min(18, 'Must be at least 18'),
    annualIncome: Yup.number().required('Annual Income is required').min(0),
    incomeFromInterest: Yup.number().min(0),
    incomeFromProperty: Yup.number().min(0),
  }),
  expensesAssets: Yup.object({
    monthlyExpenses: Yup.number().required('Monthly Expenses are required').min(0),
    emergencyFunds: Yup.number().required('Emergency Funds are required').min(0),
    savings: Yup.number().required('Savings are required').min(0),
    totalDebt: Yup.number().required('Total Debt is required').min(0),
  }),
  retirementPlanning: Yup.object({
    retirementAge: Yup.number().required('Retirement Age is required').min(18),
    expectedAnnualIncome: Yup.number().required('Expected Annual Income in Retirement is required').min(0),
    adjustForInflation: Yup.boolean(),
  }),
  contactInfo: Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    name: Yup.string().required('Name is required'),
    phone: Yup.string(),
  }),
});

const LeadCaptureForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/submit', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Assuming the backend returns the scores
      const { scores } = response.data;
      // Navigate to Results page with scores
      navigate('/results', { state: { scores } });
      resetForm();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          personalDetails: {
            age: '',
            annualIncome: '',
            incomeFromInterest: '',
            incomeFromProperty: '',
          },
          expensesAssets: {
            monthlyExpenses: '',
            emergencyFunds: '',
            savings: '',
            totalDebt: '',
          },
          retirementPlanning: {
            retirementAge: '',
            expectedAnnualIncome: '',
            adjustForInflation: false,
          },
          contactInfo: {
            email: '',
            name: '',
            phone: '',
          },
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Personal Details */}
            <h3>Personal Details</h3>
            <div className="mb-3">
              <Field type="number" name="personalDetails.age" className="form-control" placeholder="Age" />
              <ErrorMessage name="personalDetails.age" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="personalDetails.annualIncome" className="form-control" placeholder="Annual Income" />
              <ErrorMessage name="personalDetails.annualIncome" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="personalDetails.incomeFromInterest" className="form-control" placeholder="Income from Interest" />
              <ErrorMessage name="personalDetails.incomeFromInterest" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="personalDetails.incomeFromProperty" className="form-control" placeholder="Income from Property" />
              <ErrorMessage name="personalDetails.incomeFromProperty" component="div" className="text-danger" />
            </div>

            {/* Expenses & Assets */}
            <h3>Expenses & Assets</h3>
            <div className="mb-3">
              <Field type="number" name="expensesAssets.monthlyExpenses" className="form-control" placeholder="Monthly Expenses" />
              <ErrorMessage name="expensesAssets.monthlyExpenses" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="expensesAssets.emergencyFunds" className="form-control" placeholder="Emergency Funds" />
              <ErrorMessage name="expensesAssets.emergencyFunds" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="expensesAssets.savings" className="form-control" placeholder="Savings" />
              <ErrorMessage name="expensesAssets.savings" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="expensesAssets.totalDebt" className="form-control" placeholder="Total Debt" />
              <ErrorMessage name="expensesAssets.totalDebt" component="div" className="text-danger" />
            </div>

            {/* Retirement Planning */}
            <h3>Retirement Planning</h3>
            <div className="mb-3">
              <Field type="number" name="retirementPlanning.retirementAge" className="form-control" placeholder="Retirement Age" />
              <ErrorMessage name="retirementPlanning.retirementAge" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="number" name="retirementPlanning.expectedAnnualIncome" className="form-control" placeholder="Expected Annual Income in Retirement" />
              <ErrorMessage name="retirementPlanning.expectedAnnualIncome" component="div" className="text-danger" />
            </div>
            <div className="mb-3 form-check">
              <Field type="checkbox" name="retirementPlanning.adjustForInflation" className="form-check-input" />
              <label className="form-check-label">Adjust for Inflation</label>
            </div>

            {/* Contact Info */}
            <h3>Contact Information</h3>
            <div className="mb-3">
              <Field type="email" name="contactInfo.email" className="form-control" placeholder="Email" />
              <ErrorMessage name="contactInfo.email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="text" name="contactInfo.name" className="form-control" placeholder="Name" />
              <ErrorMessage name="contactInfo.name" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field type="text" name="contactInfo.phone" className="form-control" placeholder="Phone" />
              <ErrorMessage name="contactInfo.phone" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default LeadCaptureForm;
