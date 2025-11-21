// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://zawify-2.onrender.com/",   // ← your backend
  withCredentials: true,
});

// Optional: Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;