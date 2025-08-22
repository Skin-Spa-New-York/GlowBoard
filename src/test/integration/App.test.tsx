import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../test-utils";
import App from "../../App";

// Mock the services - empty implementations for testing
vi.mock("@/services/entities", () => ({
  UserEntity: {
    me: vi.fn().mockResolvedValue(null),
    logout: vi.fn().mockResolvedValue(undefined),
  },
  SalesRecordEntity: {
    list: vi.fn().mockResolvedValue([]),
  },
  NoteEntity: {
    list: vi.fn().mockResolvedValue([]),
  },
  AuditLogEntity: {
    create: vi.fn().mockResolvedValue({}),
  },
}));

// Mock routing utilities
vi.mock("@/utils/routing", () => ({
  createPageUrl: vi.fn((pageName: string) => `/${pageName.toLowerCase()}`),
  navigationItems: [
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
  ],
}));

// Mock components that might have complex dependencies
vi.mock("@/components/Dashboard/StatsGrid", () => ({
  default: () => <div data-testid="stats-grid">Stats Grid</div>,
}));

vi.mock("@/components/Dashboard/LocationSelector", () => ({
  default: () => <div data-testid="location-selector">Location Selector</div>,
}));

vi.mock("@/components/Dashboard/SalesChart", () => ({
  default: () => <div data-testid="sales-chart">Sales Chart</div>,
}));

vi.mock("@/components/Dashboard/RecentActivity", () => ({
  default: () => <div data-testid="recent-activity">Recent Activity</div>,
}));

vi.mock("@/components/Dashboard/PerformanceMetrics", () => ({
  default: () => (
    <div data-testid="performance-metrics">Performance Metrics</div>
  ),
}));

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the app without crashing", async () => {
    render(<App />);

    // Should render without throwing errors
    expect(document.body).toBeInTheDocument();
  });

  it("renders dashboard by default", async () => {
    render(<App />);

    // Wait for async components to load
    await screen.findByText("Analytics Overview");

    expect(screen.getByText("Analytics Overview")).toBeInTheDocument();
  });

  it("handles routing correctly", async () => {
    // Test that the router is set up correctly
    render(<App />);

    // The app should render without navigation errors
    expect(
      document.querySelector('[data-testid="stats-grid"]')
    ).toBeInTheDocument();
  });
});
