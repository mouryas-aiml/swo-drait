import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Show loading spinner while auth resolves
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-kalarava-500/20 border-t-kalarava-500 animate-spin" />
    </div>
  </div>
);

// ProtectedRoute: requires authentication + optional role check
export const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

// PublicRoute: redirects logged-in users away from auth pages
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) {
    const dashboardMap = { admin: '/admin', organizer: '/organizer', student: '/dashboard' };
    return <Navigate to={dashboardMap[user?.role] || '/'} replace />;
  }
  return children;
};
