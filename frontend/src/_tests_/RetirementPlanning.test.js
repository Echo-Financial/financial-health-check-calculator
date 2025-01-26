import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RetirementPlanning from '../components/InputSections/RetirementPlanning';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { act } from 'react';

jest.mock('axios');

// Helper function to wrap the component with Formik
const renderWithFormik = (component, initialValues = {}, validationSchema = {}) => {
  return render(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={jest.fn()}>
      <Form data-testid="retirement-planning-form">{component}</Form>
    </Formik>
  );
};

describe('RetirementPlanning Component', () => {
   beforeEach(() => {
    axios.post.mockClear();
  });
  const initialValues = {
    retirementAge: '',
    targetRetirementSavings: '',
  };

  const validationSchema = Yup.object({
    retirementAge: Yup.number().required('Retirement Age is required').min(18, 'Must be at least 18'),
     targetRetirementSavings: Yup.number().required('Target Retirement Savings is required').min(0, 'Must be at least 0'),
  });

  test('renders all fields correctly', () => {
    renderWithFormik(<RetirementPlanning />, initialValues, validationSchema);

    expect(screen.getByLabelText(/Retirement Age \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Retirement Savings \*/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    renderWithFormik(<RetirementPlanning />, initialValues, validationSchema);
      await act(() => {
            fireEvent.submit(screen.getByTestId('retirement-planning-form'));
        });

    expect(await screen.findByText(/Retirement Age is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Target Retirement Savings is required/i)).toBeInTheDocument();
  });

  test('accepts valid inputs', async () => {
    renderWithFormik(<RetirementPlanning />, initialValues, validationSchema);
      await act(() => {
           fireEvent.change(screen.getByLabelText(/Retirement Age \*/i), { target: { value: '65' } });
           fireEvent.change(screen.getByLabelText(/Target Retirement Savings \*/i), { target: { value: '50000' } });
             fireEvent.submit(screen.getByTestId('retirement-planning-form'));
        });
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Must be at least/i)).not.toBeInTheDocument();
  });

  test('handles edge cases correctly', async () => {
    renderWithFormik(<RetirementPlanning />, initialValues, validationSchema);
     await act(() => {
        fireEvent.change(screen.getByLabelText(/Retirement Age \*/i), { target: { value: '17' } });
        fireEvent.change(screen.getByLabelText(/Target Retirement Savings \*/i), { target: { value: '-1000' } });
         fireEvent.submit(screen.getByTestId('retirement-planning-form'));
      });
    expect(await screen.findByText(/Must be at least 18/i)).toBeInTheDocument();
    expect(await screen.findByText(/Must be at least 0/i)).toBeInTheDocument();
  });
});