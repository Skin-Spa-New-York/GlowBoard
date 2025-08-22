import { useState, useEffect } from "react";
import {
	Settings,
	Shield,
	AlertCircle,
	CheckCircle,
	MapPin,
	Target,
	Save,
	Printer,
	Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useLocationGoals } from "@/hooks/useLocationGoals";
import { useLocationSettings } from "@/hooks/useLocationSettings";
import { LOCATIONS, type Location } from "@/types/entities";

export default function SettingsPage() {
	const { user: currentUser, loading: authLoading } = useAuth();
	const [message, setMessage] = useState({ type: "", text: "" });

	// Location Goals
	const {
		locationGoals,
		loading: goalsLoading,
		saveGoals,
		updateGoal,
	} = useLocationGoals();
	const [savingGoals, setSavingGoals] = useState(false);

	// Location Settings
	const {
		locationSettings,
		loading: settingsLoading,
		saveSettings,
		updateSetting,
	} = useLocationSettings();
	const [savingSettings, setSavingSettings] = useState(false);

	const loading = authLoading;

	// Save location goals
	const handleSaveGoals = async () => {
		setSavingGoals(true);
		try {
			const result = await saveGoals(locationGoals);
			if (result.success) {
				setMessage({
					type: "success",
					text: "Location goals saved successfully!",
				});
			} else {
				setMessage({
					type: "error",
					text:
						result.error || "Failed to save location goals. Please try again.",
				});
			}
		} catch (error) {
			console.error("Error saving goals:", error);
			setMessage({
				type: "error",
				text: "Failed to save location goals. Please try again.",
			});
		} finally {
			setSavingGoals(false);
		}
	};

	// Save location settings
	const handleSaveSettings = async () => {
		setSavingSettings(true);
		try {
			const result = await saveSettings(locationSettings);
			if (result.success) {
				setMessage({
					type: "success",
					text: "Location settings saved successfully!",
				});
			} else {
				setMessage({
					type: "error",
					text:
						result.error ||
						"Failed to save location settings. Please try again.",
				});
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			setMessage({
				type: "error",
				text: "Failed to save location settings. Please try again.",
			});
		} finally {
			setSavingSettings(false);
		}
	};

	// Print dashboard
	const handlePrintDashboard = () => {
		window.print();
	};

	// Export data
	const handleExportData = (location?: Location) => {
		// TODO: Implement data export functionality
		const filename = location
			? `${location}_sales_data.csv`
			: "all_locations_sales_data.csv";
		console.log(
			`Exporting data for: ${location || "all locations"} to ${filename}`
		);
		setMessage({
			type: "success",
			text: `Data export initiated for ${location || "all locations"}.`,
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!currentUser?.is_admin) {
		return (
			<div className="min-h-screen bg-[#0e0e0e] text-white p-6">
				<div className="max-w-2xl mx-auto mt-20">
					<Alert className="border-red-500/20 bg-red-500/10">
						<Shield className="h-4 w-4 text-red-400" />
						<AlertDescription className="text-red-300">
							Access denied. Only administrators can access settings.
						</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0e0e0e] text-white p-6">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
						<Settings className="w-8 h-8 text-[#bc9a64]" />
						Settings
					</h1>
					<p className="text-gray-400">
						Manage system settings, location goals, and dashboard preferences
					</p>
				</div>

				{/* Messages */}
				{message.text && (
					<Alert
						className={
							message.type === "success"
								? "border-green-500/20 bg-green-500/10"
								: "border-red-500/20 bg-red-500/10"
						}>
						{message.type === "success" ? (
							<CheckCircle className="h-4 w-4 text-green-400" />
						) : (
							<AlertCircle className="h-4 w-4 text-red-400" />
						)}
						<AlertDescription
							className={
								message.type === "success" ? "text-green-300" : "text-red-300"
							}>
							{message.text}
						</AlertDescription>
					</Alert>
				)}

				{/* Location Settings */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white flex items-center gap-2">
							<MapPin className="w-5 h-5 text-[#bc9a64]" />
							Location Settings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="text-sm text-gray-400 mb-4">
								Customize location names and details for your MedSpa locations.
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{locationSettings.map((setting) => (
									<div
										key={setting.locationId}
										className="bg-[#0e0e0e]/50 rounded-lg p-4 space-y-4">
										<h3 className="text-white font-medium">
											{setting.locationId}
										</h3>
										<div className="space-y-3">
											<div>
												<label className="block text-sm font-medium text-gray-300 mb-1">
													Display Name
												</label>
												<Input
													type="text"
													value={setting.customName}
													onChange={(e) =>
														updateSetting(
															setting.locationId,
															"customName",
															e.target.value
														)
													}
													className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
													placeholder="Enter custom name"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-300 mb-1">
													Manager
												</label>
												<Input
													type="text"
													value={setting.manager || ""}
													onChange={(e) =>
														updateSetting(
															setting.locationId,
															"manager",
															e.target.value
														)
													}
													className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
													placeholder="Manager name"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-end pt-4">
								<Button
									onClick={handleSaveSettings}
									disabled={savingSettings}
									className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
									{savingSettings ? "Saving..." : "Save Location Settings"}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Location Goals */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Target className="w-5 h-5 text-[#bc9a64]" />
								Location Goals
							</span>
							<Button
								onClick={handleSaveGoals}
								disabled={savingGoals}
								className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
								{savingGoals ? (
									<div className="w-4 h-4 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin mr-2" />
								) : (
									<Save className="w-4 h-4 mr-2" />
								)}
								Save Goals
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{locationGoals.map((goal) => (
								<div
									key={goal.location}
									className="p-4 bg-[#0e0e0e] rounded-lg border border-[#bc9a64]/10">
									<div className="flex items-center gap-2 mb-4">
										<MapPin className="w-4 h-4 text-[#bc9a64]" />
										<h3 className="font-semibold text-white">
											{goal.location}
										</h3>
									</div>
									<div className="space-y-4">
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">
												Sales Goal ($)
											</label>
											<Input
												type="number"
												min="0"
												step="100"
												value={goal.salesGoal || ""}
												onChange={(e) =>
													updateGoal(
														goal.location,
														"salesGoal",
														parseFloat(e.target.value) || 0
													)
												}
												className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#bc9a64]"
												placeholder="0"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">
												Retail Goal ($)
											</label>
											<Input
												type="number"
												min="0"
												step="100"
												value={goal.retailGoal || ""}
												onChange={(e) =>
													updateGoal(
														goal.location,
														"retailGoal",
														parseFloat(e.target.value) || 0
													)
												}
												className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#bc9a64]"
												placeholder="0"
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Dashboard Actions */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white">Dashboard Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Print Dashboard */}
							<div className="space-y-4">
								<h3 className="font-semibold text-white flex items-center gap-2">
									<Printer className="w-4 h-4 text-[#bc9a64]" />
									Print Dashboard
								</h3>
								<p className="text-sm text-gray-400">
									Print the current dashboard view optimized for 8.5x11 inch
									paper.
								</p>
								<Button
									onClick={handlePrintDashboard}
									className="w-full bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
									<Printer className="w-4 h-4 mr-2" />
									Print Dashboard
								</Button>
							</div>

							{/* Export Data */}
							<div className="space-y-4">
								<h3 className="font-semibold text-white flex items-center gap-2">
									<Download className="w-4 h-4 text-[#bc9a64]" />
									Export Data
								</h3>
								<p className="text-sm text-gray-400">
									Export sales data to CSV format for analysis.
								</p>
								<div className="space-y-2">
									<Button
										onClick={() => handleExportData()}
										className="w-full bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
										<Download className="w-4 h-4 mr-2" />
										Export All Locations
									</Button>
									<div className="grid grid-cols-2 gap-2">
										{LOCATIONS.slice(0, 4).map((location) => (
											<Button
												key={location}
												onClick={() => handleExportData(location)}
												variant="outline"
												size="sm"
												className="border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10 text-xs">
												{location}
											</Button>
										))}
									</div>
									{LOCATIONS.length > 4 && (
										<div className="grid grid-cols-2 gap-2">
											{LOCATIONS.slice(4).map((location) => (
												<Button
													key={location}
													onClick={() => handleExportData(location)}
													variant="outline"
													size="sm"
													className="border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10 text-xs">
													{location}
												</Button>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* System Information */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white">System Information</CardTitle>
					</CardHeader>
					<CardContent className="text-gray-300 space-y-2">
						<p>• Location goals help track performance against targets</p>
						<p>
							• Custom location names are displayed throughout the dashboard
						</p>
						<p>• Dashboard can be printed for offline review and meetings</p>
						<p>• Data export allows for external analysis and reporting</p>
						<p>• All settings are saved automatically when updated</p>
						<p>• Changes take effect immediately across the system</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
