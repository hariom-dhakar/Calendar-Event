import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Only log 401 errors for non-auth endpoints to reduce noise
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/status')) {
        console.log("Unauthorized access - user needs to login");
      }
    } else if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error)
  },
)
