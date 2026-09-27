import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Hosting platforms set one of these during their builds
const isHostedBuild = Boolean(
  process.env.RENDER || process.env.VERCEL || process.env.NETLIFY || process.env.CI
);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiUrl = env.VITE_API_URL?.trim();

  // Without VITE_API_URL the deployed site would silently call http://localhost:5000
  if (mode === "production" && isHostedBuild) {
    if (!apiUrl) {
      throw new Error(
        "VITE_API_URL is not set. Add it in your hosting dashboard, e.g. https://internconnect-backend.onrender.com"
      );
    }
    if (/\/api\/?$/.test(apiUrl)) {
      throw new Error(`VITE_API_URL must be the backend origin without "/api" (got "${apiUrl}")`);
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          // Keep large third-party code in separate, long-cached chunks
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (
              /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)
            ) {
              return "react";
            }
            if (id.includes("react-icons")) return "icons";
            return "vendor";
          },
        },
      },
    },
  };
});
