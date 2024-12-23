// frontend/src/context/AuthContext.js

import React, { createContext, useState } from 'react';

// Create the context object
export const AuthContext = createContext(null);

// Define and export AuthProvider
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(null);

  // Example: placeholder login function
  const handleLogin = (userData) => {
    setAuthState(userData);
    // If using localStorage, ensure data is stored as JSON:
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Example: placeholder logout function
  const handleLogout = () => {
    setAuthState(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
