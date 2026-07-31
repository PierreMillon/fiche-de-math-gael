// Standalone client-only (SPA) build used exclusively by the GitHub Pages
// deploy workflow (.github/workflows/deploy-pages.yml). This bypasses
// TanStack Start's SSR/nitro pipeline entirely — see the comment in that
// workflow for why: the nitro `github-pages` static preset currently fails
// to build with this project's TanStack Start setup (pre-release nitro bug).
//
// Every route file already only imports from `@tanstack/react-router` (not
// `@tanstack/react-start`), so the exact same route tree renders fine as a
// classic client-side SPA — just without server-rendered HTML and without
// per-route <title>/<meta> updates (those are wired through Start's
// shellComponent, which a plain RouterProvider never invokes). The primary
// deployment (Cloudflare, via vite.config.ts) is unaffected by any of this.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const ghPagesBase = process.env.GH_PAGES_BASE || "/";

export default defineConfig({
  base: ghPagesBase,
  root: "spa",
  publicDir: "../public",
  plugins: [tsconfigPaths(), tailwindcss(), react()],
  build: {
    outDir: "../dist-spa",
    emptyOutDir: true,
  },
});
