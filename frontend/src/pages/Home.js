import React from 'react';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import Gauge from '../components/Visualisations/Gauge'; // Import the Gauge component

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Financial Health Check Calculator!</h2>
      <LeadCaptureForm />
      
      {/* Test Gauge Component */}
      <div style={{ marginTop: '20px' }}>
        <h3>Test Gauge</h3>
        <Gauge value={75} label="Score" />
      </div>
    </div>
  );
};

export default Home;
