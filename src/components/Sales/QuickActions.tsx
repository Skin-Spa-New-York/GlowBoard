import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Zap,
	Calendar,
	AlertCircle,
	TrendingUp,
	Users,
	DollarSign,
	Activity,
} from "lucide-react";
import { LOCATIONS, SalesRecord } from "@/types/entities";
import { validateSalesRecord, ValidationError } from "@/utils/validation";
import { logger } from "@/utils/logger";

interface QuickActionsProps {
	onQuickEntry: (data: Partial<SalesRecord>) => void;
	selectedDate: string;
	onDateChange: (date: string) => void;
	isAdmin?: boolean;
}

export default function QuickActions({
	onQuickEntry,
	selectedDate,
	onDateChange,
	isAdmin,
}: QuickActionsProps) {
	const [quickServiceSales, setQuickServiceSales] = useState("");
	const [quickRetailSales, setQuickRetailSales] = useState<{
		[brand: string]: string;
	}>({});
	const [quickClients, setQuickClients] = useState("");
	const [quickAppointments, setQuickAppointments] = useState("");
	const [quickMembershipCount, setQuickMembershipCount] = useState("");
	const [quickMembershipRevenue, setQuickMembershipRevenue] = useState("");
	const [quickLocation, setQuickLocation] = useState("");
	const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
		[]
	);

	// Retail brands for MedSpa
	const retailBrands = ["PCA Skin", "EltaMD", "Thom Elzner Skincare", "Others"];

	const handleRetailSalesChange = (brand: string, value: string) => {
		setQuickRetailSales((prev) => ({
			...prev,
			[brand]: value,
		}));
	};

	const getTotalRetailSales = () => {
		return Object.values(quickRetailSales).reduce(
			(sum, value) => sum + (parseFloat(value) || 0),
			0
		);
	};

	const handleQuickSubmit = () => {
		setValidationErrors([]);

		try {
			// Convert retail sales to numbers
			const retailBreakdown: { [brand: string]: number } = {};
			Object.entries(quickRetailSales).forEach(([brand, value]) => {
				const numValue = parseFloat(value);
				if (numValue > 0) {
					retailBreakdown[brand] = numValue;
				}
			});

			// Calculate totals
			const serviceSales = parseFloat(quickServiceSales) || 0;
			const totalRetail = getTotalRetailSales();
			const totalSales = serviceSales + totalRetail;

			// Prepare data for submission
			const data: Partial<SalesRecord> = {
				date: selectedDate,
				daily_service_sales: serviceSales,
				retail_daily_sales: retailBreakdown,
				number_of_clients: parseInt(quickClients) || 0,
				number_of_appointments: parseInt(quickAppointments) || 0,
				membership_count: quickMembershipCount
					? parseInt(quickMembershipCount)
					: undefined,
				membership_revenue: quickMembershipRevenue
					? parseFloat(quickMembershipRevenue)
					: undefined,
				daily_sales: totalSales, // For backward compatibility
				...(isAdmin && quickLocation && { location: quickLocation as any }),
			};

			// Validation
			const errors: ValidationError[] = [];

			if (!serviceSales || serviceSales <= 0) {
				errors.push({
					field: "daily_service_sales",
					message: "Service sales amount is required",
					code: "REQUIRED_FIELD",
				});
			}

			if (!data.number_of_clients || data.number_of_clients <= 0) {
				errors.push({
					field: "number_of_clients",
					message: "Number of clients is required",
					code: "REQUIRED_FIELD",
				});
			}

			if (!data.number_of_appointments || data.number_of_appointments <= 0) {
				errors.push({
					field: "number_of_appointments",
					message: "Number of appointments is required",
					code: "REQUIRED_FIELD",
				});
			}

			if (isAdmin && !quickLocation) {
				errors.push({
					field: "location",
					message: "Location is required for admin entries",
					code: "REQUIRED_FIELD",
				});
			}

			if (errors.length > 0) {
				setValidationErrors(errors);
				return;
			}

			onQuickEntry(data);

			// Reset form
			setQuickServiceSales("");
			setQuickRetailSales({});
			setQuickClients("");
			setQuickAppointments("");
			setQuickMembershipCount("");
			setQuickMembershipRevenue("");
			setQuickLocation("");
			setValidationErrors([]);
		} catch (error) {
			logger.error("Error in quick entry", error);
			setValidationErrors([
				{
					field: "general",
					message: "An error occurred. Please try again.",
					code: "QUICK_ENTRY_ERROR",
				},
			]);
		}
	};

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-[#bc9a64]" />
						Daily Sales Entry
					</div>
					<div className="text-sm text-gray-400 font-normal">
						Service sales • Retail by brand • Client metrics
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{validationErrors.length > 0 && (
					<Alert className="mb-4 border-red-500/20 bg-red-500/10">
						<AlertCircle className="h-4 w-4 text-red-400" />
						<AlertDescription className="text-red-300">
							<div className="space-y-1">
								{validationErrors.map((error, index) => (
									<div key={index}>{error.message}</div>
								))}
							</div>
						</AlertDescription>
					</Alert>
				)}

				<div className="space-y-6">
					{/* Primary Row - Essential Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Date Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-1">
								<Calendar className="w-4 h-4" />
								Date *
							</label>
							<Input
								type="date"
								value={selectedDate}
								onChange={(e) => onDateChange(e.target.value)}
								className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
							/>
						</div>

						{/* Location (Admin only) */}
						{isAdmin && (
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Location *
								</label>
								<Select
									value={quickLocation}
									onValueChange={setQuickLocation}>
									<SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white">
										<SelectValue placeholder="Select location" />
									</SelectTrigger>
									<SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
										{LOCATIONS.map((location) => (
											<SelectItem
												key={location}
												value={location}
												className="text-white hover:bg-[#bc9a64]/10">
												{location}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{/* Service Sales */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-1">
								<Activity className="w-4 h-4" />
								Service Sales * ($)
							</label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={quickServiceSales}
								onChange={(e) => setQuickServiceSales(e.target.value)}
								className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
								placeholder="0.00"
							/>
						</div>

						{/* Number of Clients */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-1">
								<Users className="w-4 h-4" />
								Clients * (#)
							</label>
							<Input
								type="number"
								min="0"
								value={quickClients}
								onChange={(e) => setQuickClients(e.target.value)}
								className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
								placeholder="0"
							/>
						</div>

						{/* Number of Appointments */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-1">
								<Calendar className="w-4 h-4" />
								Appointments * (#)
							</label>
							<Input
								type="number"
								min="0"
								value={quickAppointments}
								onChange={(e) => setQuickAppointments(e.target.value)}
								className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
								placeholder="0"
							/>
						</div>
					</div>

					{/* Membership Metrics */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-white flex items-center gap-2">
							<Users className="w-5 h-5 text-[#bc9a64]" />
							Membership Metrics
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Number of Members */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Number of Members (#)
								</label>
								<Input
									type="number"
									min="0"
									value={quickMembershipCount}
									onChange={(e) => setQuickMembershipCount(e.target.value)}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									placeholder="0"
								/>
							</div>

							{/* Membership Revenue */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Membership Revenue ($)
								</label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={quickMembershipRevenue}
									onChange={(e) => setQuickMembershipRevenue(e.target.value)}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									placeholder="0.00"
								/>
							</div>
						</div>
					</div>

					{/* Retail Sales by Brand */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-white flex items-center gap-2">
							<DollarSign className="w-5 h-5 text-[#bc9a64]" />
							Retail Sales by Brand
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{retailBrands.map((brand) => (
								<div
									key={brand}
									className="space-y-2">
									<label className="text-sm font-medium text-gray-300">
										{brand} ($)
									</label>
									<Input
										type="number"
										step="0.01"
										min="0"
										value={quickRetailSales[brand] || ""}
										onChange={(e) =>
											handleRetailSalesChange(brand, e.target.value)
										}
										className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
										placeholder="0.00"
									/>
								</div>
							))}
						</div>
					</div>

					{/* Summary Display */}
					{(quickServiceSales ||
						getTotalRetailSales() > 0 ||
						quickMembershipRevenue) && (
						<div className="bg-[#0e0e0e]/50 rounded-lg p-4 border border-[#bc9a64]/10">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
								<div className="text-center">
									<div className="text-gray-400">Service Sales</div>
									<div className="text-[#bc9a64] font-semibold text-lg">
										${parseFloat(quickServiceSales || "0").toFixed(2)}
									</div>
								</div>
								<div className="text-center">
									<div className="text-gray-400">Retail Sales</div>
									<div className="text-[#bc9a64] font-semibold text-lg">
										${getTotalRetailSales().toFixed(2)}
									</div>
								</div>
								<div className="text-center">
									<div className="text-gray-400">Membership Revenue</div>
									<div className="text-[#bc9a64] font-semibold text-lg">
										${parseFloat(quickMembershipRevenue || "0").toFixed(2)}
									</div>
								</div>
								<div className="text-center">
									<div className="text-gray-400">Total Revenue</div>
									<div className="text-[#bc9a64] font-semibold text-xl">
										$
										{(
											parseFloat(quickServiceSales || "0") +
											getTotalRetailSales() +
											parseFloat(quickMembershipRevenue || "0")
										).toFixed(2)}
									</div>
								</div>
								{quickAppointments && (
									<div className="text-center">
										<div className="text-gray-400">Avg Ticket</div>
										<div className="text-[#bc9a64] font-semibold text-lg">
											$
											{(
												(parseFloat(quickServiceSales || "0") +
													getTotalRetailSales() +
													parseFloat(quickMembershipRevenue || "0")) /
												parseInt(quickAppointments)
											).toFixed(2)}
										</div>
									</div>
								)}
							</div>
							{/* Membership Summary */}
							{quickMembershipCount && (
								<div className="mt-4 pt-4 border-t border-[#bc9a64]/10">
									<div className="grid grid-cols-1 gap-4 text-sm">
										<div className="text-center">
											<div className="text-gray-400">Total Members</div>
											<div className="text-[#bc9a64] font-semibold text-lg">
												{quickMembershipCount}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Submit Button */}
					<div className="flex justify-end">
						<Button
							onClick={handleQuickSubmit}
							disabled={
								!quickServiceSales ||
								!quickClients ||
								!quickAppointments ||
								(isAdmin && !quickLocation)
							}
							className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold px-8 py-2">
							<Zap className="w-4 h-4 mr-2" />
							Add Daily Entry
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
