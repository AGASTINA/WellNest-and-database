import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser, getToken } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = getToken();
  const user = getStoredUser();

  useEffect(() => {
    const validateSession = async () => {
      if (!token || !user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          clearAuthSession();
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch {
        // Keep user in-app during transient network/backend startup issues.
        // Page-level API calls can still show specific errors.
        setIsAuthorized(true);
      } finally {
        setIsChecking(false);
      }
    };

    validateSession();
  }, [token, user]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-sm">Validating session...</div>
      </div>
    );
  }

  if (!token || !user || !isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
