import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, Users } from "lucide-react";
import type { SalesRecord } from "@/types/entities";

interface PerformanceMetricsProps {
	salesData: SalesRecord[];
	selectedLocation: string;
}

export default function PerformanceMetrics({
	salesData,
	selectedLocation,
}: PerformanceMetricsProps) {
	// Calculate metrics
	const totalSales = salesData.reduce(
		(sum, record) => sum + record.daily_sales,
		0
	);
	const totalTreatments = salesData.reduce(
		(sum, record) => sum + (record.treatments_count || 0),
		0
	);
	const avgSalesPerTreatment =
		totalTreatments > 0 ? totalSales / totalTreatments : 0;
	const avgDailySales =
		salesData.length > 0 ? totalSales / salesData.length : 0;

	const metrics = [
		{
			title: "Avg per Treatment",
			value: `$${avgSalesPerTreatment.toFixed(0)}`,
			icon: Target,
			color: "text-blue-400",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Daily Average",
			value: `$${avgDailySales.toLocaleString()}`,
			icon: TrendingUp,
			color: "text-green-400",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Total Treatments",
			value: totalTreatments.toLocaleString(),
			icon: Users,
			color: "text-purple-400",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Performance Score",
			value: "A+",
			icon: Award,
			color: "text-[#bc9a64]",
			bgColor: "bg-[#bc9a64]/10",
		},
	];

	return (
		<div className="space-y-6">
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white">Performance Metrics</CardTitle>
					{selectedLocation !== "all" && (
						<p className="text-sm text-gray-400">{selectedLocation}</p>
					)}
				</CardHeader>
				<CardContent className="space-y-4">
					{metrics.map((metric, index) => (
						<div
							key={index}
							className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
									<metric.icon className={`w-5 h-5 ${metric.color}`} />
								</div>
								<div>
									<p className="text-sm text-gray-400">{metric.title}</p>
									<p className="font-semibold text-white">{metric.value}</p>
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white">Summary Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-400">Total Records</span>
							<span className="text-white font-medium">{salesData.length}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Total Revenue</span>
							<span className="text-white font-medium">
								${totalSales.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Active Locations</span>
							<span className="text-white font-medium">
								{selectedLocation === "all"
									? new Set(salesData.map((r) => r.location)).size
									: 1}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Avg per Day</span>
							<span className="text-white font-medium">
								${avgDailySales.toLocaleString()}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
