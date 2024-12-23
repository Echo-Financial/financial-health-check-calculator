// src/_tests_/LeadCaptureForm.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'; // Import userEvent

// Mock axios
import axios from 'axios';
jest.mock('axios');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LeadCaptureForm Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    mockNavigate.mockClear();
  });

  test('renders without crashing and displays the first step', () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Check for the form element using data-testid
    const formElement = screen.getByTestId('lead-capture-form');
    expect(formElement).toBeInTheDocument();

    // Check for the first step's heading using data-testid
    const personalDetailsHeading = screen.getByTestId('step-1-heading');
    expect(personalDetailsHeading).toBeInTheDocument();
    expect(personalDetailsHeading).toHaveTextContent(/Personal Details/i);
  });

  test('navigates through multi-step form correctly', async () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Step 1: Personal Details
    const ageInput = screen.getByLabelText(/Age \*/i);
    await userEvent.type(ageInput, '30');

    const annualIncomeInput = screen.getByLabelText(/Annual Income \*/i);
    await userEvent.type(annualIncomeInput, '50000');

    const incomeFromInterestInput = screen.getByLabelText(/Income from Interest \*/i);
    await userEvent.type(incomeFromInterestInput, '2000');

    const incomeFromPropertyInput = screen.getByLabelText(/Income from Property \*/i);
    await userEvent.type(incomeFromPropertyInput, '1500');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButton);

    // Wait for Step 2's heading using data-testid
    await waitFor(() => {
      const step2Heading = screen.getByTestId('step-2-heading');
      expect(step2Heading).toHaveTextContent(/Expenses & Debt/i);
    });

    // Step 2: Expenses & Debt
    // Attempt to go to Step 3 without filling required fields
    const nextButtonStep2 = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButtonStep2);

    // Expect validation errors for Step 2
    await waitFor(() => {
      expect(screen.getByText(/Monthly Expenses are required/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Debt is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Savings is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Emergency Funds are required/i)).toBeInTheDocument();
    });

    // Fill out Step 2 fields
    const monthlyExpensesInput = screen.getByLabelText(/Monthly Expenses \*/i);
    await userEvent.type(monthlyExpensesInput, '2000');

    const totalDebtInput = screen.getByLabelText(/Total Debt \*/i);
    await userEvent.type(totalDebtInput, '10000');

    const savingsInput = screen.getByLabelText(/Savings \*/i);
    await userEvent.type(savingsInput, '5000');

    const emergencyFundsInput = screen.getByLabelText(/Emergency Funds \*/i);
    await userEvent.type(emergencyFundsInput, '10000');

    // Click 'Next' to go to Step 3
    await userEvent.click(nextButtonStep2);

    // Wait for Step 3's heading using data-testid
    await waitFor(() => {
      const step3Heading = screen.getByTestId('step-3-heading');
      expect(step3Heading).toHaveTextContent(/Assets & Savings/i);
    });

    // Step 3: Assets & Savings
    // Attempt to go to Step 4 without filling required fields
    const nextButtonStep3 = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButtonStep3);

    // Expect validation errors for Step 3
    await waitFor(() => {
      expect(screen.getByText(/Total Assets are required/i)).toBeInTheDocument(); // Corrected 'is' to 'are'
      expect(screen.getByText(/Current Retirement Savings is required/i)).toBeInTheDocument();
    });

    // Fill out Step 3 fields
    const totalAssetsInput = screen.getByLabelText(/Total Assets \*/i);
    await userEvent.type(totalAssetsInput, '20000');

    const currentRetirementSavingsInput = screen.getByLabelText(/Current Retirement Savings \*/i);
    await userEvent.type(currentRetirementSavingsInput, '15000');

    // Click 'Next' to go to Step 4
    await userEvent.click(nextButtonStep3);

    // Wait for Step 4's heading using data-testid
    await waitFor(() => {
      const step4Heading = screen.getByTestId('step-4-heading');
      expect(step4Heading).toHaveTextContent(/Retirement Goals/i);
    });

    // Step 4: Retirement Goals
    // Attempt to go to Step 5 without filling required fields
    const nextButtonStep4 = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButtonStep4);

    // Expect validation errors for Step 4
    await waitFor(() => {
      expect(screen.getByText(/Target Retirement Savings is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Retirement Age is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Expected Annual Income in Retirement is required/i)).toBeInTheDocument();
    });

    // Fill out Step 4 fields
    const targetRetirementSavingsInput = screen.getByLabelText(/Target Retirement Savings \*/i);
    await userEvent.type(targetRetirementSavingsInput, '30000');

    const retirementAgeInput = screen.getByLabelText(/Retirement Age \*/i);
    await userEvent.type(retirementAgeInput, '65');

    const expectedAnnualIncomeInRetirementInput = screen.getByLabelText(/Expected Annual Income in Retirement \*/i);
    await userEvent.type(expectedAnnualIncomeInRetirementInput, '40000');

    // Click 'Next' to go to Step 5
    await userEvent.click(nextButtonStep4);

    // Wait for Step 5's heading using data-testid
    await waitFor(() => {
      const step5Heading = screen.getByTestId('step-5-heading');
      expect(step5Heading).toHaveTextContent(/Credit Health/i);
    });

    // Fill out Step 5 field
    const creditScoreInput = screen.getByTestId('credit-score-field');
    await userEvent.type(creditScoreInput, '750');

    // Mock successful API response before submitting
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Form submitted successfully',
      },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    // Wait for the success modal to appear
    await waitFor(() => {
      expect(screen.getByText(/Get Your Results/i)).toBeInTheDocument();
    });

    // Ensure the API was called with correct data
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/submit'),
      {
        age: 30,
        annualIncome: 50000,
        creditScore: 750,
        currentRetirementSavings: 15000,
        emergencyFunds: 10000,
        expectedAnnualIncomeInRetirement: 40000,
        incomeFromInterest: 2000,
        incomeFromProperty: 1500,
        monthlyExpenses: 2000,
        retirementAge: 65,
        savings: 5000,
        targetRetirementSavings: 30000,
        totalAssets: 20000,
        totalDebt: 10000,
      }
    );
  });

  test('displays validation errors for invalid inputs', async () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Attempt to proceed to Step 2 without filling required fields
    const nextButton = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButton);

    // Expect validation errors for Step 1
    await waitFor(() => {
      expect(screen.getByText(/Age is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Income is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Income from Interest is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Income from Property is required/i)).toBeInTheDocument();
    });

    // Fill invalid age (below minimum)
    const ageInput = screen.getByLabelText(/Age \*/i);
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '16');

    // Fill invalid annual income (negative value)
    const annualIncomeInput = screen.getByLabelText(/Annual Income \*/i);
    await userEvent.clear(annualIncomeInput);
    await userEvent.type(annualIncomeInput, '-5000');

    // Fill invalid income from interest (negative value)
    const incomeFromInterestInput = screen.getByLabelText(/Income from Interest \*/i);
    await userEvent.clear(incomeFromInterestInput);
    await userEvent.type(incomeFromInterestInput, '-200');

    // Fill invalid income from property (negative value)
    const incomeFromPropertyInput = screen.getByLabelText(/Income from Property \*/i);
    await userEvent.clear(incomeFromPropertyInput);
    await userEvent.type(incomeFromPropertyInput, '-150');

    // Attempt to proceed to Step 2 again
    await userEvent.click(nextButton);

    // Expect specific validation error messages
    await waitFor(() => {
      // 'age' field has 'Must be at least 18'
      expect(screen.getByText(/Must be at least 18/i)).toBeInTheDocument();

      // 'annualIncome', 'incomeFromInterest', 'incomeFromProperty' have 'Must be at least 0'
      const minZeroErrors = screen.getAllByText(/Must be at least 0/i);
      expect(minZeroErrors.length).toBe(3); // annualIncome, incomeFromInterest, incomeFromProperty
    });
  });

  test('prevents form submission with incomplete steps', async () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Fill out only the first step
    const ageInput = screen.getByLabelText(/Age \*/i);
    await userEvent.type(ageInput, '28');

    const annualIncomeInput = screen.getByLabelText(/Annual Income \*/i);
    await userEvent.type(annualIncomeInput, '45000');

    const incomeFromInterestInput = screen.getByLabelText(/Income from Interest \*/i);
    await userEvent.type(incomeFromInterestInput, '2000');

    const incomeFromPropertyInput = screen.getByLabelText(/Income from Property \*/i);
    await userEvent.type(incomeFromPropertyInput, '1500');

    const nextButton = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextButton);

    // Fill out the second step
    await waitFor(() => {
      const step2Heading = screen.getByTestId('step-2-heading');
      expect(step2Heading).toHaveTextContent(/Expenses & Debt/i);
    });

    const monthlyExpensesInput = screen.getByLabelText(/Monthly Expenses \*/i);
    await userEvent.type(monthlyExpensesInput, '1500');

    const totalDebtInput = screen.getByLabelText(/Total Debt \*/i);
    await userEvent.type(totalDebtInput, '8000');

    const savingsInput = screen.getByLabelText(/Savings \*/i);
    await userEvent.type(savingsInput, '3000');

    const emergencyFundsInput = screen.getByLabelText(/Emergency Funds \*/i);
    await userEvent.type(emergencyFundsInput, '4000');

    await userEvent.click(nextButton);

    // Fill out the third step
    await waitFor(() => {
      const step3Heading = screen.getByTestId('step-3-heading');
      expect(step3Heading).toHaveTextContent(/Assets & Savings/i);
    });

    const totalAssetsInput = screen.getByLabelText(/Total Assets \*/i);
    await userEvent.type(totalAssetsInput, '20000');

    const currentRetirementSavingsInput = screen.getByLabelText(/Current Retirement Savings \*/i);
    await userEvent.type(currentRetirementSavingsInput, '12000');

    await userEvent.click(nextButton);

    // Fill out the fourth step
    await waitFor(() => {
      const step4Heading = screen.getByTestId('step-4-heading');
      expect(step4Heading).toHaveTextContent(/Retirement Goals/i);
    });

    const targetRetirementSavingsInput = screen.getByLabelText(/Target Retirement Savings \*/i);
    await userEvent.type(targetRetirementSavingsInput, '25000');

    const retirementAgeInput = screen.getByLabelText(/Retirement Age \*/i);
    await userEvent.type(retirementAgeInput, '60');

    const expectedAnnualIncomeInRetirementInput = screen.getByLabelText(/Expected Annual Income in Retirement \*/i);
    await userEvent.type(expectedAnnualIncomeInRetirementInput, '35000');

    await userEvent.click(nextButton);

    // Fill out the fifth step partially
    await waitFor(() => {
      const step5Heading = screen.getByTestId('step-5-heading');
      expect(step5Heading).toHaveTextContent(/Credit Health/i);
    });

    // Leave credit score empty and attempt to submit
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    // Expect validation error for credit score
    await waitFor(() => {
      expect(screen.getByText(/Credit Score is required/i)).toBeInTheDocument();
    });

    // Ensure the form was not submitted
    expect(axios.post).not.toHaveBeenCalled();
  });
});
