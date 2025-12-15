import axios from 'axios';

// Backend API URL - automatically uses the same hostname as the frontend
const API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    const masterPassword = sessionStorage.getItem('master_password');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (masterPassword) {
        config.headers['X-Master-Password'] = masterPassword;
    }

    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
