import axios from 'axios';

// Everything goes through the API Gateway on 8080 — the frontend never
// talks to user-service/restaurant-service/order-service directly.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('fd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fd_token');
      localStorage.removeItem('fd_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default client;
