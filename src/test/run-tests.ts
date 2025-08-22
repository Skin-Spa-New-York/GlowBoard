#!/usr/bin/env node

/**
 * Test runner script for integration tests
 * This script can be used to run specific test suites or all tests
 */

import { execSync } from "child_process";
import { existsSync } from "fs";

const testSuites = {
  routing: "src/test/integration/routing.test.tsx",
  services: "src/test/integration/services.test.tsx",
  hooks: "src/test/integration/hooks.test.tsx",
  utils: "src/test/integration/utils.test.tsx",
  components: "src/test/integration/components.test.tsx",
  app: "src/test/integration/App.test.tsx",
  e2e: "src/test/integration/e2e.test.tsx",
};

function runTest(suiteName: string) {
  const testFile = testSuites[suiteName as keyof typeof testSuites];

  if (!testFile) {
    console.error(`❌ Unknown test suite: ${suiteName}`);
    console.log("Available test suites:", Object.keys(testSuites).join(", "));
    process.exit(1);
  }

  if (!existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`);
    process.exit(1);
  }

  console.log(`🧪 Running ${suiteName} tests...`);

  try {
    execSync(`npx vitest run ${testFile}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log(`✅ ${suiteName} tests passed!`);
  } catch (error) {
    console.error(`❌ ${suiteName} tests failed!`);
    process.exit(1);
  }
}

function runAllTests() {
  console.log("🧪 Running all integration tests...");

  const suiteNames = Object.keys(testSuites);
  let passed = 0;
  let failed = 0;

  for (const suiteName of suiteNames) {
    try {
      console.log(`\n📋 Running ${suiteName} tests...`);
      execSync(
        `npx vitest run ${testSuites[suiteName as keyof typeof testSuites]}`,
        {
          stdio: "inherit",
          cwd: process.cwd(),
        }
      );
      console.log(`✅ ${suiteName} tests passed!`);
      passed++;
    } catch (error) {
      console.error(`❌ ${suiteName} tests failed!`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("🎉 All tests passed!");
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  runAllTests();
} else if (args[0] === "--help" || args[0] === "-h") {
  console.log("Usage: npm run test:integration [suite-name]");
  console.log("");
  console.log("Available test suites:");
  Object.keys(testSuites).forEach((suite) => {
    console.log(`  ${suite}`);
  });
  console.log("");
  console.log("Examples:");
  console.log("  npm run test:integration          # Run all tests");
  console.log("  npm run test:integration routing  # Run routing tests only");
  console.log(
    "  npm run test:integration e2e      # Run end-to-end tests only"
  );
} else {
  const suiteName = args[0];
  runTest(suiteName);
}

export { runTest, runAllTests };
