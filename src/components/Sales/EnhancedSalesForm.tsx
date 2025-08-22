import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
	SalesRecord,
	Location,
	ProductBreakdown,
	ServiceBreakdown,
	SellerPerformance,
} from "@/types/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Save, X, AlertCircle, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

const LOCATIONS = [
	"Flatiron",
	"MidEast",
	"Midtown",
	"UWS",
	"Back Bay",
	"North Station",
	"Miami Beach",
	"eStore",
	"Location 9",
	"Location 10",
];

interface EnhancedSalesFormProps {
	record?: SalesRecord;
	onSave: (recordData: Partial<SalesRecord>) => void;
	onCancel: () => void;
	isAdmin: boolean;
	userLocation?: Location;
}

export default function EnhancedSalesForm({
	record,
	onSave,
	onCancel,
	isAdmin,
	userLocation,
}: EnhancedSalesFormProps) {
	// Basic form state
	const [formData, setFormData] = useState({
		location:
			record?.location ||
			(isAdmin ? ("" as Location | "") : userLocation || "Flatiron"),
		date: record?.date || format(new Date(), "yyyy-MM-dd"),
		daily_sales: record?.daily_sales?.toString() || "",
		treatments_count: record?.treatments_count?.toString() || "",
		total_appointments: record?.total_appointments?.toString() || "",
		membership_count: record?.membership_count?.toString() || "",
		membership_revenue: record?.membership_revenue?.toString() || "",
		notes: record?.notes || "",
	});

	// Product breakdown state
	const [productBreakdown, setProductBreakdown] = useState<ProductBreakdown>({
		skincare: record?.product_breakdown?.skincare || 0,
		supplements: record?.product_breakdown?.supplements || 0,
		devices: record?.product_breakdown?.devices || 0,
		gift_cards: record?.product_breakdown?.gift_cards || 0,
		other: record?.product_breakdown?.other || 0,
	});

	// Service breakdown state
	const [serviceBreakdown, setServiceBreakdown] = useState<ServiceBreakdown>({
		botox: record?.service_breakdown?.botox || { appointments: 0, sales: 0 },
		dysport: record?.service_breakdown?.dysport || {
			appointments: 0,
			sales: 0,
		},
		filler: record?.service_breakdown?.filler || { appointments: 0, sales: 0 },
		sculptra: record?.service_breakdown?.sculptra || {
			appointments: 0,
			sales: 0,
		},
		laser_genesis: record?.service_breakdown?.laser_genesis || {
			appointments: 0,
			sales: 0,
		},
		hydrafacial: record?.service_breakdown?.hydrafacial || {
			appointments: 0,
			sales: 0,
		},
		chemical_peel: record?.service_breakdown?.chemical_peel || {
			appointments: 0,
			sales: 0,
		},
		microneedling: record?.service_breakdown?.microneedling || {
			appointments: 0,
			sales: 0,
		},
		prp: record?.service_breakdown?.prp || { appointments: 0, sales: 0 },
		consultation: record?.service_breakdown?.consultation || {
			appointments: 0,
			sales: 0,
		},
		other_services: record?.service_breakdown?.other_services || {
			appointments: 0,
			sales: 0,
		},
	});

	// Top sellers state
	const [topSellers, setTopSellers] = useState<SellerPerformance[]>(
		record?.top_sellers || []
	);

	const [saving, setSaving] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSaving(true);
		setValidationErrors([]);

		try {
			// Build the complete record
			const recordData: Partial<SalesRecord> = {
				location: formData.location as Location,
				date: formData.date,
				daily_sales: parseFloat(formData.daily_sales) || 0,
				treatments_count: parseInt(formData.treatments_count) || 0,
				total_appointments: parseInt(formData.total_appointments) || 0,
				membership_count: formData.membership_count
					? parseInt(formData.membership_count)
					: undefined,
				membership_revenue: formData.membership_revenue
					? parseFloat(formData.membership_revenue)
					: undefined,
				product_breakdown: productBreakdown,
				service_breakdown: serviceBreakdown,
				top_sellers: topSellers,
				notes: formData.notes,
			};

			await onSave(recordData);
		} catch (error) {
			setValidationErrors([
				"An error occurred while saving. Please try again.",
			]);
		} finally {
			setSaving(false);
		}
	};

	const addTopSeller = () => {
		setTopSellers([
			...topSellers,
			{ name: "", sales: 0, location: formData.location as Location },
		]);
	};

	const removeTopSeller = (index: number) => {
		setTopSellers(topSellers.filter((_, i) => i !== index));
	};

	const updateTopSeller = (
		index: number,
		field: keyof SellerPerformance,
		value: string | number
	) => {
		const updated = [...topSellers];
		updated[index] = { ...updated[index], [field]: value };
		setTopSellers(updated);
	};

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Save className="w-5 h-5 text-[#bc9a64]" />
					{record ? "Edit Sales Record" : "Comprehensive Sales Entry"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{validationErrors.length > 0 && (
					<Alert className="mb-6 border-red-500/20 bg-red-500/10">
						<AlertCircle className="h-4 w-4 text-red-400" />
						<AlertDescription className="text-red-300">
							<div className="space-y-1">
								{validationErrors.map((error, index) => (
									<div key={index}>{error}</div>
								))}
							</div>
						</AlertDescription>
					</Alert>
				)}

				<form
					onSubmit={handleSubmit}
					className="space-y-8">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-[#bc9a64] border-b border-[#bc9a64]/20 pb-2">
							Basic Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{isAdmin && (
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-300">
										Location
									</label>
									<Select
										value={formData.location}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												location: value as Location,
											}))
										}>
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
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Date
								</label>
								<Input
									type="date"
									value={formData.date}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, date: e.target.value }))
									}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Total Daily Sales ($)
								</label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={formData.daily_sales}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											daily_sales: e.target.value,
										}))
									}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									placeholder="0.00"
									required
								/>
							</div>
						</div>
					</div>

					{/* Membership Metrics */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-[#bc9a64] border-b border-[#bc9a64]/20 pb-2">
							Membership Metrics
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Number of Members (#)
								</label>
								<Input
									type="number"
									min="0"
									value={formData.membership_count}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											membership_count: e.target.value,
										}))
									}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									placeholder="0"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Membership Revenue ($)
								</label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={formData.membership_revenue}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											membership_revenue: e.target.value,
										}))
									}
									className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
									placeholder="0.00"
								/>
							</div>
						</div>
					</div>

					{/* Product Breakdown */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-[#bc9a64] border-b border-[#bc9a64]/20 pb-2">
							Product Sales Breakdown
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
							{Object.entries(productBreakdown).map(([key, value]) => (
								<div
									key={key}
									className="space-y-2">
									<label className="text-sm font-medium text-gray-300 capitalize">
										{key.replace("_", " ")} ($)
									</label>
									<Input
										type="number"
										step="0.01"
										min="0"
										value={value || ""}
										onChange={(e) =>
											setProductBreakdown((prev) => ({
												...prev,
												[key]: parseFloat(e.target.value) || 0,
											}))
										}
										className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
										placeholder="0.00"
									/>
								</div>
							))}
						</div>
					</div>

					{/* Service Breakdown */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-[#bc9a64] border-b border-[#bc9a64]/20 pb-2">
							Service Breakdown
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Object.entries(serviceBreakdown).map(([key, value]) => (
								<div
									key={key}
									className="space-y-3 p-4 bg-[#2a2a2a]/30 rounded-lg">
									<h4 className="font-medium text-white capitalize">
										{key.replace("_", " ")}
									</h4>
									<div className="grid grid-cols-2 gap-3">
										<div className="space-y-1">
											<label className="text-xs text-gray-400">
												Appointments
											</label>
											<Input
												type="number"
												min="0"
												value={value?.appointments || ""}
												onChange={(e) =>
													setServiceBreakdown((prev) => ({
														...prev,
														[key]: {
															...prev[key as keyof ServiceBreakdown],
															appointments: parseInt(e.target.value) || 0,
														},
													}))
												}
												className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64] text-sm"
												placeholder="0"
											/>
										</div>
										<div className="space-y-1">
											<label className="text-xs text-gray-400">Sales ($)</label>
											<Input
												type="number"
												step="0.01"
												min="0"
												value={value?.sales || ""}
												onChange={(e) =>
													setServiceBreakdown((prev) => ({
														...prev,
														[key]: {
															...prev[key as keyof ServiceBreakdown],
															sales: parseFloat(e.target.value) || 0,
														},
													}))
												}
												className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64] text-sm"
												placeholder="0.00"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Top Sellers */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-[#bc9a64] border-b border-[#bc9a64]/20 pb-2">
								Top Sellers
							</h3>
							<Button
								type="button"
								onClick={addTopSeller}
								className="bg-[#bc9a64]/20 hover:bg-[#bc9a64]/30 text-[#bc9a64] border border-[#bc9a64]/30">
								<Plus className="w-4 h-4 mr-2" />
								Add Seller
							</Button>
						</div>
						<div className="space-y-3">
							{topSellers.map((seller, index) => (
								<div
									key={index}
									className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#2a2a2a]/30 rounded-lg">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Name
										</label>
										<Input
											type="text"
											value={seller.name}
											onChange={(e) =>
												updateTopSeller(index, "name", e.target.value)
											}
											className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
											placeholder="Seller name"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Sales ($)
										</label>
										<Input
											type="number"
											step="0.01"
											min="0"
											value={seller.sales}
											onChange={(e) =>
												updateTopSeller(
													index,
													"sales",
													parseFloat(e.target.value) || 0
												)
											}
											className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
											placeholder="0.00"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Location
										</label>
										<Select
											value={seller.location}
											onValueChange={(value) =>
												updateTopSeller(index, "location", value as Location)
											}>
											<SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white">
												<SelectValue />
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
									<div className="flex items-end">
										<Button
											type="button"
											onClick={() => removeTopSeller(index)}
											className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Notes */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-300">
							Notes (Optional)
						</label>
						<Textarea
							value={formData.notes}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, notes: e.target.value }))
							}
							className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64] h-24"
							placeholder="Add any notes about the day's performance..."
						/>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="border-[#333] text-gray-300 hover:bg-[#333]/50">
							<X className="w-4 h-4 mr-2" />
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={saving || (!isAdmin && !userLocation)}
							className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
							{saving ? (
								<div className="w-4 h-4 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin mr-2" />
							) : (
								<Save className="w-4 h-4 mr-2" />
							)}
							{record ? "Update" : "Save"} Entry
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
