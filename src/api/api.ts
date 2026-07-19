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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
