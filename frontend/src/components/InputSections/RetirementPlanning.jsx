// src/components/InputSections/RetirementPlanning.jsx

import React from 'react';
import { Field, ErrorMessage } from 'formik';

const RetirementPlanning = () => (
  <>
    <h3 data-testid="step-3-heading">Assets & Savings</h3>
    <div className="form-group">
      <label htmlFor="totalAssets">Total Assets *</label>
      <Field
        type="number"
        id="totalAssets"
        name="totalAssets"
        className="input-field"
        placeholder="e.g., 20000"
      />
      <ErrorMessage name="totalAssets" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="currentRetirementSavings">Current Retirement Savings *</label>
      <Field
        type="number"
        id="currentRetirementSavings"
        name="currentRetirementSavings"
        className="input-field"
        placeholder="e.g., 15000"
      />
      <ErrorMessage name="currentRetirementSavings" component="div" className="text-danger" />
    </div>
  </>
);

export default RetirementPlanning;
