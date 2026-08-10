import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('car_rental_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('car_rental_token') || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('car_rental_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('car_rental_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session verification failed', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('car_rental_token', newToken);
    localStorage.setItem('car_rental_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, confirmPassword, role = 'user') => {
    const res = await api.post('/auth/register', { name, email, password, confirmPassword, role });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('car_rental_token', newToken);
    localStorage.setItem('car_rental_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    try {
      api.post('/auth/logout').catch(() => {});
    } catch (e) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('car_rental_token');
    localStorage.removeItem('car_rental_user');
  };

  const isOwner = user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
