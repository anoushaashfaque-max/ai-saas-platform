import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState(null); // 'clerk' or 'email'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const savedAuthMethod = localStorage.getItem('auth_method');

    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setAuthMethod(savedAuthMethod || 'email');
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
      
      localStorage.setItem('user', JSON.stringify(clerkUser));
      localStorage.setItem('token', 'demo_clerk_token');
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
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token
      const userData = data.data.user;
      const token = data.data.token;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
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
      // Call backend signup API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store user data and token
      const userData = data.data.user;
      const token = data.data.token;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
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