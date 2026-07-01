import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // Assuming you have an 'isAuthenticated' or 'token' in your auth slice
  const { isAuthenticated } = useSelector((state) => state.auth); 
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the current location so we can send them back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;