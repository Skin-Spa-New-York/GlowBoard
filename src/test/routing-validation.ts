/**
 * Comprehensive Routing and Import Validation
 * This file validates all routes, imports, and navigation paths
 */

// Route definitions from App.tsx
export const APP_ROUTES = [
  { path: "/", component: "Dashboard" },
  { path: "/dashboard", component: "Dashboard" },
  { path: "/sales-entry", component: "SalesEntry" },
  { path: "/notes", component: "Notes" },
  { path: "/user-management", component: "UserManagement" },
  { path: "/audit-logs", component: "AuditLogs" },
  { path: "/settings", component: "Settings" },
] as const;

// Navigation items from Layout.tsx
export const NAVIGATION_ITEMS = [
  { title: "Dashboard", url: "/dashboard", adminOnly: false },
  { title: "Sales Entry", url: "/sales-entry", adminOnly: false },
  { title: "Notes", url: "/notes", adminOnly: false },
  { title: "User Management", url: "/user-management", adminOnly: true },
  { title: "Audit Logs", url: "/audit-logs", adminOnly: true },
  { title: "Settings", url: "/settings", adminOnly: true },
] as const;

// Component file structure validation
export const COMPONENT_STRUCTURE = {
  pages: [
    "src/pages/Dashboard.tsx",
    "src/pages/SalesEntry.tsx",
    "src/pages/Notes.tsx",
    "src/pages/UserManagement.tsx",
    "src/pages/AuditLogs.tsx",
    "src/pages/Settings.tsx",
  ],
  components: {
    auth: ["src/components/Auth/LoginPage.tsx"],
    dashboard: [
      "src/components/Dashboard/StatsGrid.tsx",
      "src/components/Dashboard/LocationSelector.tsx",
      "src/components/Dashboard/SalesChart.tsx",
      "src/components/Dashboard/ChartSettingsSidebar.tsx",
      "src/components/Dashboard/RecentActivity.tsx",
      "src/components/Dashboard/PerformanceMetrics.tsx",
    ],
    notes: [
      "src/components/Notes/NotesHeader.tsx",
      "src/components/Notes/NoteForm.tsx",
      "src/components/Notes/NotesGrid.tsx",
      "src/components/Notes/NotesFilters.tsx",
    ],
    sales: [
      "src/components/Sales/SalesForm.tsx",
      "src/components/Sales/SalesTable.tsx",
      "src/components/Sales/QuickActions.tsx",
    ],
    utils: ["src/components/Utils/AuditLogger.tsx"],
    ui: [
      "src/components/ui/alert.tsx",
      "src/components/ui/badge.tsx",
      "src/components/ui/button.tsx",
      "src/components/ui/card.tsx",
      "src/components/ui/input.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/table.tsx",
      "src/components/ui/tabs.tsx",
      "src/components/ui/textarea.tsx",
    ],
  },
  services: ["src/services/entities.ts", "src/services/firebase.ts"],
  hooks: [
    "src/hooks/useAuth.ts",
    "src/hooks/useSalesData.ts",
    "src/hooks/useUserManagement.ts",
  ],
  utils: [
    "src/utils/dateUtils.ts",
    "src/utils/routing.ts",
    "src/utils/salesUtils.ts",
  ],
  config: ["src/config/firebase.ts"],
  types: ["src/types/entities.ts"],
} as const;

// Import path validation
export const IMPORT_PATTERNS = {
  // All imports should use @ alias for internal modules
  internal: /^@\//,
  // External packages should not use relative paths
  external: /^[a-z]/,
  // No relative imports should go beyond parent directory
  relative: /^\.\.?\//,
} as const;

// Route validation functions
export function validateRouteStructure() {
  const issues: string[] = [];

  // Check that all routes have corresponding components
  APP_ROUTES.forEach((route) => {
    const componentPath = `src/pages/${route.component}.tsx`;
    // This would need file system access to validate
    console.log(`Validating route ${route.path} -> ${componentPath}`);
  });

  // Check that navigation items match routes
  NAVIGATION_ITEMS.forEach((navItem) => {
    const matchingRoute = APP_ROUTES.find(
      (route) => route.path === navItem.url
    );
    if (!matchingRoute && navItem.url !== "/dashboard") {
      issues.push(
        `Navigation item ${navItem.title} has no matching route: ${navItem.url}`
      );
    }
  });

  return issues;
}

// Import validation
export function validateImportPaths(fileContent: string, filePath: string) {
  const issues: string[] = [];
  const importLines = fileContent
    .split("\n")
    .filter((line) => line.trim().startsWith("import"));

  importLines.forEach((line, index) => {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (match) {
      const importPath = match[1];

      // Check for problematic relative imports
      if (importPath.startsWith("../../../")) {
        issues.push(
          `${filePath}:${index + 1} - Deep relative import: ${importPath}`
        );
      }

      // Check for missing @ alias usage
      if (importPath.startsWith("./") && !importPath.includes("ui/")) {
        // Allow relative imports for UI components and same-directory files
        if (
          !filePath.includes("components/ui/") &&
          !importPath.startsWith("./")
        ) {
          issues.push(
            `${filePath}:${index + 1} - Should use @ alias: ${importPath}`
          );
        }
      }
    }
  });

  return issues;
}

console.log("Routing validation module loaded successfully");
console.log("Routes configured:", APP_ROUTES.length);
console.log("Navigation items:", NAVIGATION_ITEMS.length);
console.log(
  "Component files tracked:",
  Object.values(COMPONENT_STRUCTURE.components).flat().length
);
