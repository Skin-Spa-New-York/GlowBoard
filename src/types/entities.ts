// Location enum used across all entities
export const LOCATIONS = [
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
] as const;

export type Location = (typeof LOCATIONS)[number];

// Custom location names interface
export interface LocationSettings {
	locationId: Location;
	customName: string;
	manager?: string;
}

// Product Categories - Retail Sales by Brand
export interface ProductBreakdown {
	skincare?: number;
	supplements?: number;
	devices?: number;
	gift_cards?: number;
	other?: number;
}

// Retail Sales by Brand
export interface RetailBreakdown {
	[brand: string]: number;
}

// Service Categories
export interface ServiceBreakdown {
	botox?: { appointments: number; sales: number };
	dysport?: { appointments: number; sales: number };
	filler?: { appointments: number; sales: number };
	sculptra?: { appointments: number; sales: number };
	laser_genesis?: { appointments: number; sales: number };
	hydrafacial?: { appointments: number; sales: number };
	chemical_peel?: { appointments: number; sales: number };
	microneedling?: { appointments: number; sales: number };
	prp?: { appointments: number; sales: number };
	consultation?: { appointments: number; sales: number };
	other_services?: { appointments: number; sales: number };
}

// Individual Seller Performance
export interface SellerPerformance {
	name: string;
	sales: number;
	location: Location;
}

// Sales Record Entity
export interface SalesRecord {
	id?: string;
	location: Location;
	date: string; // ISO date string

	// Core required fields
	daily_service_sales: number;
	retail_daily_sales: RetailBreakdown;
	number_of_clients: number;
	number_of_appointments: number;

	// Membership metrics
	membership_count?: number;
	membership_revenue?: number;

	// Legacy field for backward compatibility
	daily_sales?: number;
	treatments_count?: number;

	// Detailed breakdowns
	product_breakdown?: ProductBreakdown;
	service_breakdown?: ServiceBreakdown;
	top_sellers?: SellerPerformance[];

	// Additional metrics
	total_appointments?: number;
	conversion_rate?: number; // percentage
	average_ticket?: number;

	notes?: string;
	created_at?: string;
	updated_at?: string;
}

// Note Entity
export interface Note {
	id?: string;
	location: Location;
	date?: string; // ISO date string
	title: string;
	content: string;
	visible_until?: string; // ISO date string
	priority: "low" | "medium" | "high";
	created_date?: string;
	updated_date?: string;
}

// User Entity
export interface User {
	id?: string;
	email: string;
	full_name?: string;
	location?: Location;
	is_admin: boolean;
	created_at?: string;
	updated_at?: string;
}

// Audit Log Entity
export interface AuditLog {
	id?: string;
	user_email: string;
	action_type:
		| "create"
		| "update"
		| "delete"
		| "login"
		| "logout"
		| "user_created"
		| "user_updated";
	entity_type?: "SalesRecord" | "Note" | "User";
	entity_id?: string;
	old_values?: Record<string, any>;
	new_values?: Record<string, any>;
	location?: string;
	ip_address?: string;
	details?: string;
	created_at?: string;
}
