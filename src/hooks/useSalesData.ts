import { useState, useEffect } from "react";
import type { SalesRecord } from "@/types/entities";
import { SalesRecordEntity } from "@/services/entities";
import {
  filterSalesByLocation,
  calculateSalesStats,
  type SalesStats,
} from "@/utils/salesUtils";
import type { TimeframeType } from "@/utils/dateUtils";

interface UseSalesDataOptions {
  selectedLocation?: string;
  userLocation?: string;
  isAdmin?: boolean;
  timeframe?: TimeframeType;
}

export function useSalesData(options: UseSalesDataOptions = {}) {
  const {
    selectedLocation = "all",
    userLocation,
    isAdmin = false,
    timeframe = "7days",
  } = options;

  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSalesData();
  }, [selectedLocation]);

  const loadSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const allSales = await SalesRecordEntity.list();
      const filteredSales = filterSalesByLocation(
        allSales,
        selectedLocation,
        userLocation,
        isAdmin
      );
      setSalesData(filteredSales);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sales data"
      );
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const stats: SalesStats = calculateSalesStats(salesData, timeframe);

  const createSalesRecord = async (
    data: Omit<SalesRecord, "id" | "created_at" | "updated_at">
  ) => {
    try {
      await SalesRecordEntity.create(data);
      await loadSalesData(); // Refresh data
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create sales record"
      );
    }
  };

  const updateSalesRecord = async (id: string, data: Partial<SalesRecord>) => {
    try {
      await SalesRecordEntity.update(id, data);
      await loadSalesData(); // Refresh data
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update sales record"
      );
    }
  };

  const deleteSalesRecord = async (id: string) => {
    try {
      await SalesRecordEntity.delete(id);
      await loadSalesData(); // Refresh data
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete sales record"
      );
    }
  };

  return {
    salesData,
    stats,
    loading,
    error,
    refetch: loadSalesData,
    createSalesRecord,
    updateSalesRecord,
    deleteSalesRecord,
  };
}
