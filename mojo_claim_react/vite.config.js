import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "mojo_claim_react"), // 🔥 Absolute path to be safe
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "mojo_claim_react/index.html"), // 🔥 Force correct input
    },
  },
});