// src/_tests_/LeadCaptureForm.test.js

// Increase the global timeout to 20 seconds for these tests.
jest.setTimeout(20000);

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

const renderWithFormik = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LeadCaptureForm Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test('renders without crashing and displays the first step', async () => {
    renderWithFormik(<LeadCaptureForm />);
    const formElement = screen.getByTestId('lead-capture-form');
    expect(formElement).toBeInTheDocument();

    // Advance from step 0 to step 1.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    // Wait for the "age" input from PersonalDetails to appear.
    await waitFor(() =>
      expect(screen.getByTestId('age-input')).toBeInTheDocument()
    );
  });

  test('navigates through steps correctly and persists data', async () => {
    renderWithFormik(<LeadCaptureForm />);

    // Advance to Step 1 (PersonalDetails).
    await waitFor(() =>
      expect(screen.getByTestId('lead-capture-form')).toBeInTheDocument()
    );
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    // Fill required fields for Step 1.
    await waitFor(() =>
      expect(screen.getByTestId('age-input')).toBeInTheDocument()
    );
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    await userEvent.type(screen.getByTestId('income-from-interest-input'), '1000');
    await userEvent.type(screen.getByTestId('income-from-property-input'), '2000');

    // Advance to Step 2 (ExpensesAssets).
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() =>
      expect(screen.getByTestId('monthly-expenses-input')).toBeInTheDocument()
    );
    await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');

    // Navigate back to Step 1 using the Previous button.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
    });
    await waitFor(() =>
      expect(screen.getByTestId('age-input')).toBeInTheDocument()
    );

    // Verify that data persists in Step 1.
    // Note: If the input value is stored as a number, compare as a number.
    expect(screen.getByTestId('age-input')).toHaveValue(30);
    expect(screen.getByTestId('annual-income-input')).toHaveValue(50000);
  });

  test('handles submission with valid data', async () => {
    axios.post.mockResolvedValue({ data: { scores: { financialHealthScore: 75 } } });
    renderWithFormik(<LeadCaptureForm />);

    // Step 1: PersonalDetails.
    await waitFor(() => expect(screen.getByTestId('lead-capture-form')).toBeInTheDocument());
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('age-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    await userEvent.type(screen.getByTestId('income-from-interest-input'), '1000');
    await userEvent.type(screen.getByTestId('income-from-property-input'), '2000');

    // Step 2: ExpensesAssets.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('monthly-expenses-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');
    await userEvent.type(screen.getByTestId('total-debt-input'), '10000');
    await userEvent.type(screen.getByTestId('savings-input'), '5000');
    await userEvent.type(screen.getByTestId('emergency-funds-input'), '10000');
    await userEvent.type(screen.getByTestId('total-investments-input'), '2000');

    // Step 3: RetirementPlanning.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('total-assets-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('total-assets-input'), '20000');
    await userEvent.type(screen.getByTestId('current-retirement-savings-input'), '5000');
    await userEvent.type(screen.getByTestId('target-retirement-savings-input'), '25000');
    await userEvent.type(screen.getByTestId('retirement-age-input'), '60');

    // Advance to Step 4: CreditHealth.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Allow extra time for asynchronous updates.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await waitFor(() => expect(screen.getByTestId('credit-score-field')).toBeInTheDocument(), { timeout: 6000 });
    await userEvent.type(screen.getByTestId('credit-score-field'), '750');

    // Step 5: ContactDetails.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('email-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.type(screen.getByTestId('name-input'), 'test');

    // Submit the form.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Submit/i }));
    });

    // Verify API submission.
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/submit'),
      expect.any(Object)
    );
  });
});
