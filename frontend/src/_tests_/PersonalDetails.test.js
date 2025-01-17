// src/_tests_/PersonalDetails.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PersonalDetails from '../components/InputSections/PersonalDetails';
import { Formik } from 'formik';
import * as Yup from 'yup';

const renderWithFormik = (component, initialValues = {}, validationSchema = {}) => {
  return render(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={jest.fn()}>
      {component}
    </Formik>
  );
};

describe('PersonalDetails Component', () => {
  const initialValues = {
    age: '',
    annualIncome: '',
    incomeFromInterest: '',
    incomeFromProperty: '',
  };

  const validationSchema = Yup.object({
    age: Yup.number().required('Age is required').min(18, 'Must be at least 18'),
    annualIncome: Yup.number().required('Annual Income is required').min(0, 'Must be at least 0'),
    incomeFromInterest: Yup.number().min(0, 'Must be at least 0'),
    incomeFromProperty: Yup.number().min(0, 'Must be at least 0'),
  });

  test('renders all fields correctly', () => {
    renderWithFormik(<PersonalDetails />, initialValues, validationSchema);

    // Check for all input fields
    expect(screen.getByLabelText(/Age \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Income \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Income from Interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Income from Property/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    renderWithFormik(<PersonalDetails />, initialValues, validationSchema);

    // Trigger validation by attempting to submit the form
    fireEvent.submit(screen.getByRole('form'));

    // Check for validation messages
    expect(await screen.findByText(/Age is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Annual Income is required/i)).toBeInTheDocument();
  });

  test('shows specific validation errors for invalid inputs', async () => {
    renderWithFormik(<PersonalDetails />, initialValues, validationSchema);

    // Fill invalid inputs
    fireEvent.change(screen.getByLabelText(/Age \*/i), { target: { value: '16' } }); // Invalid: too young
    fireEvent.change(screen.getByLabelText(/Annual Income \*/i), { target: { value: '-5000' } }); // Invalid: negative
    fireEvent.change(screen.getByLabelText(/Income from Interest/i), { target: { value: '-200' } }); // Invalid: negative
    fireEvent.change(screen.getByLabelText(/Income from Property/i), { target: { value: '-150' } }); // Invalid: negative

    // Trigger validation
    fireEvent.submit(screen.getByRole('form'));

    // Check for specific error messages
    expect(await screen.findByText(/Must be at least 18/i)).toBeInTheDocument();
    expect(await screen.findAllByText(/Must be at least 0/i)).toHaveLength(3); // For annualIncome, incomeFromInterest, incomeFromProperty
  });

  test('accepts valid inputs', async () => {
    renderWithFormik(<PersonalDetails />, initialValues, validationSchema);

    // Fill valid inputs
    fireEvent.change(screen.getByLabelText(/Age \*/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Annual Income \*/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/Income from Interest/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Income from Property/i), { target: { value: '1500' } });

    // Trigger validation
    fireEvent.submit(screen.getByRole('form'));

    // Check that no error messages appear
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Must be at least/i)).not.toBeInTheDocument();
  });
});
