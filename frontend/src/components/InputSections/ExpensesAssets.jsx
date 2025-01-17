import React from 'react';
import { Field, ErrorMessage } from 'formik';

const ExpensesAssets = () => (
  <>
    <h3 data-testid="step-2-heading">Expenses & Debt</h3>
    <div className="form-group">
      <label htmlFor="monthlyExpenses">Monthly Expenses *</label>
      <Field
        type="number"
        id="monthlyExpenses"
        name="monthlyExpenses"
        className="input-field"
        placeholder="e.g., 2000"
      />
      <ErrorMessage name="monthlyExpenses" component="div" className="text-danger" />
    </div>
    
    <div className="form-group">
      <label htmlFor="totalDebt">Total Debt *</label>
      <Field
        type="number"
        id="totalDebt"
        name="totalDebt"
        className="input-field"
        placeholder="e.g., 10000"
      />
      <ErrorMessage name="totalDebt" component="div" className="text-danger" />
    </div>

    <div className="form-group">
      <label htmlFor="savings">Savings *</label>
      <Field
        type="number"
        id="savings"
        name="savings"
        className="input-field"
        placeholder="e.g., 5000"
      />
      <ErrorMessage name="savings" component="div" className="text-danger" />
    </div>

    <div className="form-group">
      <label htmlFor="emergencyFunds">Emergency Funds *</label>
      <Field
        type="number"
        id="emergencyFunds"
        name="emergencyFunds"
        className="input-field"
        placeholder="e.g., 10000"
      />
      <ErrorMessage name="emergencyFunds" component="div" className="text-danger" />
    </div>
    {/* New totalInvestments Field */}
    <div className="form-group">
        <label htmlFor="totalInvestments">Total Investments *</label>
        <Field
            type="number"
            id="totalInvestments"
            name="totalInvestments"
            className="input-field"
            placeholder="e.g., 2000"
        />
        <ErrorMessage name="totalInvestments" component="div" className="text-danger" />
    </div>
  </>
);

export default ExpensesAssets;