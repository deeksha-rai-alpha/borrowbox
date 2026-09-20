import axios from "axios";

// Central Axios instance so every API call shares the same base URL
// and automatically attaches the JWT token once the user is logged in.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("borrowbox_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handling: log the user out if the token has expired/is invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("borrowbox_token");
      localStorage.removeItem("borrowbox_user");
    }
    return Promise.reject(error);
  }
);

export default api;
