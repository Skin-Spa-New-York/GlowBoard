import { describe, it, expect } from "vitest";
import {
  createPageUrl,
  getPageNameFromUrl,
  navigationItems,
} from "../../utils/routing";

describe("Routing Utilities", () => {
  describe("createPageUrl", () => {
    it("converts PascalCase to kebab-case URLs", () => {
      expect(createPageUrl("Dashboard")).toBe("/dashboard");
      expect(createPageUrl("SalesEntry")).toBe("/sales-entry");
      expect(createPageUrl("UserManagement")).toBe("/user-management");
      expect(createPageUrl("AuditLogs")).toBe("/audit-logs");
    });

    it("handles single words correctly", () => {
      expect(createPageUrl("Notes")).toBe("/notes");
      expect(createPageUrl("Settings")).toBe("/settings");
    });
  });

  describe("getPageNameFromUrl", () => {
    it("converts kebab-case URLs to PascalCase", () => {
      expect(getPageNameFromUrl("/dashboard")).toBe("Dashboard");
      expect(getPageNameFromUrl("/sales-entry")).toBe("SalesEntry");
      expect(getPageNameFromUrl("/user-management")).toBe("UserManagement");
      expect(getPageNameFromUrl("/audit-logs")).toBe("AuditLogs");
    });

    it("handles URLs without leading slash", () => {
      expect(getPageNameFromUrl("dashboard")).toBe("Dashboard");
      expect(getPageNameFromUrl("notes")).toBe("Notes");
    });
  });

  describe("navigationItems", () => {
    it("contains all expected navigation items", () => {
      expect(navigationItems).toHaveLength(6);

      const titles = navigationItems.map((item) => item.title);
      expect(titles).toContain("Dashboard");
      expect(titles).toContain("Sales Entry");
      expect(titles).toContain("Notes");
      expect(titles).toContain("User Management");
      expect(titles).toContain("Audit Logs");
      expect(titles).toContain("Settings");
    });

    it("has correct admin-only flags", () => {
      const publicItems = navigationItems.filter((item) => !item.adminOnly);
      const adminItems = navigationItems.filter((item) => item.adminOnly);

      expect(publicItems).toHaveLength(3); // Dashboard, Sales Entry, Notes
      expect(adminItems).toHaveLength(3); // User Management, Audit Logs, Settings
    });

    it("has valid URLs", () => {
      navigationItems.forEach((item) => {
        expect(item.url).toMatch(/^\/[a-z-]+$/);
      });
    });
  });
});
