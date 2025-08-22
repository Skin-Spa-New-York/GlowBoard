import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { LOCATIONS, Location } from "@/types/entities";

export interface LocationGoals {
	location: Location;
	salesGoal: number;
	retailGoal: number;
}

export function useLocationGoals() {
	const [locationGoals, setLocationGoals] = useState<LocationGoals[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize default goals
	const initializeDefaultGoals = (): LocationGoals[] => {
		return LOCATIONS.map((location) => ({
			location,
			salesGoal: 50000, // Default service goal
			retailGoal: 25000, // Default retail goal
		}));
	};

	// Load goals from Firestore
	const loadGoals = async () => {
		try {
			setLoading(true);
			const goalsDoc = await getDoc(doc(db, "settings", "locationGoals"));

			if (goalsDoc.exists()) {
				const data = goalsDoc.data();
				setLocationGoals(data.goals || initializeDefaultGoals());
			} else {
				// Initialize with defaults if no goals exist
				const defaultGoals = initializeDefaultGoals();
				setLocationGoals(defaultGoals);
				await saveGoals(defaultGoals);
			}
		} catch (err) {
			console.error("Error loading location goals:", err);
			setError("Failed to load location goals");
			setLocationGoals(initializeDefaultGoals());
		} finally {
			setLoading(false);
		}
	};

	// Save goals to Firestore
	const saveGoals = async (goals: LocationGoals[]) => {
		try {
			await setDoc(doc(db, "settings", "locationGoals"), {
				goals,
				updatedAt: new Date().toISOString(),
			});
			setLocationGoals(goals);
			return { success: true };
		} catch (err) {
			console.error("Error saving location goals:", err);
			setError("Failed to save location goals");
			return { success: false, error: "Failed to save location goals" };
		}
	};

	// Update a specific goal
	const updateGoal = (
		location: Location,
		field: "salesGoal" | "retailGoal",
		value: number
	) => {
		setLocationGoals((prev) =>
			prev.map((goal) =>
				goal.location === location ? { ...goal, [field]: value } : goal
			)
		);
	};

	useEffect(() => {
		loadGoals();
	}, []);

	return {
		locationGoals,
		loading,
		error,
		saveGoals,
		updateGoal,
		refreshGoals: loadGoals,
	};
}
