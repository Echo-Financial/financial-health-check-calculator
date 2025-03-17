import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme.js';
import { AuthProvider } from './context/AuthContext.js';
import AdminLogin from './pages/AdminLogin.js';
import AdminDashboard from './pages/AdminDashboard.js';

import Header from './components/Layout/Header.js';
import Footer from './components/Layout/Footer.js';
import Home from './pages/Home.js';
import Report from './pages/Report.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

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
                <Route path="/report" element={<Report />} />
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
