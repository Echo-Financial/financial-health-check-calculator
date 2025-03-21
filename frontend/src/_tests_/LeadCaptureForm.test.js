// frontend/src/_tests_/LeadCaptureForm.test.js

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

const renderWithRouter = (component) => {
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
    renderWithRouter(<LeadCaptureForm />);
    const formElement = screen.getByTestId('lead-capture-form');
    expect(formElement).toBeInTheDocument();

    // Since Step 1 is rendered by default, the "age" input should be immediately available.
    await waitFor(() =>
      expect(screen.getByTestId('age-input')).toBeInTheDocument()
    );
  });

  test('navigates through steps correctly and persists data', async () => {
    renderWithRouter(<LeadCaptureForm />);

    // Step 1 (PersonalDetails) should be visible immediately.
    await waitFor(() => expect(screen.getByTestId('age-input')).toBeInTheDocument());
    
    // Fill in PersonalDetails.
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    await userEvent.type(screen.getByTestId('income-from-interest-input'), '1000');
    await userEvent.type(screen.getByTestId('income-from-property-input'), '2000');
    
    // Move to Step 2 (ExpensesAssets).
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() =>
      expect(screen.getByTestId('monthly-expenses-input')).toBeInTheDocument()
    );
    
    // Navigate back to Step 1 using the Previous button.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
    });
    await waitFor(() =>
      expect(screen.getByTestId('age-input')).toBeInTheDocument()
    );
    
    // Verify that data persists in Step 1.
    expect(screen.getByTestId('age-input')).toHaveValue(30);
    expect(screen.getByTestId('annual-income-input')).toHaveValue(50000);
  });

  test('handles submission with valid data', async () => {
    // Expect three API calls:
    // 1. /api/submit, 2. /api/financial-analysis, 3. /api/send-marketing-email (since marketing consent is checked)
    axios.post
      .mockResolvedValueOnce({ data: { scores: { financialHealthScore: 75, retirementScore: 80 } } }) // /api/submit
      .mockResolvedValueOnce({ data: { analysis: 'Test analysis response' } }) // /api/financial-analysis
      .mockResolvedValueOnce({ data: { result: 'Email sent' } }); // /api/send-marketing-email
    
    renderWithRouter(<LeadCaptureForm />);

    // Step 1: PersonalDetails (rendered by default).
    await waitFor(() => expect(screen.getByTestId('lead-capture-form')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('age-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    await userEvent.type(screen.getByTestId('income-from-interest-input'), '1000');
    await userEvent.type(screen.getByTestId('income-from-property-input'), '2000');

    // Move to Step 2: ExpensesAssets.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('monthly-expenses-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');
    await userEvent.type(screen.getByTestId('total-debt-input'), '10000');
    await userEvent.type(screen.getByTestId('savings-input'), '5000');
    await userEvent.type(screen.getByTestId('emergency-funds-input'), '10000');
    await userEvent.type(screen.getByTestId('total-investments-input'), '2000');

    // Move to Step 3: RetirementPlanning.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('total-assets-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('total-assets-input'), '20000');
    await userEvent.type(screen.getByTestId('current-retirement-savings-input'), '5000');
    await userEvent.type(screen.getByTestId('target-retirement-savings-input'), '25000');
    await userEvent.type(screen.getByTestId('retirement-age-input'), '60');

    // Move to Step 4: CreditHealth.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Allow extra time for asynchronous updates.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await waitFor(() => expect(screen.getByTestId('credit-score-field')).toBeInTheDocument(), { timeout: 6000 });
    await userEvent.type(screen.getByTestId('credit-score-field'), '750');

    // Move to Step 5: ContactDetails.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('email-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.type(screen.getByTestId('name-input'), 'test');
    
    // Check the marketing consent checkbox.
    await act(async () => {
      await userEvent.click(screen.getByRole('checkbox', { name: /I agree to receive marketing materials/i }));
    });

    // Submit the form.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Submit/i }));
    });

    // Verify that three API calls were made.
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(3));
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/submit'),
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/financial-analysis'),
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/send-marketing-email'),
      expect.any(Object)
    );
  });
  
  test('persists data across all steps including enhancements', async () => {
    renderWithRouter(<LeadCaptureForm />);
    
    // Step 1 should be visible initially.
    await waitFor(() => expect(screen.getByTestId('lead-capture-form')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('age-input')).toBeInTheDocument());
    
    // Fill in PersonalDetails.
    await userEvent.type(screen.getByTestId('age-input'), '30');
    await userEvent.type(screen.getByTestId('annual-income-input'), '50000');
    
    // Move to Step 2.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    await waitFor(() => expect(screen.getByTestId('monthly-expenses-input')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('monthly-expenses-input'), '2000');
    
    // Go back to Step 1.
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
    });
    expect(screen.getByTestId('age-input')).toHaveValue(30);
    expect(screen.getByTestId('annual-income-input')).toHaveValue(50000);
  });
});
