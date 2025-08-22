import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../test-utils";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
// Test data for e2e testing
const testUser = {
  id: "test1",
  email: "test@example.com",
  full_name: "Test User",
  location: "Flatiron" as const,
  is_admin: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

const testSalesRecord = {
  id: "test1",
  location: "Flatiron" as const,
  date: "2023-12-01",
  daily_sales: 5000,
  treatments_count: 25,
  notes: "Test record",
  created_at: "2023-12-01T00:00:00Z",
  updated_at: "2023-12-01T00:00:00Z",
};

const testNote = {
  id: "test1",
  location: "Flatiron" as const,
  title: "Test Note",
  content: "This is a test note",
  priority: "medium" as const,
  visible_until: "2024-01-01",
  created_date: "2023-12-01T00:00:00Z",
  updated_date: "2023-12-01T00:00:00Z",
};

// Mock all the services
vi.mock("@/services/entities", () => ({
  UserEntity: {
    me: vi.fn().mockResolvedValue(testUser),
    logout: vi.fn().mockResolvedValue(undefined),
    list: vi.fn().mockResolvedValue([testUser]),
    create: vi.fn().mockResolvedValue(testUser),
    update: vi.fn().mockResolvedValue(testUser),
    delete: vi.fn().mockResolvedValue(undefined),
  },
  SalesRecordEntity: {
    list: vi.fn().mockResolvedValue([testSalesRecord]),
    create: vi.fn().mockResolvedValue(testSalesRecord),
    update: vi.fn().mockResolvedValue(testSalesRecord),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(testSalesRecord),
  },
  NoteEntity: {
    list: vi.fn().mockResolvedValue([testNote]),
    create: vi.fn().mockResolvedValue(testNote),
    update: vi.fn().mockResolvedValue(testNote),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(testNote),
  },
  AuditLogEntity: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({}),
  },
}));

// Mock routing utilities
vi.mock("@/utils/routing", () => ({
  createPageUrl: (pageName: string) =>
    `/${pageName
      .toLowerCase()
      .replace(/([A-Z])/g, "-$1")
      .slice(1)}`,
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
    {
      title: "Notes",
      url: "/notes",
      icon: "FileText",
      adminOnly: false,
    },
  ],
}));

// Mock complex components to focus on integration
vi.mock("@/components/Dashboard/StatsGrid", () => ({
  default: ({ stats }: any) => (
    <div data-testid="stats-grid">
      <div>Today: ${stats?.todaySales || 0}</div>
      <div>Week: ${stats?.weekSales || 0}</div>
    </div>
  ),
}));

vi.mock("@/components/Dashboard/LocationSelector", () => ({
  default: ({ selectedLocation, onLocationChange }: any) => (
    <select
      data-testid="location-selector"
      value={selectedLocation}
      onChange={(e) => onLocationChange(e.target.value)}
    >
      <option value="all">All Locations</option>
      <option value="Flatiron">Flatiron</option>
    </select>
  ),
}));

vi.mock("@/components/Dashboard/SalesChart", () => ({
  default: ({ salesData, timeframe }: any) => (
    <div data-testid="sales-chart">
      <div>Chart for {timeframe}</div>
      <div>Records: {salesData?.length || 0}</div>
    </div>
  ),
}));

vi.mock("@/components/Dashboard/RecentActivity", () => ({
  default: ({ salesData }: any) => (
    <div data-testid="recent-activity">
      Recent Activity: {salesData?.length || 0} items
    </div>
  ),
}));

vi.mock("@/components/Dashboard/PerformanceMetrics", () => ({
  default: () => (
    <div data-testid="performance-metrics">Performance Metrics</div>
  ),
}));

describe("End-to-End Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders complete dashboard with all components", async () => {
    render(<App />);

    // Wait for the dashboard to load
    await waitFor(
      () => {
        expect(
          screen.getByText(/Analytics Overview|Location Dashboard/)
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Check that all major components are rendered
    expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
    expect(screen.getByTestId("sales-chart")).toBeInTheDocument();
    expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
    expect(screen.getByTestId("performance-metrics")).toBeInTheDocument();
  });

  it("displays user-specific content for non-admin users", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Flatiron Dashboard/)).toBeInTheDocument();
    });

    // Non-admin users should not see location selector
    expect(screen.queryByTestId("location-selector")).not.toBeInTheDocument();
  });

  it("displays admin content for admin users", async () => {
    // Mock admin user
    const mockAdminUser = { ...testUser, is_admin: true };
    const mockServices = (await vi.importMock("@/services/entities")) as any;
    vi.mocked(mockServices.UserEntity.me).mockResolvedValueOnce(mockAdminUser);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Analytics Overview")).toBeInTheDocument();
    });

    // Admin users should see location selector
    expect(screen.getByTestId("location-selector")).toBeInTheDocument();
  });

  it("handles data loading and display correctly", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
    });

    // Check that stats are displayed
    expect(screen.getByText(/Today: \$/)).toBeInTheDocument();
    expect(screen.getByText(/Week: \$/)).toBeInTheDocument();

    // Check that chart shows data
    expect(screen.getByText("Records: 1")).toBeInTheDocument();

    // Check that recent activity shows data
    expect(screen.getByText("Recent Activity: 1 items")).toBeInTheDocument();
  });

  it("handles loading states correctly", async () => {
    // Mock delayed response
    const mockServices = (await vi.importMock("@/services/entities")) as any;
    vi.mocked(mockServices.UserEntity.me).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(testUser), 100))
    );

    render(<App />);

    // Should show loading state initially
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();

    // Should resolve to dashboard
    await waitFor(() => {
      expect(
        screen.getByText(/Analytics Overview|Location Dashboard/)
      ).toBeInTheDocument();
    });

    // Loading spinner should be gone
    expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
  });

  it("handles authentication errors gracefully", async () => {
    // Mock authentication failure
    const mockServices = (await vi.importMock("@/services/entities")) as any;
    vi.mocked(mockServices.UserEntity.me).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    render(<App />);

    await waitFor(() => {
      // Should render the app container even without authentication
      expect(document.querySelector(".min-h-screen")).toBeInTheDocument();
    });

    // Should not show authenticated content
    expect(screen.queryByText("Analytics Overview")).not.toBeInTheDocument();
  });

  it("integrates with routing system correctly", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should render without routing errors
    await waitFor(() => {
      expect(
        screen.getByText(/Analytics Overview|Location Dashboard/)
      ).toBeInTheDocument();
    });

    // Should have proper URL structure
    expect(window.location.pathname).toBe("/");
  });

  it("maintains consistent state across components", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
    });

    // All components should receive the same sales data
    const chartComponent = screen.getByTestId("sales-chart");
    const activityComponent = screen.getByTestId("recent-activity");

    expect(chartComponent).toHaveTextContent("Records: 1");
    expect(activityComponent).toHaveTextContent("Recent Activity: 1 items");
  });
});
