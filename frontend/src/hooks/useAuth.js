import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const hasRole = (roles) => {
    if (!isAuthenticated || !user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  return {
    ...context,
    user,
    isAuthenticated,
    hasRole,
  };
};
