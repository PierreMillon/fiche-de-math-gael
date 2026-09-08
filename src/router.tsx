import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Matches Vite's `base` (see vite.config.ts) — "/" everywhere except
    // the GitHub Pages build, served from /<repo>/.
    basepath: import.meta.env.BASE_URL,
  });

  return router;
};
