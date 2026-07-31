// Standalone vitest config, deliberately not layered on vite.config.ts —
// that file pulls in @lovable.dev/vite-tanstack-config (TanStack Start +
// nitro), none of which vitest needs and some of which (nitro's build-only
// plugin) doesn't play well with vitest's own dev server.
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
