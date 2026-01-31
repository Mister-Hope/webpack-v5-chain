import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.{js,ts}"],
      reporter: process.env.TEST_REPORT ? ["cobertura", "text"] : ["text", "html"],
    },
    typecheck: {
      enabled: true,
    },
    ...(process.env.TEST_REPORT
      ? {
          reporters: ["junit"],
          outputFile: {
            junit: "coverage/test-report.junit.xml",
          },
        }
      : {}),
  },
});
