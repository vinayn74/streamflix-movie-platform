import axios from 'axios';

/**
 * Centralized Single Source of Truth for StreamFlix API Communication
 * Automatically uses Vercel environment variable (VITE_API_URL or VITE_API_BASE_URL)
 * Fallback to local development API: http://localhost:5000/api
 */
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const baseURL = rawBaseURL.replace(/\/+$/, '');

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Automatically attaches stored JWT Bearer token to Authorization headers
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('streamflix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Automatically handles 401 Unauthorized errors by clearing stored authentication & session data
 * and redirecting to the login page.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('streamflix_token');
      localStorage.removeItem('streamflix_user');
      localStorage.removeItem('streamflix_favorites');
      localStorage.removeItem('streamflix_watchlist');
      console.warn('Unauthorized request (401) - session expired. Redirecting to login.');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;

