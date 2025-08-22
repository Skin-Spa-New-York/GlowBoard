import { useState } from "react";
import { format } from "date-fns";
import type { SalesRecord } from "@/types/entities";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSalesData } from "@/hooks/useSalesData";
import { AuditLogger } from "@/components/Utils/AuditLogger";
import { logger } from "@/utils/logger";

import EnhancedSalesForm from "@/components/Sales/EnhancedSalesForm";
import SalesTable from "@/components/Sales/SalesTable";
import QuickActions from "@/components/Sales/QuickActions";

export default function SalesEntry() {
	const [showForm, setShowForm] = useState(false);
	const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), "yyyy-MM-dd")
	);

	const { user, loading: authLoading } = useAuth();
	const {
		salesData: salesRecords,
		loading: dataLoading,
		createSalesRecord,
		updateSalesRecord,
		deleteSalesRecord,
	} = useSalesData({
		userLocation: user?.location,
		isAdmin: user?.is_admin,
	});

	const loading = authLoading || dataLoading;

	const handleSaveRecord = async (recordData: Partial<SalesRecord>) => {
		try {
			if (editingRecord) {
				// const oldData = { ...editingRecord };
				await updateSalesRecord(editingRecord.id!, recordData);
				// TODO: Implement audit logging when services are ready
				// await AuditLogger.logSalesRecord("update", editingRecord.id, oldData, recordData);
			} else {
				if (!user?.is_admin) {
					recordData.location = user?.location || "Flatiron";
				}
				await createSalesRecord(
					recordData as Omit<SalesRecord, "id" | "created_at" | "updated_at">
				);
				// TODO: Implement audit logging when services are ready
				// await AuditLogger.logSalesRecord("create", newRecord.id, null, recordData);
			}

			setShowForm(false);
			setEditingRecord(null);
		} catch (error) {
			logger.error("Error saving sales record", error);
		}
	};

	const handleEditRecord = (record: SalesRecord) => {
		setEditingRecord(record);
		setShowForm(true);
	};

	const handleDeleteRecord = async (recordId: string) => {
		if (window.confirm("Are you sure you want to delete this record?")) {
			try {
				const oldData = salesRecords.find((r) => r.id === recordId);
				await deleteSalesRecord(recordId);
				await AuditLogger.logSalesRecord("delete", recordId, oldData, null);
			} catch (error) {
				logger.error("Error deleting sales record", error);
			}
		}
	};

	const handleQuickEntry = async (quickData: any) => {
		try {
			const recordData = {
				...quickData,
				location: user?.is_admin
					? quickData.location
					: user?.location || "Flatiron",
				date: selectedDate,
			};
			await createSalesRecord(recordData);
			// TODO: Implement audit logging when services are ready
			// await AuditLogger.logSalesRecord("create", newRecord.id, null, recordData);
		} catch (error) {
			logger.error("Error with quick entry", error);
		}
	};

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
						<h1 className="text-3xl font-bold mb-2">Sales Entry</h1>
						<p className="text-gray-400">
							{user?.is_admin
								? "Manage sales data for all locations"
								: `Manage sales for ${user?.location || "your location"}`}
						</p>
					</div>

					<Button
						onClick={() => setShowForm(true)}
						className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
						<Plus className="w-5 h-5 mr-2" />
						New Entry
					</Button>
				</div>

				{/* Quick Actions */}
				<QuickActions
					onQuickEntry={handleQuickEntry}
					selectedDate={selectedDate}
					onDateChange={setSelectedDate}
					isAdmin={user?.is_admin}
				/>

				{/* Enhanced Sales Form */}
				{showForm && (
					<EnhancedSalesForm
						record={editingRecord || undefined}
						onSave={handleSaveRecord}
						onCancel={() => {
							setShowForm(false);
							setEditingRecord(null);
						}}
						isAdmin={user?.is_admin || false}
						userLocation={user?.location || "Flatiron"}
					/>
				)}

				{/* Sales Table */}
				<SalesTable
					records={salesRecords}
					onEdit={handleEditRecord}
					onDelete={handleDeleteRecord}
					showLocation={user?.is_admin}
					userLocation={user?.location}
					isAdmin={user?.is_admin}
				/>
			</div>
		</div>
	);
}
