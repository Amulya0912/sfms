import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout as reduxLogout } from '../store/slices/authSlice';
import { axiosInstance } from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Verify token by getting user profile
          const { data } = await axiosInstance.get('/auth/me');
          dispatch(setCredentials({ user: data }));
        } catch (error) {
          console.error('Auth initialization failed:', error);
          dispatch(reduxLogout());
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (credentials) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch(setCredentials({ user: data.user }));
    return data.user;
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      dispatch(reduxLogout());
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
