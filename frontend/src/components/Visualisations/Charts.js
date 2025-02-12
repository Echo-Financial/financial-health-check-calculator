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

  // Function to generate a vertical gradient for the bars.
  // For "Growth Opportunity Score" and "Potential for Improvement Score",
  // invert the gradient so that lower scores are green and higher scores are red.
  const generateVerticalGradient = (context, label) => {
    const { chart } = context;
    const { ctx, chartArea } = chart || {};
    if (!chartArea) {
      return 'rgba(255,0,0,1)';
    }
    const { left, top, bottom } = chartArea;
    const gradient = ctx.createLinearGradient(left, bottom, left, top);

    if (label === 'Growth Opportunity Score' || label === 'Potential for Improvement Score') {
      gradient.addColorStop(0, 'green');
      gradient.addColorStop(0.5, 'yellow');
      gradient.addColorStop(1, 'red');
    } else {
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(0.5, 'yellow');
      gradient.addColorStop(1, 'green');
    }
    return gradient;
  };

  const orderedKeys = [
    'dtiScore',
    'savingsScore',
    'emergencyFundScore',
    'retirementScore',
    'growthOpportunityScore',
    'overallFinancialHealthScore',
    'potentialForImprovementScore',
  ];

  const formatScoreLabel = (label) => {
    const customLabels = {
      dtiScore: 'Debt to Income Score',
      savingsScore: 'Savings Score',
      emergencyFundScore: 'Emergency Fund Score',
      retirementScore: 'Retirement Score',
      growthOpportunityScore: 'Growth Opportunity Score',
      overallFinancialHealthScore: 'Overall Financial Health Score',
      potentialForImprovementScore: 'Potential for Improvement Score',
    };
    return customLabels[label] || label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const chartLabels = scores ? orderedKeys.map((key) => formatScoreLabel(key)) : [];
  const chartValues = scores ? orderedKeys.map((key) => scores[key]) : [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Financial Scores',
        data: chartValues,
        backgroundColor: (context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return generateVerticalGradient(context, label);
        },
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
