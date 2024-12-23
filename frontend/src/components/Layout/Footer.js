// frontend/src/components/Layout/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer" role="contentinfo">
    <div className="container">
      <nav aria-label="Footer navigation">
        <ul>
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          </ul>
      </nav>
      <p>&copy; {new Date().getFullYear()} Financial Health Check Calculator. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
