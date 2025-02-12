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
        inputProps={{ 'data-testid': dataTestId, autoComplete: 'off' }}
        {...rest}
      />
    </FormControl>
  );
};

export default FormField;
