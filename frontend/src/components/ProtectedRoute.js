import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Minimal route guard for admin routes.
 * - If there's no JWT in localStorage, send user to /admin/login.
 * - Preserves the 'from' location so login can return the user to where they were.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}
