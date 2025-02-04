//frontend/src/_tests_/Charts.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Charts from '../components/Visualisations/Charts';
import { Chart } from 'react-chartjs-2';

jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mocked-bar-chart"></div>,
  }));

describe('Charts Component', () => {
  test('renders the bar chart with correct data', () => {
    const mockScores = {
      dtiScore: 60,
      savingsScore: 50,
      emergencyFundScore: 8,
      retirementScore: 15,
      growthOpportunityScore: 30,
      overallFinancialHealthScore: 33,
        potentialForImprovementScore: 67,
    };

    render(<Charts scores={mockScores} />);
    const chartElement = screen.getByTestId('mocked-bar-chart');
    expect(chartElement).toBeInTheDocument();

  });

   test('renders the component even if no scores are passed', () => {
    render(<Charts />);
      const chartElement = screen.getByTestId('mocked-bar-chart');
    expect(chartElement).toBeInTheDocument();
  });
});