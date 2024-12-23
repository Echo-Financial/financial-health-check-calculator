// src/components/InputSections/CreditHealth.jsx

import React from 'react';
import { Field, ErrorMessage } from 'formik';

const CreditHealth = () => (
  <>
    <h3 data-testid="step-5-heading">Credit Health</h3>
    <div className="form-group">
      <label htmlFor="creditScore">Credit Score (300-850) *</label>
      <Field
        type="number"
        id="creditScore"
        name="creditScore"
        className="input-field"
        placeholder="e.g. 700"
        data-testid="credit-score-field"
      />
      <ErrorMessage name="creditScore" component="div" className="text-danger" />
    </div>
  </>
);

export default CreditHealth;
