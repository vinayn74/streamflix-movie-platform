import axios from 'axios';

// Base Axios Instance for StreamFlix API
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseURL = rawBaseURL.replace(/\/+$/, '');

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to headers if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('streamflix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle centralized API errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Unauthorized request - session may be expired.');
    }
    return Promise.reject(error);
  }
);

export default API;
