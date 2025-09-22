import axios from 'axios';

const API_BASE_URL = '/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};


export const helpRequestAPI = {
  create: (requestData) => api.post('/help-requests', requestData),
  getAll: () => api.get('/help-requests'),
};


export const volunteerAPI = {
  getAll: () => api.get('/volunteers'),
  assignToRequest: (requestId, volunteerId) => api.post('/volunteer/assign', { requestId, volunteerId }),
};

export const helpRequestStatusAPI = {
  updateStatus: (requestId, status) => api.put(`/help-requests/${requestId}/status`, { status }),
};


export const alertAPI = {
  getAll: () => api.get('/alerts'),
  create: (alertData) => api.post('/alerts', alertData),
};


export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};


export const contactAPI = {
  submit: (contactData) => api.post('/contact', contactData),
};

export default api;