import { useState, useEffect } from "react";
import type { User } from "@/types/entities";
import { UserEntity } from "@/services/entities";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		setLoading(true);
		setError(null);
		try {
			const currentUser = await UserEntity.me();
			setUser(currentUser);
		} catch (err) {
			console.error("Auth error:", err);
			setError(err instanceof Error ? err.message : "Failed to load user");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await UserEntity.logout();
			setUser(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to logout");
		}
	};

	return {
		user,
		loading,
		error,
		isAuthenticated: !!user,
		isAdmin: user?.is_admin || false,
		userLocation: user?.location,
		logout,
		refetch: loadUser,
	};
}
