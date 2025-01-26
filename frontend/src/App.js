import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme.js';
// Import the AuthProvider instead of AuthContext
import { AuthProvider } from './context/AuthContext.js';

import Header from './components/Layout/Header.js';
import Footer from './components/Layout/Footer.js';
import Home from './pages/Home.js';
import Report from './pages/Report.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
// import ProtectedRoute from './components/ProtectedRoute.js'; // Removed from the import

import './styles/main.scss';

function App() {
  return (
      <ThemeProvider theme={theme}>
      <AuthProvider>
          <Router>
              <div className="App">
                  <Header />
                  <main className="container mt-5">
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />

                          {/*
                Removed the old "/results" route entirely to avoid references
                to the deleted Results.js file.
              */}

                          {/*
                The user is navigated to "/report" from LeadCaptureForm.jsx
                after submission. This route displays the merged Report component.
              */}
                          <Route path="/report" element={<Report />} />
                      </Routes>
                  </main>
                  <Footer />
              </div>
          </Router>
      </AuthProvider>
      </ThemeProvider>
  );
}

export default App;