// apiClient.ts
import { Configuration } from "@/api";
import * as api from "@/api";
import axios from "axios";

const API_BASE = "http://localhost:8080";

// Custom axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Inject token before every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const config = new Configuration({ basePath: API_BASE });

// Clients will now use the axios instance with interceptor
export const authControllerApi = new api.AuthControllerApi(
  config,
  API_BASE,
  axiosInstance
);
export const chatControllerApi = new api.ChatControllerApi(
  config,
  API_BASE,
  axiosInstance
);
export const mediaControllerApi = new api.MediaControllerApi(
  config,
  API_BASE,
  axiosInstance
);
export const userControllerApi = new api.UserControllerApi(
  config,
  API_BASE,
  axiosInstance
);
