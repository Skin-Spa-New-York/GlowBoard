import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-vendor": [
            "firebase/app",
            "firebase/firestore",
            "firebase/auth",
          ],
          "charts-vendor": ["echarts"],
          "ui-vendor": ["lucide-react", "date-fns"],

          // Feature chunks
          "dashboard-features": [
            "./src/components/Dashboard/SalesChart.tsx",
            "./src/components/Dashboard/ChartSettingsSidebar.tsx",
            "./src/components/Dashboard/PerformanceMetrics.tsx",
          ],
          "admin-features": [
            "./src/pages/Settings.tsx",
            "./src/pages/UserManagement.tsx",
            "./src/pages/AuditLogs.tsx",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
      },
      mangle: {
        safari10: true,
      },
    },
  },
});
