import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import API from '../services/api';

// Create Auth Context
export const AuthContext = createContext();

/**
 * Auth Provider Component
 * Manages global user authentication state, token storage, and session restoration
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('streamflix_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load authenticated user on app initialization if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('streamflix_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or backend unavailable:', err?.response?.data?.message || err.message);
          const savedUser = localStorage.getItem('streamflix_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register User
  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('streamflix_token', userToken);
      localStorage.setItem('streamflix_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Login User
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('streamflix_token', userToken);
      localStorage.setItem('streamflix_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Logout User
  const logout = useCallback(() => {
    localStorage.removeItem('streamflix_token');
    localStorage.removeItem('streamflix_user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Update user state helper
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedData };
      localStorage.setItem('streamflix_user', JSON.stringify(newObj));
      return newObj;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  }), [user, token, loading, error, register, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

