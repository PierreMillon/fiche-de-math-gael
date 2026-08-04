// Standalone vitest config, deliberately not layered on vite.config.ts —
// tests don't need the tanstackRouter codegen plugin or Tailwind, just
// path resolution.
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
