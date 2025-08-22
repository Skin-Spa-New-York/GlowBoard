import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import type { SalesRecord } from "@/types/entities";
import { format, isToday, isYesterday } from "date-fns";

interface LeaderboardProps {
	salesData: SalesRecord[];
	showAllTime?: boolean;
}

interface LeaderboardEntry {
	location: string;
	sales: number;
	treatments: number;
	date: string;
	rank: number;
}

export default function Leaderboard({
	salesData,
	showAllTime = false,
}: LeaderboardProps) {
	// Get today's and yesterday's data
	const todayData = salesData.filter((record) =>
		isToday(new Date(record.date))
	);
	const yesterdayData = salesData.filter((record) =>
		isYesterday(new Date(record.date))
	);

	// Use today's data if available, otherwise yesterday's
	const targetData = todayData.length > 0 ? todayData : yesterdayData;
	const isShowingToday = todayData.length > 0;

	// Create leaderboard entries
	const leaderboardEntries: LeaderboardEntry[] = targetData
		.map((record) => ({
			location: record.location,
			sales: record.daily_sales,
			treatments: record.treatments_count || 0,
			date: record.date,
			rank: 0,
		}))
		.sort((a, b) => b.sales - a.sales)
		.slice(0, 3)
		.map((entry, index) => ({
			...entry,
			rank: index + 1,
		}));

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Trophy className="w-6 h-6 text-yellow-400" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-300" />;
			case 3:
				return <Award className="w-6 h-6 text-amber-600" />;
			default:
				return null;
		}
	};

	const getRankColors = (rank: number) => {
		switch (rank) {
			case 1:
				return {
					bg: "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20",
					border: "border-yellow-500/30",
					text: "text-yellow-400",
				};
			case 2:
				return {
					bg: "bg-gradient-to-r from-gray-400/20 to-gray-500/20",
					border: "border-gray-400/30",
					text: "text-gray-300",
				};
			case 3:
				return {
					bg: "bg-gradient-to-r from-amber-600/20 to-amber-700/20",
					border: "border-amber-600/30",
					text: "text-amber-600",
				};
			default:
				return {
					bg: "bg-[#1a1a1a]",
					border: "border-[#bc9a64]/20",
					text: "text-white",
				};
		}
	};

	if (leaderboardEntries.length === 0) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<Trophy className="w-5 h-5 text-[#bc9a64]" />
						Daily Leaderboard
					</CardTitle>
					<p className="text-sm text-gray-400">
						{isShowingToday ? "Today's" : "Yesterday's"} Top Performers
					</p>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400">
							No sales data available for{" "}
							{isShowingToday ? "today" : "yesterday"}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Trophy className="w-5 h-5 text-[#bc9a64]" />
					Daily Leaderboard
				</CardTitle>
				<p className="text-sm text-gray-400">
					{isShowingToday ? "Today's" : "Yesterday's"} Top Performers
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{leaderboardEntries.map((entry) => {
					const colors = getRankColors(entry.rank);
					return (
						<div
							key={`${entry.location}-${entry.rank}`}
							className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover-lift transition-all duration-200`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-10 h-10">
										{getRankIcon(entry.rank)}
									</div>
									<div>
										<h3 className={`font-semibold ${colors.text}`}>
											{entry.location}
										</h3>
										<p className="text-sm text-gray-400">
											{entry.treatments} treatments
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className={`text-xl font-bold ${colors.text}`}>
										${entry.sales.toLocaleString()}
									</p>
									<p className="text-xs text-gray-500">#{entry.rank}</p>
								</div>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
