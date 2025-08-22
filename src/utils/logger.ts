/**
 * Secure logging utility that prevents sensitive data exposure in production
 */

type LogLevel = "error" | "warn" | "info" | "debug";

const LOG_LEVELS = {
  ERROR: "error" as const,
  WARN: "warn" as const,
  INFO: "info" as const,
  DEBUG: "debug" as const,
};

class SecureLogger {
  private isDevelopment: boolean;
  private enableLogging: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || false;
    this.enableLogging =
      import.meta.env.VITE_ENABLE_LOGGING === "true" || this.isDevelopment;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    // Remove sensitive fields
    const sensitiveFields = ["password", "token", "apiKey", "secret", "key"];

    if (typeof data === "object") {
      const sanitized = { ...data };
      sensitiveFields.forEach((field) => {
        if (sanitized[field]) {
          sanitized[field] = "[REDACTED]";
        }
      });
      return sanitized;
    }

    return data;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.enableLogging) return;

    const timestamp = new Date().toISOString();
    const sanitizedData = this.sanitizeData(data);

    if (this.isDevelopment) {
      // Full logging in development
      switch (level) {
        case "error":
          console.error(`[${timestamp}] ${message}`, sanitizedData || "");
          break;
        case "warn":
          console.warn(`[${timestamp}] ${message}`, sanitizedData || "");
          break;
        case "info":
          console.info(`[${timestamp}] ${message}`, sanitizedData || "");
          break;
        case "debug":
          console.debug(`[${timestamp}] ${message}`, sanitizedData || "");
          break;
        default:
          console.log(`[${timestamp}] ${message}`, sanitizedData || "");
      }
    } else {
      // In production, send to error tracking service instead of console
      // This is where you'd integrate with Sentry, LogRocket, etc.
      this.sendToErrorTracking(level, message, sanitizedData);
    }
  }

  private sendToErrorTracking(
    level: string,
    message: string,
    data?: any
  ): void {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // For now, we'll store in sessionStorage for debugging
    try {
      const logEntry = {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const existingLogs = JSON.parse(
        sessionStorage.getItem("app_logs") || "[]"
      );
      existingLogs.push(logEntry);

      // Keep only last 50 logs to prevent storage overflow
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }

      sessionStorage.setItem("app_logs", JSON.stringify(existingLogs));
    } catch (error) {
      // Fail silently if logging fails
    }
  }

  error(message: string, error?: any): void {
    this.log(LOG_LEVELS.ERROR, message, error);
  }

  warn(message: string, data?: any): void {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  // Method to get logs for debugging (development only)
  getLogs(): any[] {
    if (!this.isDevelopment) return [];

    try {
      return JSON.parse(sessionStorage.getItem("app_logs") || "[]");
    } catch {
      return [];
    }
  }

  // Method to clear logs
  clearLogs(): void {
    if (this.isDevelopment) {
      sessionStorage.removeItem("app_logs");
    }
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Export for testing
export { SecureLogger };
