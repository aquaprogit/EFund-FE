import axios from 'axios';
import { useAuth } from '../../features/auth/store/auth.store';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(request => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (!(request.data instanceof FormData)) {
        request.headers['Content-Type'] = 'application/json';
    }

    return request;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => {
    console.log(response);

    return response;
}, async error => {
    const status = error.response ? error.response.status : null
    const originalRequest = error.config

    if (status === 401) {
        if (!originalRequest._retry) {
            originalRequest._retry = true

            const { refreshToken, accessToken } = useAuth.getState()

            await useAuth.getState().refresh(accessToken!, refreshToken!)

            const retryOrigReq = await axios(originalRequest, {
                headers: {
                    'Authorization': `Bearer ${useAuth.getState().accessToken}`
                }
            });

            return retryOrigReq
        }

        useAuth.getState().signOut()

        return Promise.reject(error)
    }

    return Promise.reject(error)
});

export default axios; 