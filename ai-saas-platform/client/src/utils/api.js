import { API_BASE_URL } from './constant';

// Function to get Clerk JWT token
const getClerkToken = async () => {
  try {
    // This assumes Clerk is available in the global scope
    if (window.Clerk && window.Clerk.user) {
      return await window.Clerk.getToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting Clerk token:', error);
    return null;
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = await getClerkToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (name, email, password) => 
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  logout: () => 
    apiRequest('/auth/logout', { method: 'POST' }),
  
  refreshToken: () => 
    apiRequest('/auth/refresh', { method: 'POST' }),
};

// Tools API
export const toolsApi = {
  generateArticle: (topic, tone, length) =>
    apiRequest('/tools/article', {
      method: 'POST',
      body: JSON.stringify({ topic, tone, length }),
    }),
  
  generateImage: (prompt, style, size) =>
    apiRequest('/tools/image', {
      method: 'POST',
      body: JSON.stringify({ prompt, style, size }),
    }),
  
  removeBackground: (imageData) =>
    apiRequest('/tools/background', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    }),
  
  removeObject: (imageData, coordinates) =>
    apiRequest('/tools/object', {
      method: 'POST',
      body: JSON.stringify({ image: imageData, coordinates }),
    }),
  
  reviewResume: (resumeData) =>
    apiRequest('/tools/resume', {
      method: 'POST',
      body: JSON.stringify({ resume: resumeData }),
    }),
};

// User API
export const userApi = {
  getProfile: () => 
    apiRequest('/user/profile', { method: 'GET' }),
  
  updateProfile: (data) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  getCreations: (limit = 10) =>
    apiRequest(`/user/creations?limit=${limit}`, { method: 'GET' }),
  
  deleteCreation: (id) =>
    apiRequest(`/user/creations/${id}`, { method: 'DELETE' }),
};

// Payment API
export const paymentApi = {
  createSubscription: (plan) =>
    apiRequest('/payment/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  
  buyCredits: (amount) =>
    apiRequest('/payment/credits', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  
  getInvoices: () =>
    apiRequest('/payment/invoices', { method: 'GET' }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest('/dashboard/stats', { method: 'GET' }),
  
  getCreations: (limit = 10) =>
    apiRequest(`/dashboard/creations?limit=${limit}`, { method: 'GET' }),
};

export default {
  auth: authApi,
  tools: toolsApi,
  user: userApi,
  payment: paymentApi,
  dashboard: dashboardApi,
};