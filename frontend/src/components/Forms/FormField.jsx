// components/FormField.jsx

import React from 'react';
import { TextField, FormControl, FormLabel } from '@mui/material';

const FormField = ({ label, id, type, ...props }) => {
    return (
        <FormControl margin="normal" fullWidth>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
              id={id}
              type={type}
              variant="outlined"
                {...props}
            />
        </FormControl>
    );
};

export default FormField;