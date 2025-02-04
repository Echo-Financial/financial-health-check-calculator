import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App component with correct elements', () => {
  render(<App />);

  // Check for the header (assumed to have role "banner")
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();

  // Instead of getByRole('contentinfo') which may find multiple elements,
  // we specifically target our main footer using its test id.
  const footerElement = screen.getByTestId('main-footer');
  expect(footerElement).toBeInTheDocument();

  // Check for specific text on the page
  expect(screen.getByText(/Complete Your Financial Health Check/i)).toBeInTheDocument();
});
