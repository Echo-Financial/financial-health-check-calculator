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
import './Charts.css';
import { useTheme } from '@mui/material';
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
    const theme = useTheme();

  // Prepare data labels & values
  const chartLabels = scores ? Object.keys(scores).map(formatScoreLabel) : [];
  const chartValues = scores ? Object.values(scores) : [];

   // Function to generate a dynamic color based on the score
    const generateColors = (score) => {
      return {
          backgroundColor: theme.palette.colorFromScore(score),
          borderColor: theme.palette.borderColorFromScore(score)
      };
    };

    // Prepare background and border colors based on scores
    const chartColorData = scores
        ? Object.values(scores).map((score) => generateColors(score))
        : [];


  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Financial Scores',
        data: chartValues,
        backgroundColor: chartColorData.map((color) => color.backgroundColor),
        borderColor: chartColorData.map((color) => color.borderColor),
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

  return (
    <div className="chart-container" >
        <Bar data={chartData} options={chartOptions} />
    </div>
      );
};

export default Charts;