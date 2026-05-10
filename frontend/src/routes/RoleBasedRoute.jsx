import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(allowedRoles)) {
    // Determine fallback route based on role
    const fallbackPath = user?.role === 'student' ? '/my-fees' : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
