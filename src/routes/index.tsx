import { createFileRoute, Link } from "@tanstack/react-router";
import { fiches, categories } from "@/data/fiches";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fiches de révision — Maths" },
      {
        name: "description",
        content:
          "Fiches de révision de mathématiques classées par sujet : analyse, algèbre, probabilités, géométrie.",
      },
      { property: "og:title", content: "Fiches de révision — Maths" },
      {
        property: "og:description",
        content: "Fiches de maths classées par sujet, prêtes à réviser.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {cat}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fiches
                .filter((f) => f.category === cat)
                .map((f) => (
                  <Link
                    key={f.slug}
                    to="/fiches/$slug"
                    params={{ slug: f.slug }}
                    className="group relative rounded-xl border border-border bg-card p-6 transition hover:border-primary hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-card-foreground">{f.title}</h3>
                      <span className="text-primary opacity-0 transition group-hover:opacity-100">
                        →
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{f.summary}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          {fiches.length} fiches disponibles
        </div>
      </footer>
    </div>
  );
}
