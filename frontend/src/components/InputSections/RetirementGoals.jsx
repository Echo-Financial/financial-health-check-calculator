// src/components/InputSections/RetirementGoals.jsx

import React from 'react';
import { Field, ErrorMessage } from 'formik';

const RetirementGoals = () => (
  <>
    <h3 data-testid="step-4-heading">Retirement Goals</h3>
    <div className="form-group">
      <label htmlFor="targetRetirementSavings">Target Retirement Savings *</label>
      <Field
        type="number"
        id="targetRetirementSavings"
        name="targetRetirementSavings"
        className="input-field"
        placeholder="e.g., 30000"
      />
      <ErrorMessage name="targetRetirementSavings" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="retirementAge">Retirement Age *</label>
      <Field
        type="number"
        id="retirementAge"
        name="retirementAge"
        className="input-field"
        placeholder="e.g., 65"
      />
      <ErrorMessage name="retirementAge" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="expectedAnnualIncomeInRetirement">Expected Annual Income in Retirement *</label>
      <Field
        type="number"
        id="expectedAnnualIncomeInRetirement"
        name="expectedAnnualIncomeInRetirement"
        className="input-field"
        placeholder="e.g., 40000"
      />
      <ErrorMessage name="expectedAnnualIncomeInRetirement" component="div" className="text-danger" />
    </div>
  </>
);

export default RetirementGoals;
