import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Gift, Smartphone, Heart, ShoppingBag } from "lucide-react";
import type {
	SalesRecord,
	ProductBreakdown as ProductBreakdownType,
} from "@/types/entities";

interface ProductBreakdownProps {
	salesData: SalesRecord[];
	selectedLocation: string;
}

export default function ProductBreakdown({
	salesData,
	selectedLocation,
}: ProductBreakdownProps) {
	// Aggregate product data
	const aggregateProducts = salesData.reduce(
		(acc, record) => {
			if (record.product_breakdown) {
				acc.skincare += record.product_breakdown.skincare || 0;
				acc.supplements += record.product_breakdown.supplements || 0;
				acc.devices += record.product_breakdown.devices || 0;
				acc.gift_cards += record.product_breakdown.gift_cards || 0;
				acc.other += record.product_breakdown.other || 0;
			}
			return acc;
		},
		{ skincare: 0, supplements: 0, devices: 0, gift_cards: 0, other: 0 }
	);

	const totalProductSales = Object.values(aggregateProducts).reduce(
		(sum, val) => sum + val,
		0
	);

	const productItems = [
		{
			name: "Skincare",
			value: aggregateProducts.skincare,
			icon: Heart,
			color: "text-pink-400",
			bgColor: "bg-pink-500/10",
		},
		{
			name: "Supplements",
			value: aggregateProducts.supplements,
			icon: Package,
			color: "text-green-400",
			bgColor: "bg-green-500/10",
		},
		{
			name: "Devices",
			value: aggregateProducts.devices,
			icon: Smartphone,
			color: "text-blue-400",
			bgColor: "bg-blue-500/10",
		},
		{
			name: "Gift Cards",
			value: aggregateProducts.gift_cards,
			icon: Gift,
			color: "text-purple-400",
			bgColor: "bg-purple-500/10",
		},
		{
			name: "Other",
			value: aggregateProducts.other,
			icon: ShoppingBag,
			color: "text-gray-400",
			bgColor: "bg-gray-500/10",
		},
	].filter((item) => item.value > 0);

	if (totalProductSales === 0) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<Package className="w-5 h-5 text-[#bc9a64]" />
						Product Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400">No product sales data available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Package className="w-5 h-5 text-[#bc9a64]" />
					Product Breakdown
				</CardTitle>
				<p className="text-sm text-gray-400">
					Total: ${totalProductSales.toLocaleString()}
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{productItems.map((item) => {
					const percentage =
						totalProductSales > 0 ? (item.value / totalProductSales) * 100 : 0;
					return (
						<div
							key={item.name}
							className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div
										className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
										<item.icon className={`w-4 h-4 ${item.color}`} />
									</div>
									<span className="text-white font-medium">{item.name}</span>
								</div>
								<div className="text-right">
									<p className="text-white font-semibold">
										${item.value.toLocaleString()}
									</p>
									<p className="text-xs text-gray-400">
										{percentage.toFixed(1)}%
									</p>
								</div>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className={`h-2 rounded-full ${item.color
										.replace("text-", "bg-")
										.replace("-400", "-500")}`}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
