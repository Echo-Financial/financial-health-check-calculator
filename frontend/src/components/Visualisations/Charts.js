import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@mui/material';
import './Charts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = ({ scores }) => {
  const theme = useTheme();

  // Single function to create red -> yellow -> green gradient
  const generateVerticalGradient = (context) => {
    const { chart } = context;
    const { ctx, chartArea } = chart || {};
    if (!chartArea) {
      // chartArea might be undefined during initial render
      return 'rgba(255,0,0,1)'; // fallback solid color
    }

    const { left, right, top, bottom } = chartArea;

    // Create a vertical gradient (bottom -> top)
    const gradient = ctx.createLinearGradient(left, bottom, left, top);

    // Example stops: 0% (red), 50% (yellow), 100% (green)
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');

    return gradient;
  };

  // Prepare chart labels & data
  const chartLabels = scores ? Object.keys(scores) : [];
  const chartValues = scores ? Object.values(scores) : [];

  // Prepare dataset configuration
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Financial Scores',
        data: chartValues,
        // Use a "scriptable" function that gets the correct 2D context
        backgroundColor: (context) => generateVerticalGradient(context),
        // Optional: dynamic border color from the MUI theme
        borderColor: (context) => {
          const score = chartValues[context.dataIndex];
          return theme.palette.borderColorFromScore(score);
        },
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // optional, if you want to control height
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Your Financial Health Scores' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 400 }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Charts;
