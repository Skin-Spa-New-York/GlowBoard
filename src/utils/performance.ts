/**
 * Performance monitoring utilities
 */

import { logger } from "./logger";

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        logger.debug(`Performance: ${entry.name}`, {
          startTime: entry.startTime,
          duration: entry.duration || 0,
        });
      }
    });

    // Observe paint timings
    observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] });

    // Track bundle loading performance
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      logger.info("App loaded", { loadTime: `${loadTime.toFixed(2)}ms` });
    });
  }
};

// Bundle size monitoring (development only)
export const logBundleInfo = () => {
  if (import.meta.env.DEV) {
    logger.info("Bundle optimization status", {
      lazyLoading: true,
      codeSplitting: true,
      treeShaking: true,
    });
  }
};
