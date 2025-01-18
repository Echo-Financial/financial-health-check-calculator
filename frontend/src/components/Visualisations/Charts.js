// frontend/src/components/Visualisations/Charts.js

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

// Register Chart.js plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Helper function to format score labels
 * (Ensure it's declared BEFORE you use it in chartData)
 */
function formatScoreLabel(label) {
  return label
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

const Charts = ({ scores }) => {
  // Prepare data labels & values
  const chartLabels = scores ? Object.keys(scores).map(formatScoreLabel) : [];
  const chartValues = scores ? Object.values(scores) : [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Financial Scores',
        data: chartValues,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Your Financial Health Scores' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Assuming scores range from 0 to 100
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default Charts;
