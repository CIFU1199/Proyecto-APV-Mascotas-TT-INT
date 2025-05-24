// src/api/apiClient.ts
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api', // Asegúrate que coincida con tu API
  timeout: 10000,
});

// Interceptor para añadir token a las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;