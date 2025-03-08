import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./",
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      // Explicitly map .tsx to .jsx
      "/src/main.tsx": "/src/main.jsx",
    },
  },
});
