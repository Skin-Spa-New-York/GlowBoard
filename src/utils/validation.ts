/**
 * Input validation and sanitization utilities
 */

import { Location, LOCATIONS } from "@/types/entities";

// Validation rules
export const VALIDATION_RULES = {
  SALES_AMOUNT: {
    MIN: 0,
    MAX: 1000000, // $1M max per day
  },
  TREATMENTS_COUNT: {
    MIN: 0,
    MAX: 1000, // 1000 treatments max per day
  },
  TEXT_LENGTH: {
    TITLE_MAX: 100,
    CONTENT_MAX: 2000,
    NOTES_MAX: 500,
  },
} as const;

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ValidationResult {
  public isValid: boolean;
  public errors: ValidationError[];
  public sanitizedValue?: any;

  constructor(
    isValid: boolean,
    errors: ValidationError[] = [],
    sanitizedValue?: any
  ) {
    this.isValid = isValid;
    this.errors = errors;
    this.sanitizedValue = sanitizedValue;
  }
}

// Sanitization functions
export const sanitize = {
  /**
   * Sanitize text input by removing potentially harmful characters
   */
  text: (input: string): string => {
    if (typeof input !== "string") return "";

    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .slice(0, VALIDATION_RULES.TEXT_LENGTH.CONTENT_MAX); // Limit length
  },

  /**
   * Sanitize numeric input
   */
  number: (input: any): number => {
    const num = parseFloat(input);
    return isNaN(num) ? 0 : num;
  },

  /**
   * Sanitize email input
   */
  email: (input: string): string => {
    if (typeof input !== "string") return "";
    return input.trim().toLowerCase();
  },
};

// Validation functions
export const validate = {
  /**
   * Validate sales amount
   */
  salesAmount: (amount: any): ValidationResult => {
    const errors: ValidationError[] = [];
    const sanitizedAmount = sanitize.number(amount);

    if (sanitizedAmount < VALIDATION_RULES.SALES_AMOUNT.MIN) {
      errors.push({
        field: "daily_sales",
        message: "Sales amount cannot be negative",
        code: "SALES_AMOUNT_TOO_LOW",
      });
    }

    if (sanitizedAmount > VALIDATION_RULES.SALES_AMOUNT.MAX) {
      errors.push({
        field: "daily_sales",
        message: `Sales amount cannot exceed $${VALIDATION_RULES.SALES_AMOUNT.MAX.toLocaleString()}`,
        code: "SALES_AMOUNT_TOO_HIGH",
      });
    }

    return new ValidationResult(errors.length === 0, errors, sanitizedAmount);
  },

  /**
   * Validate treatments count
   */
  treatmentsCount: (count: any): ValidationResult => {
    const errors: ValidationError[] = [];
    const sanitizedCount = sanitize.number(count);

    if (sanitizedCount < VALIDATION_RULES.TREATMENTS_COUNT.MIN) {
      errors.push({
        field: "treatments_count",
        message: "Treatments count cannot be negative",
        code: "TREATMENTS_COUNT_TOO_LOW",
      });
    }

    if (sanitizedCount > VALIDATION_RULES.TREATMENTS_COUNT.MAX) {
      errors.push({
        field: "treatments_count",
        message: `Treatments count cannot exceed ${VALIDATION_RULES.TREATMENTS_COUNT.MAX}`,
        code: "TREATMENTS_COUNT_TOO_HIGH",
      });
    }

    return new ValidationResult(
      errors.length === 0,
      errors,
      Math.floor(sanitizedCount)
    );
  },

  /**
   * Validate location
   */
  location: (location: any): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!location || typeof location !== "string") {
      errors.push({
        field: "location",
        message: "Location is required",
        code: "LOCATION_REQUIRED",
      });
      return new ValidationResult(false, errors);
    }

    if (!LOCATIONS.includes(location as Location)) {
      errors.push({
        field: "location",
        message: "Invalid location selected",
        code: "LOCATION_INVALID",
      });
    }

    return new ValidationResult(errors.length === 0, errors, location);
  },

  /**
   * Validate date
   */
  date: (date: any): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!date) {
      errors.push({
        field: "date",
        message: "Date is required",
        code: "DATE_REQUIRED",
      });
      return new ValidationResult(false, errors);
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      errors.push({
        field: "date",
        message: "Invalid date format",
        code: "DATE_INVALID",
      });
      return new ValidationResult(false, errors);
    }

    // Check if date is not too far in the future (max 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (dateObj > oneYearFromNow) {
      errors.push({
        field: "date",
        message: "Date cannot be more than 1 year in the future",
        code: "DATE_TOO_FUTURE",
      });
    }

    return new ValidationResult(
      errors.length === 0,
      errors,
      dateObj.toISOString().split("T")[0]
    );
  },

  /**
   * Validate text input
   */
  text: (
    text: any,
    maxLength: number = VALIDATION_RULES.TEXT_LENGTH.CONTENT_MAX
  ): ValidationResult => {
    const errors: ValidationError[] = [];

    if (typeof text !== "string") {
      return new ValidationResult(true, [], "");
    }

    const sanitizedText = sanitize.text(text);

    if (sanitizedText.length > maxLength) {
      errors.push({
        field: "text",
        message: `Text cannot exceed ${maxLength} characters`,
        code: "TEXT_TOO_LONG",
      });
    }

    return new ValidationResult(errors.length === 0, errors, sanitizedText);
  },

  /**
   * Validate email
   */
  email: (email: any): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!email || typeof email !== "string") {
      errors.push({
        field: "email",
        message: "Email is required",
        code: "EMAIL_REQUIRED",
      });
      return new ValidationResult(false, errors);
    }

    const sanitizedEmail = sanitize.email(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      errors.push({
        field: "email",
        message: "Invalid email format",
        code: "EMAIL_INVALID",
      });
    }

    return new ValidationResult(errors.length === 0, errors, sanitizedEmail);
  },
};

/**
 * Validate sales record data
 */
export const validateSalesRecord = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: any = {};

  // Validate location
  const locationResult = validate.location(data.location);
  if (!locationResult.isValid) {
    errors.push(...locationResult.errors);
  } else {
    sanitizedData.location = locationResult.sanitizedValue;
  }

  // Validate date
  const dateResult = validate.date(data.date);
  if (!dateResult.isValid) {
    errors.push(...dateResult.errors);
  } else {
    sanitizedData.date = dateResult.sanitizedValue;
  }

  // Validate sales amount
  const salesResult = validate.salesAmount(data.daily_sales);
  if (!salesResult.isValid) {
    errors.push(...salesResult.errors);
  } else {
    sanitizedData.daily_sales = salesResult.sanitizedValue;
  }

  // Validate treatments count (optional)
  if (data.treatments_count !== undefined && data.treatments_count !== "") {
    const treatmentsResult = validate.treatmentsCount(data.treatments_count);
    if (!treatmentsResult.isValid) {
      errors.push(...treatmentsResult.errors);
    } else {
      sanitizedData.treatments_count = treatmentsResult.sanitizedValue;
    }
  }

  // Validate notes (optional)
  if (data.notes) {
    const notesResult = validate.text(
      data.notes,
      VALIDATION_RULES.TEXT_LENGTH.NOTES_MAX
    );
    if (!notesResult.isValid) {
      errors.push(...notesResult.errors);
    } else {
      sanitizedData.notes = notesResult.sanitizedValue;
    }
  }

  return new ValidationResult(errors.length === 0, errors, sanitizedData);
};

/**
 * Validate note data
 */
export const validateNote = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: any = {};

  // Validate location
  const locationResult = validate.location(data.location);
  if (!locationResult.isValid) {
    errors.push(...locationResult.errors);
  } else {
    sanitizedData.location = locationResult.sanitizedValue;
  }

  // Validate title
  const titleResult = validate.text(
    data.title,
    VALIDATION_RULES.TEXT_LENGTH.TITLE_MAX
  );
  if (!titleResult.isValid) {
    errors.push(...titleResult.errors);
  } else if (!titleResult.sanitizedValue?.trim()) {
    errors.push({
      field: "title",
      message: "Title is required",
      code: "TITLE_REQUIRED",
    });
  } else {
    sanitizedData.title = titleResult.sanitizedValue;
  }

  // Validate content
  const contentResult = validate.text(
    data.content,
    VALIDATION_RULES.TEXT_LENGTH.CONTENT_MAX
  );
  if (!contentResult.isValid) {
    errors.push(...contentResult.errors);
  } else if (!contentResult.sanitizedValue?.trim()) {
    errors.push({
      field: "content",
      message: "Content is required",
      code: "CONTENT_REQUIRED",
    });
  } else {
    sanitizedData.content = contentResult.sanitizedValue;
  }

  // Validate priority
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(data.priority)) {
    errors.push({
      field: "priority",
      message: "Invalid priority level",
      code: "PRIORITY_INVALID",
    });
  } else {
    sanitizedData.priority = data.priority;
  }

  // Validate visible_until (optional)
  if (data.visible_until) {
    const dateResult = validate.date(data.visible_until);
    if (!dateResult.isValid) {
      errors.push(...dateResult.errors);
    } else {
      sanitizedData.visible_until = dateResult.sanitizedValue;
    }
  }

  return new ValidationResult(errors.length === 0, errors, sanitizedData);
};
