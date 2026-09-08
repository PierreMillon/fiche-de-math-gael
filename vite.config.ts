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
import { VitePWA } from "vite-plugin-pwa";
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
    // Mode hors-ligne : après une première visite avec réseau, le site
    // reste utilisable en avion (SPA client-only, aucune donnée serveur —
    // rien à synchroniser). `registerType: "autoUpdate"` fait prendre la
    // main au nouveau service worker dès qu'il a fini de s'installer
    // (skipWaiting + clientsClaim, gérés par le plugin), cohérent avec les
    // autres sites du même auteur : pas de bannière "nouvelle version" à
    // valider, juste une reconnexion silencieuse dès qu'il y a du réseau.
    // Pas de VERSION à faire avancer à la main comme sur les sites HTML
    // bruts du même auteur : chaque chunk JS/CSS a déjà un hash de
    // contenu unique posé par Vite, donc un nouveau build produit
    // naturellement des noms de fichiers différents — Workbox précache
    // ça tel quel et nettoie les anciens fichiers précachés qui ne sont
    // plus référencés (cleanupOutdatedCaches, activé par défaut).
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Fiches de révision — Maths",
        short_name: "Fiches Maths",
        start_url: ghPagesBase,
        scope: ghPagesBase,
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // SPA sans backend : tout ce qui atterrit dans dist-spa est
        // précaché, y compris les formules/questions (déjà dans le
        // bundle JS, pas de fetch séparé — voir src/data/).
        // Pas de .woff (audit du 08/09/2026) : KaTeX embarque ses
        // polices en woff2 ET en woff (fallback pré-2016) — un
        // navigateur actuel ne charge jamais que le woff2, donc
        // précacher le woff en plus gonflait le 1er téléchargement de
        // ~300 Ko pour un format jamais réellement utilisé.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // GitHub Pages n'a pas de rewrite serveur (voir le 404.html
        // copié depuis index.html dans le workflow de déploiement) :
        // hors-ligne, toute navigation vers une route interne doit
        // retomber sur index.html pour laisser TanStack Router prendre
        // le relais côté client, exactement comme le fait déjà le
        // 404.html en ligne.
        navigateFallback: "index.html",
      },
    }),
  ],
  build: {
    outDir: "../dist-spa",
    emptyOutDir: true,
  },
});
