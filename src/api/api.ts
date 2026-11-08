import axios from "axios";

function normalizeBaseUrl(url: string | undefined) {
  const trimmed = url?.replace(/[;\s]+$/, "").replace(/\/$/, "");
  return trimmed || undefined;
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

  if (token && token !== "session") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  if (config.data instanceof FormData) {
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
    } else {
      delete config.headers["Content-Type"];
    }
  }

  return config;
});

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;
let isHandlingUnauthorized = false;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

const AUTH_SKIP_URLS = [
  "/auth/",
  "/test/admin-auth",
  "/employees/finalize-email-change",
];

function handleAuthError(status?: number, url?: string) {
  if (status !== 401 && status !== 403) return;
  if (url && AUTH_SKIP_URLS.some((skipUrl) => url.includes(skipUrl))) return;
  if (!localStorage.getItem("token")) return;
  if (isHandlingUnauthorized) return;

  isHandlingUnauthorized = true;
  onUnauthorized?.();
  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 1000);
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handleAuthError(error.response?.status, error.config?.url);

    if (error.response && error.response.data) {
      return Promise.resolve(error.response);
    }

    const fallbackError = {
      data: {
        success: false,
        message: "Network Error",
        data: null,
        errors: ["The server is not responding. Please try again later."],
      },
    };
    return Promise.resolve(fallbackError);
  },
);
