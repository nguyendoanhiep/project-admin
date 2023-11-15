import axios from "axios";

export const baseUrl = {
    host: 'http://localhost:',
    port: 8085,
};

export const api = axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers["Token"] = JSON.parse(token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);