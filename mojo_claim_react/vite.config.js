import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./src", // Set root directory
  build: {
    outDir: "../dist", // Output build to parent dist folder
  },
});
