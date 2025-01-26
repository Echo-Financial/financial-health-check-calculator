import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExpensesAssets from '../components/InputSections/ExpensesAssets';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

jest.mock('axios');

// Helper function to wrap the component with Formik
const renderWithFormik = (component, initialValues = {}, validationSchema = {}) => {
  return render(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={jest.fn()}>
      <Form data-testid="expenses-assets-form">{component}</Form>
    </Formik>
  );
};

describe('ExpensesAssets Component', () => {
   beforeEach(() => {
    axios.post.mockClear();
  });
  const initialValues = {
    monthlyExpenses: '',
    totalDebt: '',
    savings: '',
    emergencyFunds: '',
     totalInvestments: '',
  };

  const validationSchema = Yup.object({
    monthlyExpenses: Yup.number().required('Monthly Expenses are required').min(0, 'Must be at least 0'),
    totalDebt: Yup.number().required('Total Debt is required').min(0, 'Must be at least 0'),
    savings: Yup.number().required('Savings is required').min(0, 'Must be at least 0'),
    emergencyFunds: Yup.number().required('Emergency Funds are required').min(0, 'Must be at least 0'),
       totalInvestments: Yup.number().required('Total Investments are required').min(0, 'Must be at least 0'),
  });

  test('renders all fields correctly', () => {
    renderWithFormik(<ExpensesAssets />, initialValues, validationSchema);

    expect(screen.getByLabelText(/Monthly Expenses \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Total Debt \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Savings \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Funds \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Total Investments \*/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    renderWithFormik(<ExpensesAssets />, initialValues, validationSchema);
    fireEvent.submit(screen.getByTestId('expenses-assets-form'));

    expect(await screen.findByText(/Monthly Expenses are required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Total Debt is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Savings is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Emergency Funds are required/i)).toBeInTheDocument();
     expect(await screen.findByText(/Total Investments are required/i)).toBeInTheDocument();
  });

  test('accepts valid inputs', async () => {
    renderWithFormik(<ExpensesAssets />, initialValues, validationSchema);
       fireEvent.change(screen.getByLabelText(/Monthly Expenses \*/i), { target: { value: '2000' } });
       fireEvent.change(screen.getByLabelText(/Total Debt \*/i), { target: { value: '10000' } });
       fireEvent.change(screen.getByLabelText(/Savings \*/i), { target: { value: '5000' } });
      fireEvent.change(screen.getByLabelText(/Emergency Funds \*/i), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText(/Total Investments \*/i), { target: { value: '2000' } });
           fireEvent.submit(screen.getByTestId('expenses-assets-form'));
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Must be at least/i)).not.toBeInTheDocument();
  });

  test('handles edge cases correctly', async () => {
    renderWithFormik(<ExpensesAssets />, initialValues, validationSchema);
     fireEvent.change(screen.getByLabelText(/Monthly Expenses \*/i), { target: { value: '-1' } });
        fireEvent.change(screen.getByLabelText(/Total Debt \*/i), { target: { value: '-10' } });
       fireEvent.change(screen.getByLabelText(/Savings \*/i), { target: { value: '-5' } });
      fireEvent.change(screen.getByLabelText(/Emergency Funds \*/i), { target: { value: '-20' } });
       fireEvent.change(screen.getByLabelText(/Total Investments \*/i), { target: { value: '-10' } });
            fireEvent.submit(screen.getByTestId('expenses-assets-form'));
    expect(await screen.findAllByText(/Must be at least 0/i)).toHaveLength(5);
  });
});