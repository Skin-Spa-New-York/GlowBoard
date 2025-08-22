/**
 * Create page URL from page name
 * Converts PascalCase page names to kebab-case URLs
 */
export function createPageUrl(pageName: string): string {
  // Convert PascalCase to kebab-case
  const kebabCase = pageName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");

  return `/${kebabCase}`;
}

/**
 * Get page name from URL path
 */
export function getPageNameFromUrl(path: string): string {
  // Remove leading slash and convert kebab-case to PascalCase
  const cleanPath = path.replace(/^\//, "");
  return cleanPath
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Navigation items configuration
 */
export const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "BarChart3",
    adminOnly: false,
  },
  {
    title: "Sales Entry",
    url: "/sales-entry",
    icon: "Building2",
    adminOnly: false,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: "FileText",
    adminOnly: false,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: "Users",
    adminOnly: true,
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: "Shield",
    adminOnly: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "Settings",
    adminOnly: true,
  },
] as const;
