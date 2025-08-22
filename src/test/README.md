# Integration Tests

This directory contains comprehensive integration tests for the OnSale MedSpa Analytics application.

## Test Structure

```
src/test/
├── integration/           # Integration test suites
│   ├── App.test.tsx      # Main app integration tests
│   ├── routing.test.tsx  # Routing utilities tests
│   ├── services.test.tsx # Entity services tests
│   ├── hooks.test.tsx    # Custom hooks tests
│   ├── utils.test.tsx    # Utility functions tests
│   ├── components.test.tsx # Component integration tests
│   └── e2e.test.tsx      # End-to-end integration tests
├── setup.ts              # Test environment setup
├── test-utils.tsx        # Testing utilities and mocks
├── run-tests.ts          # Test runner script
└── README.md            # This file
```

## Running Tests

### All Tests

```bash
npm test                  # Run all tests in watch mode
npm run test:run         # Run all tests once
npm run test:integration # Run integration tests with custom runner
```

### Specific Test Suites

```bash
npm run test:integration routing    # Test routing utilities
npm run test:integration services   # Test entity services
npm run test:integration hooks      # Test custom hooks
npm run test:integration utils      # Test utility functions
npm run test:integration components # Test component integration
npm run test:integration app        # Test main app integration
npm run test:integration e2e        # Test end-to-end scenarios
```

### Development

```bash
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with UI interface
npm run test:coverage   # Run tests with coverage report
```

## Test Categories

### 1. Routing Tests (`routing.test.tsx`)

- URL generation and parsing
- Navigation item configuration
- Route parameter handling

### 2. Service Tests (`services.test.tsx`)

- Entity service structure
- Method signatures and return types
- Error handling for unimplemented methods

### 3. Hook Tests (`hooks.test.tsx`)

- `useAuth` authentication flow
- `useSalesData` data management
- Error handling and loading states

### 4. Utility Tests (`utils.test.tsx`)

- Date range calculations
- Sales statistics computation
- Data filtering and transformation

### 5. Component Tests (`components.test.tsx`)

- Component rendering and props
- User interaction handling
- Conditional display logic

### 6. App Integration Tests (`App.test.tsx`)

- Application startup and routing
- Component integration
- Error boundary behavior

### 7. End-to-End Tests (`e2e.test.tsx`)

- Complete user workflows
- Data flow between components
- Authentication and authorization
- Loading and error states

## Test Utilities

### Mock Data

The `test-utils.tsx` file provides:

- `mockUser` - Standard user object
- `mockAdminUser` - Admin user object
- `mockSalesRecord` - Sample sales record
- `mockNote` - Sample note object

### Mock Services

Pre-configured mocks for all entity services:

- `mockServices.UserEntity`
- `mockServices.SalesRecordEntity`
- `mockServices.NoteEntity`
- `mockServices.AuditLogEntity`

### Custom Render

Enhanced render function with providers:

```typescript
import { render, screen } from "../test-utils";

// Automatically includes BrowserRouter and other providers
render(<MyComponent />);
```

## Writing New Tests

### 1. Component Tests

```typescript
import { render, screen } from "../test-utils";
import MyComponent from "../../components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### 2. Hook Tests

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useMyHook } from "../../hooks/useMyHook";

describe("useMyHook", () => {
  it("returns expected data", async () => {
    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### 3. Integration Tests

```typescript
import { render, screen, waitFor } from "../test-utils";
import { vi } from "vitest";

// Mock dependencies
vi.mock("@/services/entities", () => mockServices);

describe("Integration Test", () => {
  it("integrates components correctly", async () => {
    render(<IntegratedComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("component")).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Use descriptive test names** that explain what is being tested
2. **Mock external dependencies** to isolate the code under test
3. **Test user interactions** rather than implementation details
4. **Use `waitFor`** for asynchronous operations
5. **Clean up mocks** between tests with `vi.clearAllMocks()`
6. **Test error conditions** as well as happy paths
7. **Keep tests focused** on a single concern

## Continuous Integration

Tests are designed to run in CI environments:

```bash
npm run test:ci  # Verbose output for CI
```

The tests include:

- Proper cleanup between tests
- Mock implementations for browser APIs
- Timeout handling for async operations
- Comprehensive error scenarios

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in `waitFor` calls
2. **Mock not working**: Ensure mock is defined before import
3. **Component not rendering**: Check for missing providers
4. **Async operations failing**: Use `waitFor` for state changes

### Debug Mode

```bash
npm run test:ui  # Visual test interface
```

This opens a browser interface where you can:

- See test results in real-time
- Debug failing tests
- Inspect component renders
- View console output
