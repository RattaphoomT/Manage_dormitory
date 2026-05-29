/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest, getToken, setToken } from './services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getToken());
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('authUser');
      setToken(null);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setToken(data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
