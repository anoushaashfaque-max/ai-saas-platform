import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState('jwt'); // 'jwt' or 'clerk'

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ai_saas_user');
    const storedAuthType = localStorage.getItem('ai_saas_auth_type');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuthType(storedAuthType || 'jwt');
      } catch (error) {
        localStorage.removeItem('ai_saas_user');
        localStorage.removeItem('ai_saas_auth_type');
      }
    }
    setLoading(false);
  }, []);

  // JWT Authentication
  const loginWithJWT = async (email, password) => {
    const mockUser = {
      id: '123',
      name: email.split('@')[0],
      email,
      isPro: false,
      authType: 'jwt',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('ai_saas_user', JSON.stringify(mockUser));
    localStorage.setItem('ai_saas_auth_type', 'jwt');
    return { success: true, user: mockUser };
  };

  // Clerk Authentication (Simulation)
  const loginWithClerk = async (email, password) => {
    const mockUser = {
      id: 'clerk_123',
      name: email.split('@')[0],
      email,
      isPro: false,
      authType: 'clerk',
      clerkId: 'user_clerk_123',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('ai_saas_user', JSON.stringify(mockUser));
    localStorage.setItem('ai_saas_auth_type', 'clerk');
    return { success: true, user: mockUser };
  };

  const signup = async (name, email, password) => {
    const mockUser = {
      id: '456',
      name,
      email,
      isPro: false,
      authType: 'jwt',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('ai_saas_user', JSON.stringify(mockUser));
    localStorage.setItem('ai_saas_auth_type', 'jwt');
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_saas_user');
    localStorage.removeItem('ai_saas_auth_type');
    navigate('/');
  };

  const upgradeToPro = () => {
    const updatedUser = {
      ...user,
      isPro: true,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    setUser(updatedUser);
    localStorage.setItem('ai_saas_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('ai_saas_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    authType,
    loginWithJWT,
    loginWithClerk,
    signup,
    logout,
    upgradeToPro,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
