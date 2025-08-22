import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SalesRecord, Location } from "@/types/entities";
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
import { Save, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { validateSalesRecord, ValidationError } from "@/utils/validation";
import { logger } from "@/utils/logger";

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

interface SalesFormProps {
	record?: SalesRecord;
	onSave: (recordData: Partial<SalesRecord>) => void;
	onCancel: () => void;
	isAdmin: boolean;
	userLocation?: Location;
}

export default function SalesForm({
	record,
	onSave,
	onCancel,
	isAdmin,
	userLocation,
}: SalesFormProps) {
	const [formData, setFormData] = useState({
		location:
			record?.location ||
			(isAdmin ? ("" as Location | "") : userLocation || "Flatiron"),
		date: record?.date || format(new Date(), "yyyy-MM-dd"),
		daily_sales: record?.daily_sales?.toString() || "",
		treatments_count: record?.treatments_count?.toString() || "",
		total_appointments: record?.total_appointments?.toString() || "",

		// Product breakdown
		product_skincare: record?.product_breakdown?.skincare?.toString() || "",
		product_supplements:
			record?.product_breakdown?.supplements?.toString() || "",
		product_devices: record?.product_breakdown?.devices?.toString() || "",
		product_gift_cards: record?.product_breakdown?.gift_cards?.toString() || "",
		product_other: record?.product_breakdown?.other?.toString() || "",

		// Service breakdown
		service_botox_appointments:
			record?.service_breakdown?.botox?.appointments?.toString() || "",
		service_botox_sales:
			record?.service_breakdown?.botox?.sales?.toString() || "",
		service_dysport_appointments:
			record?.service_breakdown?.dysport?.appointments?.toString() || "",
		service_dysport_sales:
			record?.service_breakdown?.dysport?.sales?.toString() || "",
		service_filler_appointments:
			record?.service_breakdown?.filler?.appointments?.toString() || "",
		service_filler_sales:
			record?.service_breakdown?.filler?.sales?.toString() || "",
		service_sculptra_appointments:
			record?.service_breakdown?.sculptra?.appointments?.toString() || "",
		service_sculptra_sales:
			record?.service_breakdown?.sculptra?.sales?.toString() || "",
		service_laser_genesis_appointments:
			record?.service_breakdown?.laser_genesis?.appointments?.toString() || "",
		service_laser_genesis_sales:
			record?.service_breakdown?.laser_genesis?.sales?.toString() || "",
		service_hydrafacial_appointments:
			record?.service_breakdown?.hydrafacial?.appointments?.toString() || "",
		service_hydrafacial_sales:
			record?.service_breakdown?.hydrafacial?.sales?.toString() || "",
		service_chemical_peel_appointments:
			record?.service_breakdown?.chemical_peel?.appointments?.toString() || "",
		service_chemical_peel_sales:
			record?.service_breakdown?.chemical_peel?.sales?.toString() || "",
		service_microneedling_appointments:
			record?.service_breakdown?.microneedling?.appointments?.toString() || "",
		service_microneedling_sales:
			record?.service_breakdown?.microneedling?.sales?.toString() || "",
		service_prp_appointments:
			record?.service_breakdown?.prp?.appointments?.toString() || "",
		service_prp_sales: record?.service_breakdown?.prp?.sales?.toString() || "",
		service_consultation_appointments:
			record?.service_breakdown?.consultation?.appointments?.toString() || "",
		service_consultation_sales:
			record?.service_breakdown?.consultation?.sales?.toString() || "",
		service_other_appointments:
			record?.service_breakdown?.other_services?.appointments?.toString() || "",
		service_other_sales:
			record?.service_breakdown?.other_services?.sales?.toString() || "",

		notes: record?.notes || "",
	});

	const [saving, setSaving] = useState(false);
	const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
		[]
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSaving(true);
		setValidationErrors([]);

		try {
			// Validate the form data
			const validationResult = validateSalesRecord({
				location: formData.location,
				date: formData.date,
				daily_sales: formData.daily_sales,
				treatments_count: formData.treatments_count,
				notes: formData.notes,
			});

			if (!validationResult.isValid) {
				setValidationErrors(validationResult.errors);
				setSaving(false);
				return;
			}

			// Use sanitized data from validation
			await onSave(validationResult.sanitizedValue);

			// Clear form on successful save
			if (!record) {
				setFormData({
					location: isAdmin
						? ("" as Location | "")
						: userLocation || "Flatiron",
					date: format(new Date(), "yyyy-MM-dd"),
					daily_sales: "",
					treatments_count: "",
					notes: "",
				});
			}
		} catch (error) {
			logger.error("Error submitting sales form", error);
			setValidationErrors([
				{
					field: "general",
					message: "An error occurred while saving. Please try again.",
					code: "SAVE_ERROR",
				},
			]);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Save className="w-5 h-5 text-[#bc9a64]" />
					{record ? "Edit Sales Record" : "New Sales Entry"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{validationErrors.length > 0 && (
					<Alert className="mb-6 border-red-500/20 bg-red-500/10">
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

				<form
					onSubmit={handleSubmit}
					className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Location */}
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

						{/* Date */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300">Date</label>
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

						{/* Daily Sales */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300">
								Daily Sales ($)
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

						{/* Treatments Count */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300">
								Number of Treatments
							</label>
							<Input
								type="number"
								min="0"
								value={formData.treatments_count}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										treatments_count: e.target.value,
									}))
								}
								className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
								placeholder="0"
							/>
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
