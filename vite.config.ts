import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type ProxyOptions } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiTarget =
  process.env.VITE_API_URL?.replace(/[;\s]+$/, "").replace(/\/$/, "") ||
  "https://accanto.adammudrak.pp.ua";

const apiProxy: ProxyOptions = {
  target: apiTarget,
  changeOrigin: true,
  secure: false,
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq) => {
      proxyReq.removeHeader("origin");
      proxyReq.removeHeader("referer");
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/auth": apiProxy,
      "/employees": apiProxy,
      "/menu-items": apiProxy,
      "/menu-categories": apiProxy,
      "/restaurant": apiProxy,
      "/schedule": apiProxy,
      "/images": apiProxy,
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
});
