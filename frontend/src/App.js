// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the AuthProvider instead of AuthContext
import { AuthProvider } from './context/AuthContext.js';

import Header from './components/Layout/Header.js';
import Footer from './components/Layout/Footer.js';
import Home from './pages/Home.js';
import Results from './pages/Results.js';
import Report from './pages/Report.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProtectedRoute from './components/ProtectedRoute.js';

import './styles/main.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Debug marker to confirm rendering */}

          <Header />

          <main className="container mt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
