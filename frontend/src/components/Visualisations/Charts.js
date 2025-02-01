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

  // Function to generate a vertical gradient for the bars
  const generateVerticalGradient = (context) => {
    const { chart } = context;
    const { ctx, chartArea } = chart || {};
    if (!chartArea) {
      // Fallback in case chartArea is undefined during initial render
      return 'rgba(255,0,0,1)';
    }
    const { left, top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(left, bottom, left, top);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');
    return gradient;
  };

  // Define the fixed order for the internal score keys
  const orderedKeys = [
    'dtiScore',
    'savingsScore',
    'emergencyFundScore',
    'retirementScore',
    'growthOpportunityScore',
    'overallFinancialHealthScore',
    'potentialForImprovementScore',
  ];

  // Mapping of internal keys to user-friendly labels
  const labelMapping = {
    dtiScore: "Debt to Income Score",
    savingsScore: "Savings Score",
    emergencyFundScore: "Emergency Fund Score",
    retirementScore: "Retirement Score",
    growthOpportunityScore: "Growth Opportunity Score",
    overallFinancialHealthScore: "Overall Financial Health Score",
    potentialForImprovementScore: "Potential for Improvement Score",
  };

  // Generate chart labels and values using the mapping
  const chartLabels = scores
    ? orderedKeys.map((key) => labelMapping[key] || key)
    : [];
  const chartValues = scores
    ? orderedKeys.map((key) => scores[key])
    : [];

  // Configure the chart data and options
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Financial Scores',
        data: chartValues,
        backgroundColor: (context) => generateVerticalGradient(context),
        borderColor: (context) => {
          const score = chartValues[context.dataIndex];
          return theme.palette.borderColorFromScore(score);
        },
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
