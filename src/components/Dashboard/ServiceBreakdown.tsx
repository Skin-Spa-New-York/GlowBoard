import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Droplets, Sparkles, Calendar } from "lucide-react";
import type {
	SalesRecord,
	ServiceBreakdown as ServiceBreakdownType,
} from "@/types/entities";

interface ServiceBreakdownProps {
	salesData: SalesRecord[];
	selectedLocation: string;
}

export default function ServiceBreakdown({
	salesData,
	selectedLocation,
}: ServiceBreakdownProps) {
	// Aggregate service data
	const aggregateServices = salesData.reduce((acc, record) => {
		if (record.service_breakdown) {
			const services = record.service_breakdown;
			Object.keys(services).forEach((serviceKey) => {
				const service = services[serviceKey as keyof ServiceBreakdownType];
				if (
					service &&
					typeof service === "object" &&
					"appointments" in service &&
					"sales" in service
				) {
					if (!acc[serviceKey]) {
						acc[serviceKey] = { appointments: 0, sales: 0 };
					}
					acc[serviceKey].appointments += service.appointments;
					acc[serviceKey].sales += service.sales;
				}
			});
		}
		return acc;
	}, {} as Record<string, { appointments: number; sales: number }>);

	const serviceItems = [
		{ key: "botox", name: "Botox", icon: Zap, color: "text-blue-400" },
		{ key: "dysport", name: "Dysport", icon: Zap, color: "text-cyan-400" },
		{ key: "filler", name: "Filler", icon: Droplets, color: "text-pink-400" },
		{
			key: "sculptra",
			name: "Sculptra",
			icon: Sparkles,
			color: "text-purple-400",
		},
		{
			key: "laser_genesis",
			name: "Laser Genesis",
			icon: Zap,
			color: "text-red-400",
		},
		{
			key: "hydrafacial",
			name: "HydraFacial",
			icon: Droplets,
			color: "text-blue-300",
		},
		{
			key: "chemical_peel",
			name: "Chemical Peel",
			icon: Sparkles,
			color: "text-orange-400",
		},
		{
			key: "microneedling",
			name: "Microneedling",
			icon: Activity,
			color: "text-green-400",
		},
		{ key: "prp", name: "PRP", icon: Droplets, color: "text-yellow-400" },
		{
			key: "consultation",
			name: "Consultation",
			icon: Calendar,
			color: "text-gray-400",
		},
		{
			key: "other_services",
			name: "Other Services",
			icon: Activity,
			color: "text-indigo-400",
		},
	].filter(
		(item) =>
			aggregateServices[item.key] && aggregateServices[item.key].sales > 0
	);

	const totalServiceSales = Object.values(aggregateServices).reduce(
		(sum, service) => sum + service.sales,
		0
	);
	const totalAppointments = Object.values(aggregateServices).reduce(
		(sum, service) => sum + service.appointments,
		0
	);

	if (serviceItems.length === 0) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<Activity className="w-5 h-5 text-[#bc9a64]" />
						Service Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400">No service data available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Activity className="w-5 h-5 text-[#bc9a64]" />
					Service Breakdown
				</CardTitle>
				<p className="text-sm text-gray-400">
					{totalAppointments} appointments • $
					{totalServiceSales.toLocaleString()}
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{serviceItems.map((item) => {
					const service = aggregateServices[item.key];
					const avgTicket =
						service.appointments > 0 ? service.sales / service.appointments : 0;

					return (
						<div
							key={item.key}
							className="flex items-center justify-between p-3 bg-[#2a2a2a]/50 rounded-lg hover-lift">
							<div className="flex items-center gap-3">
								<item.icon className={`w-5 h-5 ${item.color}`} />
								<div>
									<p className="text-white font-medium">{item.name}</p>
									<p className="text-xs text-gray-400">
										{service.appointments} appointments
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-white font-semibold">
									${service.sales.toLocaleString()}
								</p>
								<p className="text-xs text-gray-400">
									${avgTicket.toFixed(0)} avg
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
