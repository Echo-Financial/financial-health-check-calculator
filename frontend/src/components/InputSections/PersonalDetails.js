// src/components/InputSections/PersonalDetails.jsx

import React from 'react';
import { Field, ErrorMessage } from 'formik';

const PersonalDetails = () => (
  <>
    <h3 data-testid="step-1-heading">Personal Details</h3>
    <div className="form-group">
      <label htmlFor="age">Age *</label>
      <Field
        type="number"
        id="age"
        name="age"
        className="input-field"
        placeholder="e.g., 30"
      />
      <ErrorMessage name="age" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="annualIncome">Annual Income *</label>
      <Field
        type="number"
        id="annualIncome"
        name="annualIncome"
        className="input-field"
        placeholder="e.g., 50000"
      />
      <ErrorMessage name="annualIncome" component="div" className="text-danger" />
    </div>

    <div className="form-group">
      <label htmlFor="incomeFromInterest">Income from Interest *</label>
      <Field
        type="number"
        id="incomeFromInterest"
        name="incomeFromInterest"
        className="input-field"
        placeholder="e.g., 2000"
      />
      <ErrorMessage name="incomeFromInterest" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="incomeFromProperty">Income from Property *</label>
      <Field
        type="number"
        id="incomeFromProperty"
        name="incomeFromProperty"
        className="input-field"
        placeholder="e.g., 1500"
      />
      <ErrorMessage name="incomeFromProperty" component="div" className="text-danger" />
    </div>
  </>
);

export default PersonalDetails;
