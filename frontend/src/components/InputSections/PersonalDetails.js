import React from 'react';
import { useFormikContext } from 'formik';
import FormField from '../Forms/FormField.jsx';
import { Typography } from '@mui/material';

const PersonalDetails = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  return (
    <div data-testid="step-1-container">
      <Typography variant="h3" data-testid="step-1-heading">Personal Details</Typography>
       <FormField
            label="Age *"
             id="age"
            type="number"
          placeholder="e.g., 30"
           value={values.age}
           onChange={handleChange}
            onBlur={handleBlur}
            error={touched.age && Boolean(errors.age)}
            helperText={touched.age && errors.age}
             data-testid="age-input"
      />
       <FormField
            label="Annual Income *"
           id="annualIncome"
           type="number"
           placeholder="e.g., 50000"
          value={values.annualIncome}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.annualIncome && Boolean(errors.annualIncome)}
           helperText={touched.annualIncome && errors.annualIncome}
           data-testid="annual-income-input"
        />
         <FormField
             label="Income from Interest *"
              id="incomeFromInterest"
            type="number"
          placeholder="e.g., 1000"
            value={values.incomeFromInterest}
            onChange={handleChange}
             onBlur={handleBlur}
             error={touched.incomeFromInterest && Boolean(errors.incomeFromInterest)}
            helperText={touched.incomeFromInterest && errors.incomeFromInterest}
            data-testid="income-from-interest-input"
        />
        <FormField
             label="Income from Property *"
             id="incomeFromProperty"
           type="number"
           placeholder="e.g., 5000"
           value={values.incomeFromProperty}
            onChange={handleChange}
           onBlur={handleBlur}
           error={touched.incomeFromProperty && Boolean(errors.incomeFromProperty)}
           helperText={touched.incomeFromProperty && errors.incomeFromProperty}
          data-testid="income-from-property-input"
       />
    </div>
  );
};

export default PersonalDetails;