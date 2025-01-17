// src/_tests_/LeadCaptureForm.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

describe('LeadCaptureForm Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test('renders without crashing and displays the first step', () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    const formElement = screen.getByTestId('lead-capture-form');
    expect(formElement).toBeInTheDocument();

    const personalDetailsHeading = screen.getByTestId('step-1-heading');
    expect(personalDetailsHeading).toHaveTextContent(/Personal Details/i);
  });

  test('navigates through steps correctly and persists data', async () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Fill Step 1
    await userEvent.type(screen.getByLabelText(/Age \*/i), '30');
    await userEvent.type(screen.getByLabelText(/Annual Income \*/i), '50000');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Fill Step 2
    await waitFor(() => expect(screen.getByTestId('step-2-heading')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/Monthly Expenses \*/i), '2000');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Navigate back to Step 1 and check data persistence
    await userEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(screen.getByLabelText(/Age \*/i)).toHaveValue(30);
    expect(screen.getByLabelText(/Annual Income \*/i)).toHaveValue(50000);
  });

  test('handles submission with valid data', async () => {
    render(
      <BrowserRouter>
        <LeadCaptureForm />
      </BrowserRouter>
    );

    // Fill out all steps
    await userEvent.type(screen.getByLabelText(/Age \*/i), '30');
    await userEvent.type(screen.getByLabelText(/Annual Income \*/i), '50000');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => expect(screen.getByTestId('step-2-heading')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/Monthly Expenses \*/i), '2000');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => expect(screen.getByTestId('step-3-heading')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/Total Assets \*/i), '20000');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => expect(screen.getByTestId('step-4-heading')).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText(/Retirement Age \*/i), '65');
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => expect(screen.getByTestId('step-5-heading')).toBeInTheDocument());
    await userEvent.type(screen.getByTestId('credit-score-field'), '750');
    await userEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Verify API submission
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/submit'), expect.any(Object));
  });
});
