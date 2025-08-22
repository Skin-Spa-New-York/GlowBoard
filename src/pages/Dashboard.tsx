import { useState } from "react";
import { format } from "date-fns";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSalesData } from "@/hooks/useSalesData";
import { useLocationGoals } from "@/hooks/useLocationGoals";
import { LOCATIONS } from "@/types/entities";
import type { TimeframeType } from "@/utils/dateUtils";

import LocationSelector from "@/components/Dashboard/LocationSelector";
import LazyChart from "@/components/Dashboard/LazyChart";
import PerformanceMetrics from "@/components/Dashboard/PerformanceMetrics";
import ProductBreakdown from "@/components/Dashboard/ProductBreakdown";
import ServiceBreakdown from "@/components/Dashboard/ServiceBreakdown";
import TopSellers from "@/components/Dashboard/TopSellers";
import GoalTracker from "@/components/Dashboard/GoalTracker";
import "../styles/print.css";

export default function Dashboard() {
	const [selectedLocation, setSelectedLocation] = useState("all");
	const [timeframe, setTimeframe] = useState<TimeframeType>("yesterday");

	const { user, loading: authLoading } = useAuth();
	const {
		salesData,
		stats,
		loading: dataLoading,
	} = useSalesData({
		selectedLocation,
		userLocation: user?.location,
		isAdmin: user?.is_admin,
		timeframe,
	});
	const { locationGoals, loading: goalsLoading } = useLocationGoals();

	const loading = authLoading || dataLoading;

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0e0e0e] text-white p-6">
			{/* Print Header - Only visible when printing */}
			<div className="print-header hidden print:block">
				<h1 className="text-2xl font-bold">
					{user?.is_admin
						? "Analytics Overview"
						: `${user?.location || "Location"} Dashboard`}
				</h1>
				<p className="print-date">
					Generated on {format(new Date(), "EEEE, MMMM d, yyyy 'at' h:mm a")}
				</p>
			</div>

			<div className="max-w-7xl mx-auto space-y-8 print-content">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print-hide">
					<div>
						<h1 className="text-3xl font-bold mb-2">
							{user?.is_admin
								? "Analytics Overview"
								: `${user?.location || "Location"} Dashboard`}
						</h1>
						<p className="text-gray-400">
							{format(new Date(), "EEEE, MMMM d, yyyy")}
						</p>
					</div>

					<div className="flex items-center gap-4">
						{user?.is_admin && (
							<LocationSelector
								selectedLocation={selectedLocation}
								onLocationChange={setSelectedLocation}
								locations={LOCATIONS}
							/>
						)}
						{user?.is_admin && (
							<Link
								to="/settings"
								className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors duration-200"
								title="Open Settings">
								<Settings className="h-6 w-6 text-gray-400 hover:text-[#bc9a64]" />
							</Link>
						)}
					</div>
				</div>

				{/* Sales Performance Chart - Full Width */}
				<div className="chart-container no-break">
					<LazyChart
						salesData={salesData}
						timeframe={timeframe}
						onTimeframeChange={setTimeframe}
					/>
				</div>

				{/* Goal Tracker */}
				<div className="no-break">
					<GoalTracker
						salesData={salesData}
						locationGoals={locationGoals}
						currentLocation={
							selectedLocation === "all" ? undefined : (selectedLocation as any)
						}
					/>
				</div>

				{/* Metrics Grid */}
				<div className="grid lg:grid-cols-3 gap-8 no-break">
					<PerformanceMetrics
						salesData={salesData}
						selectedLocation={selectedLocation}
					/>
					<ProductBreakdown
						salesData={salesData}
						selectedLocation={selectedLocation}
					/>
					<ServiceBreakdown
						salesData={salesData}
						selectedLocation={selectedLocation}
					/>
				</div>

				{/* Top Sellers */}
				<div className="no-break">
					<TopSellers
						salesData={salesData}
						selectedLocation={selectedLocation}
					/>
				</div>
			</div>
		</div>
	);
}
