import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Слушать все адреса (и IPv4, и IPv6): на Windows Vite иначе открывает
    // только ::1, а браузер ищет localhost по 127.0.0.1 и не находит страницу.
    host: true,
    strictPort: true,
    // Прокси к веб-сервису на Go: запросы фронтенда на /api уходят на :8080, CORS не нужен.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
