import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	Timestamp,
} from "firebase/firestore";
import {
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import { db, auth } from "@/config/firebase";
import { logger } from "@/utils/logger";
import type {
	SalesRecord,
	Note,
	User,
	AuditLog,
	Location,
} from "@/types/entities";

// Collections
const COLLECTIONS = {
	SALES_RECORDS: "salesRecords",
	NOTES: "notes",
	USERS: "users",
	AUDIT_LOGS: "auditLogs",
} as const;

// Helper function to convert Firestore timestamp to ISO string
const timestampToString = (timestamp: any): string => {
	if (timestamp?.toDate) {
		return timestamp.toDate().toISOString();
	}
	return new Date().toISOString();
};

// Helper function to convert data from Firestore
const convertFirestoreData = (doc: any): any => {
	const data = doc.data();
	return {
		id: doc.id,
		...data,
		created_at: timestampToString(data.created_at),
		updated_at: timestampToString(data.updated_at),
	};
};

// Base Firebase service class
abstract class BaseFirebaseService<T> {
	protected abstract collectionName: string;

	async list(): Promise<T[]> {
		try {
			const querySnapshot = await getDocs(collection(db, this.collectionName));
			return querySnapshot.docs.map(convertFirestoreData);
		} catch (error) {
			logger.error(`Error fetching ${this.collectionName}`, error);
			throw new Error(`Failed to fetch ${this.collectionName}`);
		}
	}

	async get(id: string): Promise<T> {
		try {
			const docRef = doc(db, this.collectionName, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				throw new Error(`${this.collectionName} not found`);
			}

			return convertFirestoreData(docSnap);
		} catch (error) {
			logger.error(`Error fetching ${this.collectionName}`, error);
			throw error;
		}
	}

	async create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T> {
		try {
			const now = Timestamp.now();
			const docData = {
				...data,
				created_at: now,
				updated_at: now,
			};

			const docRef = await addDoc(collection(db, this.collectionName), docData);
			const newDoc = await getDoc(docRef);

			return convertFirestoreData(newDoc);
		} catch (error) {
			logger.error(`Error creating ${this.collectionName}`, error);
			throw new Error(`Failed to create ${this.collectionName}`);
		}
	}

	async update(id: string, data: Partial<T>): Promise<T> {
		try {
			const docRef = doc(db, this.collectionName, id);
			const updateData = {
				...data,
				updated_at: Timestamp.now(),
			};

			await updateDoc(docRef, updateData);
			const updatedDoc = await getDoc(docRef);

			return convertFirestoreData(updatedDoc);
		} catch (error) {
			logger.error(`Error updating ${this.collectionName}`, error);
			throw new Error(`Failed to update ${this.collectionName}`);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const docRef = doc(db, this.collectionName, id);
			await deleteDoc(docRef);
		} catch (error) {
			logger.error(`Error deleting ${this.collectionName}`, error);
			throw new Error(`Failed to delete ${this.collectionName}`);
		}
	}
}

// Sales Record Firebase Service
class SalesRecordFirebaseService extends BaseFirebaseService<SalesRecord> {
	protected collectionName = COLLECTIONS.SALES_RECORDS;

	async getByLocation(location: Location): Promise<SalesRecord[]> {
		try {
			const q = query(
				collection(db, this.collectionName),
				where("location", "==", location),
				orderBy("date", "desc")
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(convertFirestoreData);
		} catch (error) {
			logger.error("Error fetching sales by location", error);
			throw new Error("Failed to fetch sales by location");
		}
	}

	async getByDateRange(
		startDate: string,
		endDate: string
	): Promise<SalesRecord[]> {
		try {
			const q = query(
				collection(db, this.collectionName),
				where("date", ">=", startDate),
				where("date", "<=", endDate),
				orderBy("date", "desc")
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(convertFirestoreData);
		} catch (error) {
			logger.error("Error fetching sales by date range", error);
			throw new Error("Failed to fetch sales by date range");
		}
	}
}

// Note Firebase Service
class NoteFirebaseService extends BaseFirebaseService<Note> {
	protected collectionName = COLLECTIONS.NOTES;

	async getByLocation(location: Location): Promise<Note[]> {
		try {
			const q = query(
				collection(db, this.collectionName),
				where("location", "==", location),
				orderBy("created_at", "desc")
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(convertFirestoreData);
		} catch (error) {
			logger.error("Error fetching notes by location", error);
			throw new Error("Failed to fetch notes by location");
		}
	}
}

// User Firebase Service
class UserFirebaseService extends BaseFirebaseService<User> {
	protected collectionName = COLLECTIONS.USERS;

	async me(): Promise<User> {
		return new Promise((resolve, reject) => {
			const unsubscribe = onAuthStateChanged(
				auth,
				async (firebaseUser: any) => {
					unsubscribe();

					if (!firebaseUser) {
						reject(new Error("Not authenticated"));
						return;
					}

					try {
						// Check if user exists in our database
						const q = query(
							collection(db, this.collectionName),
							where("email", "==", firebaseUser.email)
						);
						const querySnapshot = await getDocs(q);

						if (querySnapshot.empty) {
							// Check if this is the first user in the system
							const isFirstUser = await this.isFirstUser();

							// Create new user if doesn't exist
							const newUser = await this.create({
								email: firebaseUser.email!,
								full_name: firebaseUser.displayName || "",
								location: "Flatiron" as Location, // Default location
								is_admin: isFirstUser, // Make first user admin
							});
							resolve(newUser);
						} else {
							// Return existing user
							const userDoc = querySnapshot.docs[0];
							resolve(convertFirestoreData(userDoc));
						}
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	}

	async login(): Promise<User> {
		try {
			const provider = new GoogleAuthProvider();
			provider.addScope("email");
			provider.addScope("profile");

			const result = await signInWithPopup(auth, provider);

			if (!result.user.email) {
				throw new Error("No email found in Google account");
			}

			// Check if user exists in our database
			const q = query(
				collection(db, this.collectionName),
				where("email", "==", result.user.email)
			);
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				// Check if this is the first user in the system
				const isFirstUser = await this.isFirstUser();

				// Create new user
				return await this.create({
					email: result.user.email,
					full_name: result.user.displayName || "",
					location: "Flatiron" as Location,
					is_admin: isFirstUser, // Make first user admin
				});
			} else {
				// Return existing user
				const userDoc = querySnapshot.docs[0];
				return convertFirestoreData(userDoc);
			}
		} catch (error) {
			logger.error("Error during login", error);
			console.error("Login error details:", error);

			if (error.code === "auth/popup-blocked") {
				throw new Error(
					"Popup was blocked. Please allow popups for this site and try again."
				);
			} else if (error.code === "auth/popup-closed-by-user") {
				throw new Error("Login was cancelled. Please try again.");
			} else if (error.code === "auth/unauthorized-domain") {
				throw new Error(
					"This domain is not authorized for Google sign-in. Please contact support."
				);
			} else {
				throw new Error(`Login failed: ${error.message || "Unknown error"}`);
			}
		}
	}

	async logout(): Promise<void> {
		try {
			await signOut(auth);
		} catch (error) {
			logger.error("Error during logout", error);
			throw new Error("Failed to logout");
		}
	}

	async getByEmail(email: string): Promise<User | null> {
		try {
			const q = query(
				collection(db, this.collectionName),
				where("email", "==", email)
			);
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				return null;
			}

			return convertFirestoreData(querySnapshot.docs[0]);
		} catch (error) {
			logger.error("Error fetching user by email", error);
			throw new Error("Failed to fetch user by email");
		}
	}

	private async isFirstUser(): Promise<boolean> {
		try {
			const querySnapshot = await getDocs(collection(db, this.collectionName));
			return querySnapshot.empty;
		} catch (error) {
			logger.error("Error checking if first user", error);
			// If we can't check, default to false for security
			return false;
		}
	}

	async promoteToAdmin(email: string): Promise<User> {
		try {
			const user = await this.getByEmail(email);
			if (!user || !user.id) {
				throw new Error("User not found");
			}

			return await this.update(user.id, { is_admin: true });
		} catch (error) {
			logger.error("Error promoting user to admin", error);
			throw new Error("Failed to promote user to admin");
		}
	}
}

// Audit Log Firebase Service
class AuditLogFirebaseService extends BaseFirebaseService<AuditLog> {
	protected collectionName = COLLECTIONS.AUDIT_LOGS;

	async logAction(
		action:
			| "create"
			| "update"
			| "delete"
			| "login"
			| "logout"
			| "user_created"
			| "user_updated",
		entityType: "SalesRecord" | "Note" | "User",
		entityId: string,
		oldData?: any,
		newData?: any
	): Promise<AuditLog> {
		try {
			const currentUser = auth.currentUser;
			if (!currentUser) {
				throw new Error("No authenticated user for audit log");
			}

			const auditData = {
				action_type: action,
				entity_type: entityType,
				entity_id: entityId,
				user_email: currentUser.email!,
				old_values: oldData || undefined,
				new_values: newData || undefined,
				location: "System",
				details: `${action} performed on ${entityType}`,
				ip_address: "Unknown",
			};

			return await this.create(auditData);
		} catch (error) {
			logger.error("Error creating audit log", error);
			throw new Error("Failed to create audit log");
		}
	}
}

// Export service instances
export const SalesRecordFirebaseEntity = new SalesRecordFirebaseService();
export const NoteFirebaseEntity = new NoteFirebaseService();
export const UserFirebaseEntity = new UserFirebaseService();
export const AuditLogFirebaseEntity = new AuditLogFirebaseService();

// Export Firebase instances for direct use
export { db, auth } from "@/config/firebase";

// Auth state observer
export const onAuthStateChange = (callback: (user: any) => void) => {
	return onAuthStateChanged(auth, callback);
};
