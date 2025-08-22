import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Crown, Star, Award } from "lucide-react";
import type { SalesRecord, SellerPerformance } from "@/types/entities";

interface TopSellersProps {
	salesData: SalesRecord[];
	selectedLocation: string;
}

export default function TopSellers({
	salesData,
	selectedLocation,
}: TopSellersProps) {
	// Aggregate seller performance across all records
	const sellerMap = new Map<
		string,
		{ sales: number; locations: Set<string> }
	>();

	salesData.forEach((record) => {
		if (record.top_sellers) {
			record.top_sellers.forEach((seller) => {
				const key = seller.name;
				if (sellerMap.has(key)) {
					const existing = sellerMap.get(key)!;
					existing.sales += seller.sales;
					existing.locations.add(seller.location);
				} else {
					sellerMap.set(key, {
						sales: seller.sales,
						locations: new Set([seller.location]),
					});
				}
			});
		}
	});

	// Convert to array and sort by sales
	const topSellers = Array.from(sellerMap.entries())
		.map(([name, data]) => ({
			name,
			sales: data.sales,
			locations: Array.from(data.locations),
			locationCount: data.locations.size,
		}))
		.sort((a, b) => b.sales - a.sales)
		.slice(0, 10); // Top 10 sellers

	const getRankIcon = (index: number) => {
		switch (index) {
			case 0:
				return <Crown className="w-5 h-5 text-yellow-400" />;
			case 1:
				return <Star className="w-5 h-5 text-gray-300" />;
			case 2:
				return <Award className="w-5 h-5 text-amber-600" />;
			default:
				return <User className="w-5 h-5 text-gray-400" />;
		}
	};

	const getRankColors = (index: number) => {
		switch (index) {
			case 0:
				return "text-yellow-400 bg-yellow-500/10";
			case 1:
				return "text-gray-300 bg-gray-400/10";
			case 2:
				return "text-amber-600 bg-amber-600/10";
			default:
				return "text-white bg-[#2a2a2a]/50";
		}
	};

	if (topSellers.length === 0) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<User className="w-5 h-5 text-[#bc9a64]" />
						Top Sellers
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400">No seller data available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const totalSales = topSellers.reduce((sum, seller) => sum + seller.sales, 0);

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<User className="w-5 h-5 text-[#bc9a64]" />
					Top Sellers
				</CardTitle>
				<p className="text-sm text-gray-400">Individual Performance Rankings</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{topSellers.map((seller, index) => {
					const percentage =
						totalSales > 0 ? (seller.sales / totalSales) * 100 : 0;

					return (
						<div
							key={seller.name}
							className={`flex items-center justify-between p-3 rounded-lg hover-lift transition-all duration-200 ${getRankColors(
								index
							)}`}>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-8 h-8">
									{getRankIcon(index)}
								</div>
								<div>
									<p className="font-semibold">{seller.name}</p>
									<p className="text-xs text-gray-400">
										{seller.locationCount === 1
											? seller.locations[0]
											: `${seller.locationCount} locations`}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-bold">${seller.sales.toLocaleString()}</p>
								<p className="text-xs text-gray-400">
									{percentage.toFixed(1)}%
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
