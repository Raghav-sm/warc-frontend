import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json",
      },
      biome: {
        command: "check",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router"],
          "apollo-vendor": ["@apollo/client", "@graphql-sse/apollo-client", "graphql"],
          "ui-vendor": ["radix-ui"],
          "chart-vendor": ["recharts"],
          "utils-vendor": ["date-fns", "dayjs", "xlsx", "libphonenumber-js"],
          "dnd-vendor": ["@hello-pangea/dnd"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
