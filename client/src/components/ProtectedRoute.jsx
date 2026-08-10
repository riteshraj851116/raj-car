import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children, requireOwnerRole = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOwnerRole && user.role !== 'owner') {
    toast.error('Owner access required for this section');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
