import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Matches Vite's `base` (see vite.config.ts / vite.spa.config.ts) — "/"
    // everywhere except the GitHub Pages build, served from /<repo>/.
    basepath: import.meta.env.BASE_URL,
  });

  return router;
};
