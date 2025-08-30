import axios from "axios";
import authApi from "./apiAuthentication";
import { error } from "console";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;

let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });

    failedQueue = [];
}

axiosClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {Promise.reject(error)}
)

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken) {
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        try {
            const response = await authApi.refreshToken({ refreshToken: refreshToken });
            
            const newAccessToken = response.data?.accessToken;
            const newRefreshToken = response.data?.refreshToken;

            accessToken = newAccessToken;
            localStorage.setItem('refreshToken', newRefreshToken);

            axiosClient.defaults.headers['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken);

            return axiosClient(originalRequest);
        } catch (err) {
            processQueue(err, null);
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            accessToken = null;
            window.location.href = '/login';
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
        return Promise.reject(error);
    }
)

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export default axiosClient;