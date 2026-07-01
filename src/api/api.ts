import axios from "axios";

// Запити завжди йдуть на поточний домен (/auth/*).
// Dev: Vite proxy (vite.config.ts) → бекенд
// Prod: Vercel rewrites (vercel.json) → бекенд
// Не використовуйте VITE_API_URL тут — це викличе CORS у браузері.
export const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
