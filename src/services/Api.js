import axios from 'axios';
import { api_url } from '../utils/config';

// Create an instance with your base URL
const api = axios.create({
  baseURL: api_url,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: attach token if it exists
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.request.use(
  (config) => {
    // Parsing the token out of the centralized 'user_data' object
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData && userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error("Error parsing user_data from localStorage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle expired/invalid tokens
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const token = localStorage.getItem('token');

//     if (error.response && error.response.status === 401 && token) {
//       localStorage.removeItem('token');
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const userData = localStorage.getItem('user_data');

//     if (error.response && error.response.status === 401 && userData) {
//       localStorage.removeItem('user_data');
//       window.location.href = '/'; 
//     }
//         return Promise.reject(error);
//   }
// );

export default api;