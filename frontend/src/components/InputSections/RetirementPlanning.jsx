// Purpose: This file contains the form for the user to input their retirement planning information.

import React from 'react';
import { useFormikContext } from 'formik';
import FormField from '../Forms/FormField.jsx';
import { Typography } from '@mui/material';

const RetirementPlanning = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  return (
    <div data-testid="step-3-container">
         <Typography variant="h3" data-testid="step-3-heading">Assets & Savings</Typography>
        <FormField
           label="Total Assets *"
            id="totalAssets"
           type="number"
            placeholder="e.g., 20000"
           value={values.totalAssets}
            onChange={handleChange}
           onBlur={handleBlur}
           error={touched.totalAssets && Boolean(errors.totalAssets)}
           helperText={touched.totalAssets && errors.totalAssets}
             data-testid="total-assets-input"
        />
       <FormField
             label="Current Retirement Savings *"
             id="currentRetirementSavings"
              type="number"
           placeholder="e.g., 15000"
            value={values.currentRetirementSavings}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.currentRetirementSavings && Boolean(errors.currentRetirementSavings)}
             helperText={touched.currentRetirementSavings && errors.currentRetirementSavings}
              data-testid="current-retirement-savings-input"
        />
       <FormField
           label="Target Retirement Savings *"
             id="targetRetirementSavings"
            type="number"
             placeholder="e.g., 300000"
            value={values.targetRetirementSavings}
            onChange={handleChange}
             onBlur={handleBlur}
             error={touched.targetRetirementSavings && Boolean(errors.targetRetirementSavings)}
            helperText={touched.targetRetirementSavings && errors.targetRetirementSavings}
             data-testid="target-retirement-savings-input"
         />
       <FormField
             label="Retirement Age *"
             id="retirementAge"
             type="number"
            placeholder="e.g., 65"
             value={values.retirementAge}
             onChange={handleChange}
            onBlur={handleBlur}
            error={touched.retirementAge && Boolean(errors.retirementAge)}
           helperText={touched.retirementAge && errors.retirementAge}
           data-testid="retirement-age-input"
        />
    </div>
  );
};

export default RetirementPlanning;