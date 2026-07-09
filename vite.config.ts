import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("rapier") || id.includes("dimforge")) {
              return "physics-vendor";
            }
            if (
              id.includes("three") || 
              id.includes("@react-three") || 
              id.includes("three-stdlib")
            ) {
              return "three-vendor";
            }
            if (id.includes("gsap")) {
              return "gsap-vendor";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
