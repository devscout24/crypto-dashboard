import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
console.log({ API_BASE_URL });

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const storageData = localStorage.getItem("auth-storage");
    const token = storageData ? JSON.parse(storageData).state.token.data : null;

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/login")
    ) {
      // Handle unauthorized access
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
