import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { ChartColumn } from "lucide-react";

// φ (nombre d'or) tourné à 180° au lieu d'une flèche classique — le jambage
// vertical inversé se lit comme une flèche pointant vers le haut.
function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Remonter en haut de la page"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg transition hover:scale-105"
    >
      <span aria-hidden="true" className="inline-block rotate-180">
        φ
      </span>
    </button>
  );
}

import appCss from "../styles.css?url";
import { APP_VERSION } from "../lib/version";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_TITLE = "Fiches de révision — Maths";
const SITE_DESCRIPTION =
  "Fiches de révision de mathématiques classées par sujet : analyse, algèbre, probabilités, géométrie.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="w-full bg-pink-500 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-col">
              <Link to="/" className="text-sm font-semibold tracking-wide">
                Fiches Maths
              </Link>
              <span className="text-xs opacity-90">Réserver un cours : gaelboury@gmail.com</span>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <Link
                to="/comment-ca-marche"
                className="text-xs text-white/80 underline-offset-2 transition hover:text-white hover:underline"
              >
                Comment ça marche ?
              </Link>
              <Link
                to="/progression"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm ring-1 ring-white/40 transition hover:bg-white/25"
              >
                <ChartColumn className="h-3.5 w-3.5" />
                Ma progression
              </Link>
              <Link
                to="/journal"
                className="shrink-0 rounded-md bg-black/10 px-1.5 py-0.5 text-[10px] tabular-nums text-white/70 transition hover:bg-black/20 hover:text-white"
                title="Voir l'historique des versions"
              >
                v{APP_VERSION}
              </Link>
            </div>
          </div>
        </div>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <BackToTopButton />
      </div>
    </QueryClientProvider>
  );
}
