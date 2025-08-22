import type { SalesRecord } from "@/types/entities";
import { getDateRange, isDateInRange, type TimeframeType } from "./dateUtils";

export interface SalesStats {
  todaySales: number;
  yesterdaySales: number;
  weekSales: number;
  monthSales: number;
  currentPeriodSales: number;
  lastYearPeriodSales: number;
  growth: number; // Day-over-day growth
  yoyGrowth: number; // Year-over-year growth
  totalTreatments: number;
  avgDaily: number;
  timeframeLabel: string;
}

/**
 * Calculate comprehensive sales statistics
 */
export function calculateSalesStats(
  salesData: SalesRecord[],
  timeframe: TimeframeType = "7days"
): SalesStats {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // Get date ranges
  const dateRange = getDateRange(timeframe);

  // Daily stats
  const todaySales = filterSalesByDate(salesData, today, today);
  const yesterdaySales = filterSalesByDate(salesData, yesterday, yesterday);

  // Week and month stats (preserved for existing functionality)
  const weekStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const weekSales = filterSalesByDate(salesData, weekStart, today);
  const monthSales = filterSalesByDate(salesData, monthStart, monthEnd);

  // Period-based stats for current and year-over-year comparison
  const currentPeriodSales = filterSalesByDate(
    salesData,
    dateRange.start,
    dateRange.end
  );
  const lastYearPeriodSales = filterSalesByDate(
    salesData,
    dateRange.prevStart,
    dateRange.prevEnd
  );

  // Calculate growth rates
  const growth =
    yesterdaySales > 0
      ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
      : 0;
  const yoyGrowth =
    lastYearPeriodSales !== 0
      ? ((currentPeriodSales - lastYearPeriodSales) /
          Math.abs(lastYearPeriodSales)) *
        100
      : currentPeriodSales > 0
      ? Infinity
      : 0;

  // Other aggregate stats
  const totalTreatments = salesData.reduce(
    (sum, record) => sum + (record.treatments_count || 0),
    0
  );
  const avgDaily =
    salesData.length > 0
      ? salesData.reduce((sum, record) => sum + record.daily_sales, 0) /
        salesData.length
      : 0;

  return {
    todaySales,
    yesterdaySales,
    weekSales,
    monthSales,
    currentPeriodSales,
    lastYearPeriodSales,
    growth,
    yoyGrowth,
    totalTreatments,
    avgDaily,
    timeframeLabel: getTimeframeLabel(timeframe),
  };
}

/**
 * Filter sales records by date range and sum daily sales
 */
function filterSalesByDate(
  salesData: SalesRecord[],
  startDate: Date,
  endDate: Date
): number {
  return salesData
    .filter((record) => {
      const recordDate = new Date(record.date);
      return isDateInRange(recordDate, startDate, endDate);
    })
    .reduce((sum, record) => sum + record.daily_sales, 0);
}

/**
 * Get timeframe label for display
 */
function getTimeframeLabel(timeframe: TimeframeType): string {
  switch (timeframe) {
    case "today":
      return "Today";
    case "7days":
      return "Last 7 Days";
    case "30days":
      return "Last 30 Days";
    case "4weeks":
      return "Last 4 Weeks";
    case "month":
      return "This Month";
    case "quarter":
      return "This Quarter";
    case "halfyear":
      return "Last 6 Months";
    case "year":
      return "This Year";
    case "custom":
      return "Custom Period";
    default:
      return "Current Period";
  }
}

/**
 * Filter sales records by location
 */
export function filterSalesByLocation(
  salesData: SalesRecord[],
  location: string,
  userLocation?: string,
  isAdmin: boolean = false
): SalesRecord[] {
  if (location === "all" && isAdmin) {
    return salesData;
  }

  const targetLocation = location !== "all" ? location : userLocation;
  return salesData.filter((record) => record.location === targetLocation);
}
