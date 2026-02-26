import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredUser, getToken } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
