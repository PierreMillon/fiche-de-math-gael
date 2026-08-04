// Client-only SPA build — the only build this project has. GitHub Pages
// only serves static files, so there's no SSR pipeline here: every route
// file imports from `@tanstack/react-router` (not `@tanstack/react-start`),
// and `spa/main.tsx` mounts a plain `RouterProvider` client-side. Per-route
// <title>/<meta> (see each route's `head()`) still update correctly on
// client-side navigation; the one real gap is the very first HTML response,
// which always carries spa/index.html's generic title until React mounts —
// a non-issue for a single-user revision site, but worth knowing if this
// ever needs to be crawler/share-preview-friendly.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { computeAppVersion, computeChangelog } from "./vite.appVersion";

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
  define: {
    __APP_VERSION__: JSON.stringify(computeAppVersion()),
    __CHANGELOG__: JSON.stringify(computeChangelog()),
  },
  plugins: [
    // Must run before react(). Without it, this build has no route-based
    // code splitting: one large bundle instead of one small chunk per
    // fiche, loaded on demand.
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
