import axios from 'axios';

/**
 * Creating a centralized Axios instance.
 * This helps us avoid writing the full URL every time we make an API call.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

/**
 * Interceptor: This automatically runs before every request we make.
 * If we have a token in localStorage, it adds it to the headers.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
