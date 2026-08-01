import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fiches, categories } from "@/data/fiches";
import { hasExercises } from "@/data/exercises";
import { rows as pemdasRows } from "@/data/pemdas";
import { pyramidLabel, readStoredPyramid, type Pyramid } from "@/lib/pyramid";

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

// Maps a fiche slug to the localStorage pyramid key(s) that track its
// progress. Returns null for fiches with no quiz (e.g. the pure animation
// "tangente" fiche) — nothing to show there.
function progressKeysFor(slug: string): string[] | null {
  if (slug === "pemdas") return pemdasRows.map((r) => r.id);
  if (slug === "logique-booleenne") return ["logique-circuit"];
  if (hasExercises(slug)) return [`fiche:${slug}`];
  return null;
}

// Reads localStorage on mount only (progress is written by the quiz pages,
// never by this one) and renders a small pill if anything has been started.
function FicheProgress({ slug }: { slug: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const keys = progressKeysFor(slug);
    if (!keys) return;
    const found = keys.map(readStoredPyramid).filter((p): p is Pyramid => p !== null);
    if (found.length === 0) return;

    if (keys.length === 1) {
      setLabel(pyramidLabel(found[0]));
      return;
    }
    // Aggregate across many rows (pemdas): how many have reached the boss tier.
    const done = found.filter((p) => p.complete).length;
    if (done > 0) setLabel(`${done}/${keys.length} lignes en palier boss`);
  }, [slug]);

  if (!label) return null;
  return (
    <span className="mt-3 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
    </span>
  );
}

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
                    <FicheProgress slug={f.slug} />
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
