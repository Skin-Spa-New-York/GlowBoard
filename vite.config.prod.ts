import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// Production-optimized configuration
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          "react-core": ["react", "react-dom"],
          "react-router": ["react-router-dom"],

          // Firebase (largest dependency)
          "firebase-core": ["firebase/app"],
          "firebase-auth": ["firebase/auth"],
          "firebase-firestore": ["firebase/firestore"],

          // Charts (second largest)
          "echarts-core": ["echarts/core"],
          "echarts-charts": ["echarts/charts"],
          "echarts-components": ["echarts/components"],
          "echarts-renderers": ["echarts/renderers"],

          // UI and utilities
          "ui-libs": ["lucide-react", "date-fns", "clsx", "tailwind-merge"],

          // Admin features (lazy loaded)
          "admin-pages": [
            "./src/pages/Settings.tsx",
            "./src/pages/UserManagement.tsx",
            "./src/pages/AuditLogs.tsx",
          ],

          // Chart features (lazy loaded)
          "chart-features": [
            "./src/components/Dashboard/SalesChart.tsx",
            "./src/components/Dashboard/ChartSettingsSidebar.tsx",
          ],
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                ?.replace(".tsx", "")
                .replace(".ts", "")
            : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || "")) {
            return `css/[name]-[hash].${ext}`;
          }
          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || "")
          ) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "date-fns",
      "lucide-react",
    ],
    exclude: ["firebase/app", "firebase/auth", "firebase/firestore", "echarts"],
  },
});
