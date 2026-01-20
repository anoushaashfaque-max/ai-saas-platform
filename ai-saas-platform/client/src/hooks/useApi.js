import { useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const useApi = () => {
  const request = useCallback(async (endpoint, options = {}) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }, []);

  return { request };
};

export { useApi };
