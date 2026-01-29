import axios from "axios";
import { BASE_URL } from "../constant";

const http = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
    const requiresAuth = config.requiresAuth ?? true;

    if (requiresAuth && token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default http;
