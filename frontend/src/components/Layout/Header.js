// frontend/src/components/Layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="site-header" role="banner">
    <div className="container">
      <div className="header-top">
        <Link to="/" className="site-logo" aria-label="Home - Financial Health Check Calculator">
          <img src="/images/logo.svg" alt="Financial Health Check Calculator Logo" width="150" />
        </Link>
        <nav className="main-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#faq">FAQs</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

export default Header;
