import { lazy, Suspense } from "react";
import type { SalesRecord } from "@/types/entities";
import type { TimeframeType } from "@/utils/dateUtils";

// Lazy load the heavy chart component
const SalesChart = lazy(() => import("./SalesChart"));

interface LazyChartProps {
  salesData: SalesRecord[];
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
}

const ChartLoader = () => (
  <div className="bg-[#1a1a1a] border-[#bc9a64]/20 rounded-lg p-8">
    <div className="h-80 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading Chart...</p>
      </div>
    </div>
  </div>
);

export default function LazyChart(props: LazyChartProps) {
  return (
    <Suspense fallback={<ChartLoader />}>
      <SalesChart {...props} />
    </Suspense>
  );
}
