// Purpose: This file contains the form for the user to input their retirement planning information.

import React from 'react';
import { useFormikContext } from 'formik';
import FormField from '../Forms/FormField.jsx';
import { Typography } from '@mui/material';

const ExpensesAssets = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  return (
    <div data-testid="step-2-container">
        <Typography variant="h3" data-testid="step-2-heading">Expenses & Debt</Typography>
        <FormField
            label="Monthly Expenses *"
            id="monthlyExpenses"
            type="number"
            placeholder="e.g., 2000"
            value={values.monthlyExpenses}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.monthlyExpenses && Boolean(errors.monthlyExpenses)}
            helperText={touched.monthlyExpenses && errors.monthlyExpenses}
            data-testid="monthly-expenses-input"
        />
        <FormField
            label="Total Debt *"
            id="totalDebt"
            type="number"
            placeholder="e.g., 10000"
            value={values.totalDebt}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.totalDebt && Boolean(errors.totalDebt)}
            helperText={touched.totalDebt && errors.totalDebt}
             data-testid="total-debt-input"
        />
        <FormField
            label="Savings *"
            id="savings"
            type="number"
            placeholder="e.g., 5000"
            value={values.savings}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.savings && Boolean(errors.savings)}
            helperText={touched.savings && errors.savings}
             data-testid="savings-input"
        />
        <FormField
            label="Emergency Funds *"
            id="emergencyFunds"
            type="number"
            placeholder="e.g., 10000"
            value={values.emergencyFunds}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.emergencyFunds && Boolean(errors.emergencyFunds)}
            helperText={touched.emergencyFunds && errors.emergencyFunds}
           data-testid="emergency-funds-input"
        />
        <FormField
            label="Total Investments *"
             id="totalInvestments"
             type="number"
             placeholder="e.g., 2000"
            value={values.totalInvestments}
             onChange={handleChange}
            onBlur={handleBlur}
            error={touched.totalInvestments && Boolean(errors.totalInvestments)}
             helperText={touched.totalInvestments && errors.totalInvestments}
              data-testid="total-investments-input"
        />
    </div>
  );
};

export default ExpensesAssets;