
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-primary text-white p-3">
    <div className="container">
      <h1>Financial Health Check Calculator</h1>
      <nav>
        <Link to="/" className="text-white me-3">Home</Link>
        <Link to="/results" className="text-white me-3">Results</Link>
        <Link to="/report" className="text-white">Report</Link>
      </nav>
    </div>
  </header>
);

export default Header;
