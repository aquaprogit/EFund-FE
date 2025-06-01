import axios from 'axios';
import { useAuth } from '../../features/auth/store/auth.store';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(request => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (!(request.data instanceof FormData)) {
        request.headers['Content-Type'] = 'application/json';
    }

    return request;
}, error => Promise.reject(error));

// Response interceptor
axiosInstance.interceptors.response.use(response => response, async error => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const { refreshToken, accessToken } = useAuth.getState();

        // Check if we have tokens before attempting refresh
        if (!refreshToken || !accessToken) {
            useAuth.getState().signOut();
            return Promise.reject(error);
        }

        try {
            await useAuth.getState().refresh(accessToken, refreshToken);

            // Get the new access token after refresh
            const newAccessToken = useAuth.getState().accessToken;

            if (!newAccessToken) {
                throw new Error('Failed to refresh token');
            }

            // Update the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry the original request with the new token
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            useAuth.getState().signOut();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default axiosInstance; 