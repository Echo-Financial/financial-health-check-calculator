// ContactDetails.jsx
import React, { useState } from 'react';
import FormField from '../Forms/FormField.jsx';
import { useFormikContext } from 'formik';
import { Typography } from '@mui/material';

const ContactDetails = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext();

  // Local state to track if the user has left (blurred) the field
  const [emailInteracted, setEmailInteracted] = useState(false);
  const [nameInteracted, setNameInteracted] = useState(false);

  return (
    <div data-testid="step-5-container">
      <Typography variant="h3" data-testid="step-5-heading">Contact Details</Typography>
      <FormField
        label="Email *"
        id="email"
        type="email"
        placeholder="e.g., test@example.com"
        value={values.email}
        onChange={handleChange}
        onBlur={(e) => {
          handleBlur(e);
          setEmailInteracted(true);
        }}
        error={emailInteracted && touched.email && Boolean(errors.email)}
        helperText={emailInteracted && touched.email && errors.email}
        data-testid="email-input"
      />
      <FormField
        label="Name *"
        id="name"
        type="text"
        placeholder="e.g., John Doe"
        value={values.name}
        onChange={handleChange}
        onBlur={(e) => {
          handleBlur(e);
          setNameInteracted(true);
        }}
        error={nameInteracted && touched.name && Boolean(errors.name)}
        helperText={nameInteracted && touched.name && errors.name}
        data-testid="name-input"
      />
      <FormField
        label="Phone"
        id="phone"
        type="text"
        placeholder="e.g., 123-456-7890"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone && Boolean(errors.phone)}
        helperText={touched.phone && errors.phone}
        data-testid="phone-input"
      />
    </div>
  );
};

export default ContactDetails;
