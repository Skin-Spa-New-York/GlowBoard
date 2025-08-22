import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Target,
	TrendingUp,
	Calendar,
	DollarSign,
	Activity,
} from "lucide-react";
import { SalesRecord, Location } from "@/types/entities";

interface LocationGoals {
	location: Location;
	salesGoal: number;
	retailGoal: number;
}

interface GoalTrackerProps {
	salesData: SalesRecord[];
	locationGoals?: LocationGoals[];
	currentLocation?: Location;
}

export default function GoalTracker({
	salesData,
	locationGoals,
	currentLocation,
}: GoalTrackerProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());

	// Don't render if locationGoals is not loaded yet
	if (!locationGoals || !Array.isArray(locationGoals)) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardContent className="flex items-center justify-center py-8">
					<div className="text-gray-400">Loading goal progress...</div>
				</CardContent>
			</Card>
		);
	}

	// Get current month data
	const getCurrentMonthData = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		return salesData.filter((record) => {
			const recordDate = new Date(record.date);
			return (
				recordDate >= firstDay &&
				recordDate <= lastDay &&
				(!currentLocation || record.location === currentLocation)
			);
		});
	};

	const monthData = getCurrentMonthData();

	// Calculate totals
	const totalServiceSales = monthData.reduce((sum, record) => {
		return sum + (record.daily_service_sales || 0);
	}, 0);

	const totalRetailSales = monthData.reduce((sum, record) => {
		const retailSales = Object.values(record.retail_daily_sales || {}).reduce(
			(retailSum, amount) => retailSum + amount,
			0
		);
		return sum + retailSales;
	}, 0);

	const totalSales = totalServiceSales + totalRetailSales;

	// Get goals for current location or overall
	const getLocationGoals = () => {
		if (currentLocation) {
			const locationGoal = locationGoals?.find(
				(g) => g.location === currentLocation
			);
			return {
				serviceGoal: locationGoal?.salesGoal || 50000,
				retailGoal: locationGoal?.retailGoal || 25000,
				totalGoal:
					(locationGoal?.salesGoal || 50000) +
					(locationGoal?.retailGoal || 25000),
			};
		} else {
			// Sum all location goals
			const totalServiceGoal = Array.isArray(locationGoals)
				? locationGoals.reduce((sum, goal) => sum + goal.salesGoal, 0)
				: 250000;
			const totalRetailGoal = Array.isArray(locationGoals)
				? locationGoals.reduce((sum, goal) => sum + goal.retailGoal, 0)
				: 125000;
			return {
				serviceGoal: totalServiceGoal,
				retailGoal: totalRetailGoal,
				totalGoal: totalServiceGoal + totalRetailGoal,
			};
		}
	};

	const { serviceGoal, retailGoal, totalGoal } = getLocationGoals();

	// Calculate progress
	const totalProgressPercentage = Math.min((totalSales / totalGoal) * 100, 100);
	const serviceProgressPercentage = Math.min(
		(totalServiceSales / serviceGoal) * 100,
		100
	);
	const retailProgressPercentage = Math.min(
		(totalRetailSales / retailGoal) * 100,
		100
	);

	const remainingAmount = Math.max(totalGoal - totalSales, 0);
	const remainingServiceAmount = Math.max(serviceGoal - totalServiceSales, 0);
	const remainingRetailAmount = Math.max(retailGoal - totalRetailSales, 0);

	// Days calculations
	const today = new Date();
	const daysInMonth = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth() + 1,
		0
	).getDate();
	const currentDay = today.getDate();
	const daysRemaining = Math.max(daysInMonth - currentDay, 0);

	// Daily run rate needed
	const dailyRunRateNeeded =
		daysRemaining > 0 ? remainingAmount / daysRemaining : 0;

	// Current daily average
	const currentDailyAverage = currentDay > 0 ? totalSales / currentDay : 0;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getProgressColor = (percentage: number) => {
		if (percentage >= 90) return "text-green-400";
		if (percentage >= 70) return "text-[#bc9a64]";
		if (percentage >= 50) return "text-yellow-400";
		return "text-red-400";
	};

	const getProgressBarColor = (percentage: number) => {
		if (percentage >= 90) return "bg-green-500";
		if (percentage >= 70) return "bg-[#bc9a64]";
		if (percentage >= 50) return "bg-yellow-500";
		return "bg-red-500";
	};

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Target className="w-5 h-5 text-[#bc9a64]" />
						Monthly Goal Progress
					</div>
					<div className="text-sm text-gray-400 font-normal">
						{currentMonth.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Main Progress Display */}
					<div className="text-center space-y-4">
						<div className="space-y-2">
							<div
								className={`text-4xl font-bold ${getProgressColor(
									totalProgressPercentage
								)}`}>
								{totalProgressPercentage.toFixed(1)}%
							</div>
							<div className="text-gray-400 text-sm">to monthly goal</div>
						</div>

						{/* Total Progress Bar */}
						<div className="w-full bg-[#0e0e0e] rounded-full h-4 overflow-hidden">
							<div
								className={`h-full transition-all duration-500 ${getProgressBarColor(
									totalProgressPercentage
								)}`}
								style={{ width: `${totalProgressPercentage}%` }}
							/>
						</div>

						{/* Amount Display */}
						<div className="grid grid-cols-2 gap-4 text-center">
							<div>
								<div className="text-2xl font-bold text-[#bc9a64]">
									{formatCurrency(totalSales)}
								</div>
								<div className="text-gray-400 text-sm">Current Total</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-white">
									{formatCurrency(totalGoal)}
								</div>
								<div className="text-gray-400 text-sm">Total Goal</div>
							</div>
						</div>
					</div>

					{/* Service & Retail Breakdown */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Service Sales Progress */}
						<div className="bg-[#0e0e0e]/50 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-3">
								<Activity className="w-4 h-4 text-[#bc9a64]" />
								<span className="text-white font-medium">Service Sales</span>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-gray-400 text-sm">Progress</span>
									<span
										className={`font-semibold ${getProgressColor(
											serviceProgressPercentage
										)}`}>
										{serviceProgressPercentage.toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-[#1a1a1a] rounded-full h-2">
									<div
										className={`h-full transition-all duration-500 ${getProgressBarColor(
											serviceProgressPercentage
										)}`}
										style={{ width: `${serviceProgressPercentage}%` }}
									/>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-[#bc9a64]">
										{formatCurrency(totalServiceSales)}
									</span>
									<span className="text-gray-400">
										/ {formatCurrency(serviceGoal)}
									</span>
								</div>
							</div>
						</div>

						{/* Retail Sales Progress */}
						<div className="bg-[#0e0e0e]/50 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-3">
								<DollarSign className="w-4 h-4 text-[#bc9a64]" />
								<span className="text-white font-medium">Retail Sales</span>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-gray-400 text-sm">Progress</span>
									<span
										className={`font-semibold ${getProgressColor(
											retailProgressPercentage
										)}`}>
										{retailProgressPercentage.toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-[#1a1a1a] rounded-full h-2">
									<div
										className={`h-full transition-all duration-500 ${getProgressBarColor(
											retailProgressPercentage
										)}`}
										style={{ width: `${retailProgressPercentage}%` }}
									/>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-[#bc9a64]">
										{formatCurrency(totalRetailSales)}
									</span>
									<span className="text-gray-400">
										/ {formatCurrency(retailGoal)}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Detailed Metrics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-[#0e0e0e]/50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<DollarSign className="w-4 h-4 text-gray-400" />
								<span className="text-gray-400 text-sm">Remaining</span>
							</div>
							<div className="text-lg font-semibold text-white">
								{formatCurrency(remainingAmount)}
							</div>
						</div>

						<div className="bg-[#0e0e0e]/50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Calendar className="w-4 h-4 text-gray-400" />
								<span className="text-gray-400 text-sm">Days Left</span>
							</div>
							<div className="text-lg font-semibold text-white">
								{daysRemaining}
							</div>
						</div>

						<div className="bg-[#0e0e0e]/50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<TrendingUp className="w-4 h-4 text-gray-400" />
								<span className="text-gray-400 text-sm">Daily Needed</span>
							</div>
							<div className="text-lg font-semibold text-white">
								{formatCurrency(dailyRunRateNeeded)}
							</div>
						</div>
					</div>

					{/* Performance Indicator */}
					<div className="bg-[#0e0e0e]/30 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<span className="text-gray-400 text-sm">
								Current Daily Average
							</span>
							<span className="text-white font-semibold">
								{formatCurrency(currentDailyAverage)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-400 text-sm">Daily Target Needed</span>
							<span
								className={`font-semibold ${
									currentDailyAverage >= dailyRunRateNeeded
										? "text-green-400"
										: "text-red-400"
								}`}>
								{formatCurrency(dailyRunRateNeeded)}
							</span>
						</div>
						{currentDailyAverage > 0 && (
							<div className="mt-2 text-center">
								<span
									className={`text-sm ${
										currentDailyAverage >= dailyRunRateNeeded
											? "text-green-400"
											: "text-red-400"
									}`}>
									{currentDailyAverage >= dailyRunRateNeeded
										? "✓ On track to meet goal"
										: "⚠ Behind pace - need to increase daily sales"}
								</span>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
