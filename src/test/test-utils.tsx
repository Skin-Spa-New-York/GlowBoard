import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock data for testing - minimal data for test functionality only

// Test data for testing functionality
const testUser = {
  id: "test1",
  email: "test@example.com",
  full_name: "Test User",
  location: "Flatiron" as const,
  is_admin: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

const testSalesRecord = {
  id: "test1",
  location: "Flatiron" as const,
  date: "2023-12-01",
  daily_sales: 5000,
  treatments_count: 25,
  notes: "Test record",
  created_at: "2023-12-01T00:00:00Z",
  updated_at: "2023-12-01T00:00:00Z",
};

// Mock services - minimal implementations for testing
export const mockServices = {
  UserEntity: {
    me: vi.fn().mockResolvedValue(testUser),
    list: vi.fn().mockResolvedValue([testUser]),
    create: vi.fn().mockResolvedValue(testUser),
    update: vi.fn().mockResolvedValue(testUser),
    delete: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
  },
  SalesRecordEntity: {
    list: vi.fn().mockResolvedValue([testSalesRecord]),
    create: vi.fn().mockResolvedValue(testSalesRecord),
    update: vi.fn().mockResolvedValue(testSalesRecord),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(testSalesRecord),
  },
  NoteEntity: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({}),
  },
  AuditLogEntity: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({}),
  },
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
