// src/_tests_/App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App component with LeadCaptureForm', () => {
  render(<App />);
  expect(screen.getByText(/Complete Your Financial Health Check/i)).toBeInTheDocument();
});

