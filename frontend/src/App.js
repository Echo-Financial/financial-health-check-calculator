// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import Report from './pages/Report';
import './styles/main.scss'; // Ensure your styles are imported

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
