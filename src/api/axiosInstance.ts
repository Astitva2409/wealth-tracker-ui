// =============================================================
//  src/api/axiosInstance.ts
//
//  CONCEPT: Axios interceptors
//  Instead of manually adding the JWT token to every single
//  API call, we create ONE Axios instance with an interceptor.
//  The interceptor runs automatically before every request
//  and attaches the token from localStorage.
//
//  Java analogy: like a Spring HandlerInterceptor that runs
//  before every controller method.
// =============================================================

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// ── Request Interceptor ──────────────────────────────────────
// Runs BEFORE every request is sent
// Reads the token from localStorage and attaches it to the header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('wealth_tracker_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────
// Runs AFTER every response is received
// If backend returns 401 (token expired) → clear storage → redirect to login
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — force logout
            localStorage.removeItem('wealth_tracker_token');
            localStorage.removeItem('wealth_tracker_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;