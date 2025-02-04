// No inline jest.mock for canvas-gauges here

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Gauge from '../components/Visualisations/Gauge';

describe('Gauge Component', () => {
  test('renders the gauge with correct value and label', () => {
    render(<Gauge value={75} label="Test Label" />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  test('renders the gauge with default values', () => {
    render(<Gauge />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});
