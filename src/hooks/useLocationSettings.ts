import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { LOCATIONS, Location, LocationSettings } from "@/types/entities";

export function useLocationSettings() {
	const [locationSettings, setLocationSettings] = useState<LocationSettings[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize default settings
	const initializeDefaultSettings = (): LocationSettings[] => {
		return LOCATIONS.map((location) => ({
			locationId: location,
			customName: location, // Default to the original name
			manager: "",
		}));
	};

	// Load settings from Firestore
	const loadSettings = async () => {
		try {
			setLoading(true);
			const settingsDoc = await getDoc(doc(db, "settings", "locationSettings"));

			if (settingsDoc.exists()) {
				const data = settingsDoc.data();
				setLocationSettings(data.settings || initializeDefaultSettings());
			} else {
				// Initialize with defaults if no settings exist
				const defaultSettings = initializeDefaultSettings();
				setLocationSettings(defaultSettings);
				await saveSettings(defaultSettings);
			}
		} catch (err) {
			console.error("Error loading location settings:", err);
			setError("Failed to load location settings");
			setLocationSettings(initializeDefaultSettings());
		} finally {
			setLoading(false);
		}
	};

	// Save settings to Firestore
	const saveSettings = async (settings: LocationSettings[]) => {
		try {
			await setDoc(doc(db, "settings", "locationSettings"), {
				settings,
				updatedAt: new Date().toISOString(),
			});
			setLocationSettings(settings);
			return { success: true };
		} catch (err) {
			console.error("Error saving location settings:", err);
			setError("Failed to save location settings");
			return { success: false, error: "Failed to save location settings" };
		}
	};

	// Update a specific setting
	const updateSetting = (
		locationId: Location,
		field: keyof Omit<LocationSettings, "locationId">,
		value: string
	) => {
		setLocationSettings((prev) =>
			prev.map((setting) =>
				setting.locationId === locationId
					? { ...setting, [field]: value }
					: setting
			)
		);
	};

	// Get display name for a location
	const getLocationDisplayName = (locationId: Location): string => {
		const setting = locationSettings.find((s) => s.locationId === locationId);
		return setting?.customName || locationId;
	};

	useEffect(() => {
		loadSettings();
	}, []);

	return {
		locationSettings,
		loading,
		error,
		saveSettings,
		updateSetting,
		getLocationDisplayName,
		refreshSettings: loadSettings,
	};
}
