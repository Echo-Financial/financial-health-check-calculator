// frontend/src/_tests_/Report.test.js

// IMPORTANT: Place this inline mock at the very top so it takes effect before any react-router-dom imports.
jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  const mockNavigate = jest.fn();
  return {
    __esModule: true,
    ...actualModule,
    useNavigate: () => mockNavigate,
    _navigateMock: mockNavigate,
  };
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Report from '../pages/Report';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Mock axios to control API responses.
jest.mock('axios');

// Mock components that render charts/canvas.
jest.mock('../components/Visualisations/Gauge.js', () => {
  return () => <div data-testid="mocked-gauge">Mocked Gauge</div>;
});
jest.mock('../components/Visualisations/Charts.js', () => {
  return () => <div data-testid="mocked-charts">Mocked Charts</div>;
});

import { _navigateMock } from 'react-router-dom';

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

  test('renders report with scores and detailed analysis', async () => {
    axios.post.mockResolvedValue({ data: { response: 'Enhanced detailed analysis text' } });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/report', state: { scores: mockScores, analysis: 'Enhanced detailed analysis text' } }]}>
        <Routes>
          <Route path="/report" element={<Report />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Financial Health Scores/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Overall Financial Health/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/Enhanced detailed analysis text/i)).toBeInTheDocument();
    expect(screen.getByTestId('mocked-gauge')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-charts')).toBeInTheDocument();
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

    await waitFor(() => {
      expect(_navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
