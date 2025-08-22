import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useSalesData } from "@/hooks/useSalesData";
import { LOCATIONS } from "@/types/entities";
import type { TimeframeType } from "@/utils/dateUtils";

import LocationSelector from "@/components/Dashboard/LocationSelector";
import RecentActivityComponent from "@/components/Dashboard/RecentActivity";

export default function RecentActivity() {
	const [selectedLocation, setSelectedLocation] = useState("all");
	const [timeframe, setTimeframe] = useState<TimeframeType>("last_30_days");

	const { user, loading: authLoading } = useAuth();
	const { salesData, loading: dataLoading } = useSalesData({
		selectedLocation,
		userLocation: user?.location,
		isAdmin: user?.is_admin,
		timeframe,
	});

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
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
					<div>
						<h1 className="text-3xl font-bold mb-2">Recent Activity</h1>
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
					</div>
				</div>

				{/* Recent Activity */}
				<RecentActivityComponent
					salesData={salesData}
					showLocation={user?.is_admin || selectedLocation === "all"}
				/>
			</div>
		</div>
	);
}
