import { auth, db } from "@/config/firebase";

export const testFirebaseConnection = async () => {
	console.log("Testing Firebase connection...");

	try {
		// Test auth connection
		console.log("Auth instance:", auth);
		console.log("Auth config:", auth.config);

		// Test Firestore connection
		console.log("Firestore instance:", db);
		console.log("Firestore app:", db.app);

		return true;
	} catch (error) {
		console.error("Firebase connection test failed:", error);
		return false;
	}
};
