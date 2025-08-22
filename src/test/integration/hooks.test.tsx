import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../../hooks/useAuth";
import { useSalesData } from "../../hooks/useSalesData";
import { mockServices } from "../test-utils";

// Test data for hooks testing
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

// Mock the services
vi.mock("@/services/entities", () => mockServices);

describe("Custom Hooks Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useAuth", () => {
    it("loads user data on mount", async () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(testUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.userLocation).toBe("Flatiron");
    });

    it("handles authentication errors", async () => {
      mockServices.UserEntity.me.mockRejectedValueOnce(
        new Error("Not authenticated")
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe("Not authenticated");
    });

    it("provides logout functionality", async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.logout();

      expect(mockServices.UserEntity.logout).toHaveBeenCalled();
      expect(result.current.user).toBe(null);
    });
  });

  describe("useSalesData", () => {
    it("loads sales data with default options", async () => {
      const { result } = renderHook(() => useSalesData());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.salesData).toEqual([testSalesRecord]);
      expect(result.current.stats).toBeDefined();
      expect(result.current.stats.todaySales).toBeDefined();
    });

    it("filters data by location for non-admin users", async () => {
      const { result } = renderHook(() =>
        useSalesData({
          selectedLocation: "Midtown",
          userLocation: "Flatiron",
          isAdmin: false,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockServices.SalesRecordEntity.list).toHaveBeenCalled();
    });

    it("provides CRUD operations", async () => {
      const { result } = renderHook(() => useSalesData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecord = {
        location: "Flatiron" as const,
        date: "2023-12-02",
        daily_sales: 2000,
      };

      await result.current.createSalesRecord(newRecord);
      expect(mockServices.SalesRecordEntity.create).toHaveBeenCalledWith(
        newRecord
      );

      await result.current.updateSalesRecord("1", { daily_sales: 3000 });
      expect(mockServices.SalesRecordEntity.update).toHaveBeenCalledWith("1", {
        daily_sales: 3000,
      });

      await result.current.deleteSalesRecord("1");
      expect(mockServices.SalesRecordEntity.delete).toHaveBeenCalledWith("1");
    });
  });
});
