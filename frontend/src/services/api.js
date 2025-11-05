import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, phone) => api.post('/auth/register', { name, email, password, phone })
};

// Trip API
export const tripAPI = {
  getAll: () => api.get('/trips'),
  getOne: (tripId) => api.get(`/trips/${tripId}`),
  optimize: (sourceId, destId, costWeight = 0.4, timeWeight = 0.3, comfortWeight = 0.3) =>
    api.post('/trips/optimize', { source_id: sourceId, dest_id: destId, cost_weight: costWeight, time_weight: timeWeight, comfort_weight: comfortWeight }),
  optimizeByText: (sourceText, destText, costWeight = 0.4, timeWeight = 0.3, comfortWeight = 0.3) =>
    api.post('/trips/optimize', { source_text: sourceText, dest_text: destText, cost_weight: costWeight, time_weight: timeWeight, comfort_weight: comfortWeight }),
  delete: (tripId) => api.delete(`/trips/${tripId}`)
};

// Destination API
export const destinationAPI = {
  getAll: () => api.get('/destinations'),
  search: (query) => api.get('/destinations/search', { params: { q: query } }),
  create: (name, state, city, pincode) => api.post('/destinations', { name, state, city, pincode })
};

export default api;

