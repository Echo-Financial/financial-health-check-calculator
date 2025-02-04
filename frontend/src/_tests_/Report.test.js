// src/_tests_/Report.test.js

// IMPORTANT: Place this inline mock at the very top so it takes effect before any react-router-dom imports.
jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  // Define a navigation mock.
  const mockNavigate = jest.fn();
  return {
    __esModule: true,
    ...actualModule,
    useNavigate: () => mockNavigate,
    _navigateMock: mockNavigate, // export for test assertions
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Report from '../pages/Report';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// --- Mocks --- //

// Mock Chart.js to prevent canvas-related errors.
jest.mock('chart.js', () => ({
  Chart: function() {
    return {
      destroy: jest.fn(),
      update: jest.fn(),
    };
  },
}));

// Mock axios to control API responses.
jest.mock('axios');

// Mock the Gauge component to avoid canvas/chart errors.
jest.mock('../components/Visualisations/Gauge.js', () => {
  return () => <div data-testid="mocked-gauge">Mocked Gauge</div>;
});

// Mock the Charts component to avoid chart creation errors.
jest.mock('../components/Visualisations/Charts.js', () => {
  return () => <div data-testid="mocked-charts">Mocked Charts</div>;
});

// Import the navigation mock from our inline mock.
import { _navigateMock } from 'react-router-dom';

// Define a sample scores object to pass in location.state.
const mockScores = {
  debtToIncomeRatio: 60,
  savingsRate: 50,
  emergencyFundScore: 8,
  retirementScore: 15,
  growthOpportunityScore: 30,
  potentialForImprovementScore: 67,
  overallFinancialHealthScore: 33,
};

describe('Report Component', () => {
  afterEach(() => {
    if (_navigateMock && typeof _navigateMock.mockClear === 'function') {
      _navigateMock.mockClear();
    }
  });

  test('renders the report page with scores and displays key headings', async () => {
    // Ensure axios.post resolves with a valid insights response.
    axios.post.mockResolvedValue({ data: { response: 'Mock insights' } });
    
    render(
      <MemoryRouter initialEntries={[{ pathname: '/report', state: { scores: mockScores } }]}>
        <Routes>
          <Route path="/report" element={<Report />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for key headings to appear.
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Financial Health Scores/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Overall Financial Health/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Visual Overview/i })).toBeInTheDocument();
    });

    // Optionally verify that our mocked Gauge and Charts are rendered.
    expect(screen.getByTestId('mocked-gauge')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-charts')).toBeInTheDocument();
  });

  test('displays a loading indicator while fetching insights', async () => {
    // Simulate a delayed API response.
    axios.post.mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({ data: { response: 'Mock insights' } }), 2000)
      )
    );

    render(
      <MemoryRouter initialEntries={[{ pathname: '/report', state: { scores: mockScores } }]}>
        <Routes>
          <Route path="/report" element={<Report />} />
        </Routes>
      </MemoryRouter>
    );

    // Immediately, the loading indicator should be present.
    expect(screen.getByText(/Loading insights/i)).toBeInTheDocument();

    // Wait for "Mock insights" to appear using a flexible matcher.
    const insightsElement = await screen.findByText(/Mock insights/i, {}, { timeout: 3000 });
    expect(insightsElement).toBeInTheDocument();
  });

  test('redirects to home page if no scores provided', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/report', state: null }]}>
        <Routes>
          <Route path="/report" element={<Report />} />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Since Report calls navigate('/') when no scores are provided,
    // we assert that our navigation mock was called with '/'.
    await waitFor(() => {
      expect(_navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
