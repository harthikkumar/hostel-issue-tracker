import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Auth init error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, tokens } = response.data;

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
  try {
    console.log('Sending registration data:', userData);
    const response = await authAPI.register(userData);
    const { user: newUser, tokens } = response.data;

    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(newUser));

    setUser(newUser);
    return { success: true, user: newUser };
  } catch (err) {
    console.error('Registration error:', err.response?.data);
    
    // Extract error messages
    let errorMessage = 'Registration failed';
    if (err.response?.data) {
      const errors = err.response.data;
      if (errors.username) {
        errorMessage = 'Username already exists. Please choose a different username.';
      } else if (errors.email) {
        errorMessage = 'Email already exists.';
      } else if (typeof errors === 'string') {
        errorMessage = errors;
      } else {
        errorMessage = JSON.stringify(errors);
      }
    }
    
    return { success: false, error: errorMessage };
  }
};

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;