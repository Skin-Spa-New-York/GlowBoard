import { describe, it, expect } from "vitest";
import {
  getDateRange,
  isDateInRange,
  formatDateForTimeframe,
  getTimeframeLabel,
} from "../../utils/dateUtils";
import {
  calculateSalesStats,
  filterSalesByLocation,
} from "../../utils/salesUtils";
import type { SalesRecord } from "../../types/entities";

describe("Utility Functions Integration", () => {
  // Minimal test data for utility function testing only
  const testSalesData: SalesRecord[] = [
    {
      id: "test1",
      location: "Flatiron",
      date: "2023-12-01",
      daily_sales: 1000,
      treatments_count: 10,
    },
    {
      id: "test2",
      location: "Midtown",
      date: "2023-12-01",
      daily_sales: 1500,
      treatments_count: 15,
    },
  ];

  describe("Date Utilities", () => {
    it("generates correct date ranges for different timeframes", () => {
      const range7days = getDateRange("7days");
      expect(range7days.start).toBeInstanceOf(Date);
      expect(range7days.end).toBeInstanceOf(Date);
      expect(range7days.prevStart).toBeInstanceOf(Date);
      expect(range7days.prevEnd).toBeInstanceOf(Date);

      const rangeMonth = getDateRange("month");
      expect(rangeMonth.start).toBeInstanceOf(Date);
      expect(rangeMonth.end).toBeInstanceOf(Date);
    });

    it("checks if date is in range correctly", () => {
      const date = new Date("2023-12-01");
      const start = new Date("2023-11-30");
      const end = new Date("2023-12-02");

      expect(isDateInRange(date, start, end)).toBe(true);

      const outsideDate = new Date("2023-12-03");
      expect(isDateInRange(outsideDate, start, end)).toBe(false);
    });

    it("formats dates correctly for different timeframes", () => {
      const date = new Date("2023-12-01");

      expect(formatDateForTimeframe(date, "7days")).toMatch(/Dec \d+/);
      expect(formatDateForTimeframe(date, "month")).toMatch(/Dec \d{4}/);
    });

    it("provides correct timeframe labels", () => {
      expect(getTimeframeLabel("7days")).toBe("Last 7 Days");
      expect(getTimeframeLabel("month")).toBe("This Month");
      expect(getTimeframeLabel("year")).toBe("This Year");
    });
  });

  describe("Sales Utilities", () => {
    it("calculates sales statistics correctly", () => {
      const stats = calculateSalesStats(testSalesData, "7days");

      expect(stats).toHaveProperty("todaySales");
      expect(stats).toHaveProperty("weekSales");
      expect(stats).toHaveProperty("monthSales");
      expect(stats).toHaveProperty("totalTreatments");
      expect(stats).toHaveProperty("avgDaily");
      expect(stats).toHaveProperty("growth");
      expect(stats).toHaveProperty("yoyGrowth");

      expect(typeof stats.todaySales).toBe("number");
      expect(typeof stats.totalTreatments).toBe("number");
      expect(typeof stats.avgDaily).toBe("number");
    });

    it("filters sales by location correctly", () => {
      // Test admin user seeing all locations
      const allData = filterSalesByLocation(
        testSalesData,
        "all",
        undefined,
        true
      );
      expect(allData).toHaveLength(2);

      // Test specific location filter
      const flatironData = filterSalesByLocation(
        testSalesData,
        "Flatiron",
        undefined,
        true
      );
      expect(flatironData).toHaveLength(1);
      expect(
        flatironData.every((record) => record.location === "Flatiron")
      ).toBe(true);

      // Test non-admin user with user location
      const userLocationData = filterSalesByLocation(
        testSalesData,
        "all",
        "Midtown",
        false
      );
      expect(userLocationData).toHaveLength(1);
      expect(userLocationData[0].location).toBe("Midtown");
    });

    it("handles empty sales data gracefully", () => {
      const stats = calculateSalesStats([], "7days");

      expect(stats.todaySales).toBe(0);
      expect(stats.totalTreatments).toBe(0);
      expect(stats.avgDaily).toBe(0);
    });

    it("calculates growth rates correctly", () => {
      const testGrowthData: SalesRecord[] = [
        {
          id: "today",
          location: "Flatiron",
          date: new Date().toISOString().split("T")[0], // Today
          daily_sales: 1000,
          treatments_count: 10,
        },
        {
          id: "yesterday",
          location: "Flatiron",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // Yesterday
          daily_sales: 800,
          treatments_count: 8,
        },
      ];

      const stats = calculateSalesStats(testGrowthData, "7days");

      // Growth should be positive (1000 vs 800 = 25% growth)
      expect(stats.growth).toBeGreaterThan(0);
    });
  });
});
