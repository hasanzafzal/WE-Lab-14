import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // Also check the user object for role field
  let userFromStorage = null;
  try {
    userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required - try multiple sources
  if (requiredRole) {
    const hasRequiredRole = 
      userRole === requiredRole || 
      userFromStorage?.role === requiredRole ||
      userFromStorage?.isAdmin === true && requiredRole === 'admin';
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
