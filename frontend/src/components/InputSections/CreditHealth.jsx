import React from 'react';
import FormField from '../Forms/FormField.jsx';
import { useFormikContext } from 'formik';
import { Typography } from '@mui/material';

const CreditHealth = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  return (
    <div data-testid="step-4-container">
          <Typography variant="h3" data-testid="step-4-heading">Credit Health</Typography>
          <FormField
              label="Credit Score (300-850) *"
              id="creditScore"
              type="number"
              placeholder="e.g. 700"
              value={values.creditScore}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.creditScore && Boolean(errors.creditScore)}
              helperText={touched.creditScore && errors.creditScore}
               data-testid="credit-score-field"
            />
    </div>
  );
};

export default CreditHealth;