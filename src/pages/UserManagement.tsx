import { useState } from "react";
import {
	Users,
	Shield,
	Building2,
	Crown,
	Plus,
	Mail,
	Edit,
	Trash2,
	MapPin,
	AlertCircle,
	CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useUserManagement } from "@/hooks/useUserManagement";
import { LOCATIONS, type Location } from "@/types/entities";

export default function UserManagement() {
	const { user: currentUser, loading: authLoading } = useAuth();
	const {
		users,
		loading: usersLoading,
		error: usersError,
		inviteUser,
		updateUserAdmin,
		updateUserLocation,
		deleteUser,
	} = useUserManagement();

	// State for invite form
	const [showInviteForm, setShowInviteForm] = useState(false);
	const [inviting, setInviting] = useState(false);
	const [inviteData, setInviteData] = useState({
		email: "",
		full_name: "",
		location: "" as Location | "",
		is_admin: false,
	});

	// State for editing users
	const [editingUser, setEditingUser] = useState<string | null>(null);

	// State for messages
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Clear message after 5 seconds
	if (message) {
		setTimeout(() => setMessage(null), 5000);
	}

	// Handle invite user
	const handleInviteUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inviteData.location) {
			setMessage({
				type: "error",
				text: "Please select a location for the new user.",
			});
			return;
		}

		setInviting(true);
		try {
			await inviteUser({
				email: inviteData.email,
				full_name: inviteData.full_name,
				location: inviteData.location as Location,
				is_admin: inviteData.is_admin,
			});

			setMessage({
				type: "success",
				text: `User ${inviteData.full_name} has been invited successfully!`,
			});

			// Reset form
			setInviteData({
				email: "",
				full_name: "",
				location: "",
				is_admin: false,
			});
			setShowInviteForm(false);
		} catch (error) {
			setMessage({
				type: "error",
				text:
					error instanceof Error
						? error.message
						: "Failed to invite user. Please try again.",
			});
		} finally {
			setInviting(false);
		}
	};

	const handleToggleAdmin = async (
		userId: string,
		currentAdminStatus: boolean
	) => {
		try {
			await updateUserAdmin(userId, !currentAdminStatus);
			setMessage({
				type: "success",
				text: `User admin status updated successfully!`,
			});
		} catch (error) {
			console.error("Error toggling admin status:", error);
			setMessage({
				type: "error",
				text: "Failed to update admin status. Please try again.",
			});
		}
	};

	const handleLocationUpdate = async (userId: string, location: Location) => {
		try {
			await updateUserLocation(userId, location);
			setMessage({
				type: "success",
				text: `User location updated successfully!`,
			});
		} catch (error) {
			console.error("Error updating location:", error);
			setMessage({
				type: "error",
				text: "Failed to update location. Please try again.",
			});
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this user? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			await deleteUser(userId);
			setMessage({
				type: "success",
				text: "User deleted successfully!",
			});
		} catch (error) {
			console.error("Error deleting user:", error);
			setMessage({
				type: "error",
				text: "Failed to delete user. Please try again.",
			});
		}
	};

	if (authLoading || usersLoading) {
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
							Access denied. Only administrators can access user management.
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
						<Users className="w-8 h-8 text-[#bc9a64]" />
						User Management
					</h1>
					<p className="text-gray-400">
						Manage user accounts and permissions across all locations
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-white">
										{users.length}
									</p>
									<p className="text-sm text-gray-400">Total Users</p>
								</div>
								<Users className="w-8 h-8 text-[#bc9a64]" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-white">
										{users.filter((u) => u.is_admin).length}
									</p>
									<p className="text-sm text-gray-400">Administrators</p>
								</div>
								<Crown className="w-8 h-8 text-[#bc9a64]" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-white">
										{new Set(users.map((u) => u.location).filter(Boolean)).size}
									</p>
									<p className="text-sm text-gray-400">Active Locations</p>
								</div>
								<Building2 className="w-8 h-8 text-[#bc9a64]" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Message Display */}
				{message && (
					<Alert
						className={`mb-6 ${
							message.type === "success"
								? "border-green-500 bg-green-500/10"
								: "border-red-500 bg-red-500/10"
						}`}>
						{message.type === "success" ? (
							<CheckCircle className="h-4 w-4 text-green-500" />
						) : (
							<AlertCircle className="h-4 w-4 text-red-500" />
						)}
						<AlertDescription
							className={
								message.type === "success" ? "text-green-200" : "text-red-200"
							}>
							{message.text}
						</AlertDescription>
					</Alert>
				)}

				{/* Invite New User */}
				{currentUser?.is_admin && (
					<Card className="bg-[#1a1a1a] border-[#bc9a64]/20 mb-6">
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<Plus className="w-5 h-5 text-[#bc9a64]" />
								Invite New User
							</CardTitle>
						</CardHeader>
						<CardContent>
							{!showInviteForm ? (
								<div className="text-center">
									<Button
										onClick={() => setShowInviteForm(true)}
										className="w-full bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
										<Plus className="w-4 h-4 mr-2" />
										Invite User
									</Button>
								</div>
							) : (
								<form
									onSubmit={handleInviteUser}
									className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Full Name
										</label>
										<Input
											type="text"
											value={inviteData.full_name}
											onChange={(e) =>
												setInviteData((prev) => ({
													...prev,
													full_name: e.target.value,
												}))
											}
											required
											className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
											placeholder="Enter full name"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Email Address
										</label>
										<Input
											type="email"
											value={inviteData.email}
											onChange={(e) =>
												setInviteData((prev) => ({
													...prev,
													email: e.target.value,
												}))
											}
											required
											className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
											placeholder="Enter email address"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-300">
											Location
										</label>
										<Select
											value={inviteData.location}
											onValueChange={(value) =>
												setInviteData((prev) => ({
													...prev,
													location: value as Location,
												}))
											}
											required>
											<SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]">
												<SelectValue placeholder="Select location" />
											</SelectTrigger>
											<SelectContent className="bg-[#1a1a1a] border-[#333]">
												{LOCATIONS.map((location) => (
													<SelectItem
														key={location}
														value={location}
														className="text-white hover:bg-[#333]">
														{location}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="admin-checkbox"
											checked={inviteData.is_admin}
											onChange={(e) =>
												setInviteData((prev) => ({
													...prev,
													is_admin: e.target.checked,
												}))
											}
											className="rounded border-[#333] bg-[#0e0e0e] text-[#bc9a64] focus:ring-[#bc9a64]"
										/>
										<label
											htmlFor="admin-checkbox"
											className="text-sm font-medium text-gray-300">
											Make this user an admin
										</label>
									</div>
									<div className="flex gap-2">
										<Button
											type="submit"
											disabled={inviting}
											className="flex-1 bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold">
											<Mail className="w-4 h-4 mr-2" />
											{inviting ? "Sending..." : "Send Invite"}
										</Button>
										<Button
											type="button"
											onClick={() => {
												setShowInviteForm(false);
												setInviteData({
													email: "",
													full_name: "",
													location: "",
													is_admin: false,
												});
											}}
											variant="outline"
											className="border-[#333] text-gray-300 hover:bg-[#333]">
											Cancel
										</Button>
									</div>
								</form>
							)}
						</CardContent>
					</Card>
				)}

				{/* Users Table */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white">System Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{users.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-4 bg-[#0e0e0e] rounded-lg border border-[#bc9a64]/10">
									<div className="flex items-center gap-4 flex-1">
										<div className="w-12 h-12 bg-gradient-to-br from-[#bc9a64]/20 to-[#bc9a64]/10 rounded-lg flex items-center justify-center">
											{user.is_admin ? (
												<Crown className="w-6 h-6 text-[#bc9a64]" />
											) : (
												<span className="text-lg font-medium text-[#bc9a64]">
													{user.full_name?.[0] || user.email[0].toUpperCase()}
												</span>
											)}
										</div>
										<div className="flex-1">
											<p className="font-medium text-white">
												{user.full_name || "Unnamed User"}
											</p>
											<p className="text-sm text-gray-400">{user.email}</p>
											<div className="flex items-center gap-2 mt-1">
												<MapPin className="w-3 h-3 text-[#bc9a64]" />
												{currentUser?.is_admin && editingUser === user.id ? (
													<Select
														value={user.location}
														onValueChange={(value) => {
															handleLocationUpdate(user.id, value as Location);
															setEditingUser(null);
														}}>
														<SelectTrigger className="w-32 h-6 text-xs bg-[#0e0e0e] border-[#333] text-white">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="bg-[#1a1a1a] border-[#333]">
															{LOCATIONS.map((location) => (
																<SelectItem
																	key={location}
																	value={location}
																	className="text-white hover:bg-[#333]">
																	{location}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<span className="text-xs text-gray-400">
														{user.location}
													</span>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										{user.is_admin && (
											<Badge className="bg-[#bc9a64]/20 text-[#bc9a64] border-[#bc9a64]/30">
												<Crown className="w-3 h-3 mr-1" />
												Admin
											</Badge>
										)}

										{currentUser?.is_admin && (
											<div className="flex items-center gap-2">
												{/* Edit Location Button */}
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														setEditingUser(
															editingUser === user.id ? null : user.id
														)
													}
													className="border-[#333] text-gray-300 hover:bg-[#333] p-2">
													<Edit className="w-3 h-3" />
												</Button>

												{/* Toggle Admin Button */}
												{currentUser.id !== user.id && (
													<Button
														onClick={() =>
															handleToggleAdmin(user.id, user.is_admin)
														}
														size="sm"
														variant={user.is_admin ? "destructive" : "outline"}
														className={
															user.is_admin
																? "bg-red-600 hover:bg-red-700 text-white"
																: "border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10 hover:text-white hover:border-[#bc9a64]/40"
														}>
														<Shield className="w-3 h-3 mr-1" />
														{user.is_admin ? "Remove Admin" : "Make Admin"}
													</Button>
												)}

												{/* Delete User Button */}
												{currentUser.id !== user.id && (
													<Button
														onClick={() => handleDeleteUser(user.id)}
														size="sm"
														variant="destructive"
														className="bg-red-600 hover:bg-red-700 text-white p-2">
														<Trash2 className="w-3 h-3" />
													</Button>
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						{users.length === 0 && (
							<div className="text-center py-12">
								<Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
								<p className="text-gray-400 text-lg">No users found</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Instructions */}
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader>
						<CardTitle className="text-white">Instructions</CardTitle>
					</CardHeader>
					<CardContent className="text-gray-300 space-y-2">
						<p>• New users can be invited through the dashboard settings</p>
						<p>
							• Regular users can only view and edit data for their assigned
							location
						</p>
						<p>
							• Administrators have full access to all locations and user
							management
						</p>
						<p>• You cannot remove admin privileges from your own account</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
