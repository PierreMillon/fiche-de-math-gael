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
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const ghPagesBase = process.env.GH_PAGES_BASE || "/";

// root:"spa" below means the plugin's routesDirectory/generatedRouteTree
// defaults (relative to root) would look under spa/src/routes instead of
// the real routes at the project root — point them there explicitly.
const routesDirectory = fileURLToPath(new URL("./src/routes", import.meta.url));
const generatedRouteTree = fileURLToPath(new URL("./src/routeTree.gen.ts", import.meta.url));

export default defineConfig({
  base: ghPagesBase,
  root: "spa",
  publicDir: "../public",
  plugins: [
    // Must run before react(). Matches what tanstackStart() already does for
    // the Cloudflare build (vite.config.ts) — without it, this SPA build has
    // no route-based code splitting: one ~420 KB bundle instead of one small
    // chunk per fiche, loaded on demand. Same routesDirectory/generatedRouteTree
    // defaults as tanstackStart, so both builds regenerate the same routeTree.gen.ts.
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory,
      generatedRouteTree,
    }),
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
  build: {
    outDir: "../dist-spa",
    emptyOutDir: true,
  },
});
