import axios from "axios";

function normalizeBaseUrl(url: string | undefined) {
  if (!url) return undefined;

  return url.replace(/[;\s]+$/, "").replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL),
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
