import api from '../utils/api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.auth.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  // Signup user
  signup: async (name, email, password) => {
    try {
      const response = await api.auth.signup(name, email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.user.updateProfile(userData);
      
      // Update local storage
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Update failed',
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.auth.refreshToken();
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return {
        success: true,
        token: response.token,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  },
};

export default authService;