// frontend/src/__tests__/PersonalDetails.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import PersonalDetails from '../components/InputSections/PersonalDetails';

test('renders PersonalDetails and checks form fields', () => {
  render(
    <Formik
      initialValues={{
        age: '',
        annualIncome: '',
        incomeFromInterest: '',
        incomeFromProperty: '',
      }}
      onSubmit={() => {}}
    >
      <PersonalDetails />
    </Formik>
  );

  // Check if the form fields are rendered with correct labels
  expect(screen.getByLabelText(/Age \*/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Annual Income \*/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Income from Interest \*/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Income from Property \*/i)).toBeInTheDocument();
});