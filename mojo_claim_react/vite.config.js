import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "mojo-claim-react",  // 🔥 Set correct root directory
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "mojo-claim-react/index.html",  // 🔥 Force Vite to find it
    },
  },
});