import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "."),  // 🔥 Set root to current directory
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),  // 🔥 Force Vite to use this
    },
  },
});