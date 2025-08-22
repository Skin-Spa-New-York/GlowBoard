import {
	format,
	subDays,
	startOfMonth,
	endOfMonth,
	subYears,
	startOfYear,
	endOfYear,
	startOfQuarter,
	endOfQuarter,
	subWeeks,
	subMonths,
} from "date-fns";

export type TimeframeType =
	| "yesterday"
	| "1day"
	| "7days"
	| "1month"
	| "1quarter"
	| "6months"
	| "1year"
	| "custom";

export interface DateRange {
	start: Date;
	end: Date;
	prevStart: Date;
	prevEnd: Date;
}

/**
 * Get date range for a given timeframe with year-over-year comparison dates
 */
export function getDateRange(
	timeframe: TimeframeType,
	customStart?: Date,
	customEnd?: Date
): DateRange {
	const today = new Date();

	const yesterday = subDays(today, 1);

	switch (timeframe) {
		case "yesterday":
			return {
				start: yesterday,
				end: yesterday,
				prevStart: subYears(yesterday, 1),
				prevEnd: subYears(yesterday, 1),
			};

		case "1day":
			return {
				start: today,
				end: today,
				prevStart: subYears(today, 1),
				prevEnd: subYears(today, 1),
			};

		case "7days":
			return {
				start: subDays(today, 6),
				end: today,
				prevStart: subDays(subYears(today, 1), 6),
				prevEnd: subYears(today, 1),
			};

		case "1month":
			return {
				start: startOfMonth(today),
				end: endOfMonth(today),
				prevStart: startOfMonth(subYears(today, 1)),
				prevEnd: endOfMonth(subYears(today, 1)),
			};

		case "1quarter":
			return {
				start: startOfQuarter(today),
				end: endOfQuarter(today),
				prevStart: startOfQuarter(subYears(today, 1)),
				prevEnd: endOfQuarter(subYears(today, 1)),
			};

		case "6months":
			return {
				start: subMonths(today, 6),
				end: today,
				prevStart: subMonths(subYears(today, 1), 6),
				prevEnd: subYears(today, 1),
			};

		case "1year":
			return {
				start: startOfYear(today),
				end: endOfYear(today),
				prevStart: startOfYear(subYears(today, 1)),
				prevEnd: endOfYear(subYears(today, 1)),
			};

		case "custom":
			if (customStart && customEnd) {
				const daysDiff = Math.ceil(
					(customEnd.getTime() - customStart.getTime()) / (1000 * 60 * 60 * 24)
				);
				return {
					start: customStart,
					end: customEnd,
					prevStart: subDays(customStart, daysDiff + 365),
					prevEnd: subDays(customEnd, 365),
				};
			}
			// Fallback to yesterday if custom dates not provided
			return getDateRange("yesterday");

		default:
			return getDateRange("yesterday");
	}
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
	return date >= start && date <= end;
}

/**
 * Format date for display based on timeframe
 */
export function formatDateForTimeframe(
	date: Date,
	timeframe: TimeframeType
): string {
	switch (timeframe) {
		case "yesterday":
		case "1day":
		case "7days":
			return format(date, "MMM d");
		case "1month":
		case "1quarter":
		case "6months":
		case "1year":
			return format(date, "MMM yyyy");
		default:
			return format(date, "MMM d");
	}
}

/**
 * Get timeframe label for display
 */
export function getTimeframeLabel(timeframe: TimeframeType): string {
	switch (timeframe) {
		case "yesterday":
			return "Yesterday";
		case "1day":
			return "Today";
		case "7days":
			return "Last 7 Days";
		case "1month":
			return "This Month";
		case "1quarter":
			return "This Quarter";
		case "6months":
			return "Last 6 Months";
		case "1year":
			return "This Year";
		case "custom":
			return "Custom Period";
		default:
			return "Yesterday";
	}
}
