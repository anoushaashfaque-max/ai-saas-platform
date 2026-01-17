import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState(null); // 'clerk' or 'email'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('ai_saas_user');
    const savedAuthMethod = localStorage.getItem('auth_method');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        setAuthMethod(savedAuthMethod || 'email');
      } catch (error) {
        localStorage.removeItem('ai_saas_user');
        localStorage.removeItem('auth_method');
      }
    }
    setLoading(false);
  }, []);

  // Clerk Authentication
  const loginWithClerk = async () => {
    try {
      // For demo - simulate Clerk login
      // In real app, you would use Clerk's signIn methods
      console.log('Opening Clerk sign-in...');
      
      // Simulate Clerk user data
      const clerkUser = {
        id: 'clerk_' + Date.now(),
        name: 'Clerk User',
        email: 'user@example.com',
        isPro: false,
        hasPurchasedCredits: false,
        credits: 15, // Bonus credits for Clerk users
        authMethod: 'clerk',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('ai_saas_user', JSON.stringify(clerkUser));
      localStorage.setItem('auth_method', 'clerk');
      setUser(clerkUser);
      setAuthMethod('clerk');
      
      navigate('/dashboard');
      return clerkUser;
    } catch (error) {
      console.error('Clerk login error:', error);
      throw error;
    }
  };

  // Traditional Email/Password Login
  const loginWithEmail = async (email, password) => {
    try {
      // Mock login - Replace with actual API call
      const userData = {
        id: 'email_' + Date.now(),
        name: email.split('@')[0],
        email,
        isPro: false,
        hasPurchasedCredits: false,
        credits: 10,
        authMethod: 'email',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('ai_saas_user', JSON.stringify(userData));
      localStorage.setItem('auth_method', 'email');
      setUser(userData);
      setAuthMethod('email');
      
      navigate('/dashboard');
      return userData;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  // Traditional Email/Password Signup
  const signupWithEmail = async (name, email, password) => {
    try {
      // Mock signup - Replace with actual API call
      const userData = {
        id: 'email_' + Date.now(),
        name,
        email,
        isPro: false,
        hasPurchasedCredits: false,
        credits: 10,
        authMethod: 'email',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('ai_saas_user', JSON.stringify(userData));
      localStorage.setItem('auth_method', 'email');
      setUser(userData);
      setAuthMethod('email');
      
      navigate('/dashboard');
      return userData;
    } catch (error) {
      console.error('Email signup error:', error);
      throw error;
    }
  };

  // Combined login (smart detection)
  const login = async (email, password) => {
    return loginWithEmail(email, password);
  };

  // Combined signup
  const signup = async (name, email, password) => {
    return signupWithEmail(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem('ai_saas_user');
    localStorage.removeItem('auth_method');
    setUser(null);
    setAuthMethod(null);
    navigate('/');
  };

  const upgradeToPro = () => {
    const updatedUser = {
      ...user,
      isPro: true,
      hasPurchasedCredits: true,
      credits: user.credits + 1000,
    };
    
    localStorage.setItem('ai_saas_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  // Get authentication options
  const getAuthOptions = () => {
    return [
      {
        id: 'clerk',
        name: 'Sign in with Clerk',
        description: 'Quick and secure login with Clerk',
        icon: '🔐',
        onClick: loginWithClerk
      },
      {
        id: 'email',
        name: 'Sign in with Email',
        description: 'Traditional email and password',
        icon: '📧',
        onClick: null // Will be handled by form
      }
    ];
  };

  return {
    user,
    loading,
    authMethod,
    login,
    signup,
    logout,
    upgradeToPro,
    loginWithClerk,
    loginWithEmail,
    signupWithEmail,
    getAuthOptions
  };
};