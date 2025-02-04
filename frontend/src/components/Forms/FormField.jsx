// components/FormField.jsx

import React from 'react';
import { TextField, FormControl, FormLabel } from '@mui/material';

const FormField = ({ label, id, type, ...props }) => {
  // Extract data-testid (if provided) from the props
  const { 'data-testid': dataTestId, ...rest } = props;

  return (
    <FormControl margin="normal" fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <TextField
        id={id}
        type={type}
        variant="outlined"
        // Pass data-testid to the underlying input element
        inputProps={{ 'data-testid': dataTestId }}
        {...rest}
      />
    </FormControl>
  );
};

export default FormField;
