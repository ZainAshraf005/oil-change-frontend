// src/lib/api-client.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // prevent hanging
});

// 🧱 Optional: Global response/error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
