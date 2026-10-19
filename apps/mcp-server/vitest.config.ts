import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
    env: {
      TAPQR_API_BASE_URL: "http://127.0.0.1:3000",
      NODE_ENV: "test",
    },
  },
});
