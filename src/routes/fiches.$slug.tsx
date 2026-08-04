import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getFiche, fiches, type Fiche } from "@/data/fiches";
import { hasExercises } from "@/data/exercises";
import { ExerciseQuiz } from "@/lib/quiz";
import { fmt } from "@/lib/mathFormat";
import { PageHeader } from "@/lib/PageHeader";

export const Route = createFileRoute("/fiches/$slug")({
  loader: ({ params }): { fiche: Fiche } => {
    const fiche = getFiche(params.slug);
    if (!fiche) throw notFound();
    return { fiche };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Fiche introuvable" }, { name: "robots", content: "noindex" }],
      };
    }
    const { fiche } = loaderData;
    const title = `${fiche.title} — Fiche de révision`;
    return {
      meta: [
        { title },
        { name: "description", content: fiche.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: fiche.summary },
      ],
    };
  },
  component: FichePage,
});

function FichePage() {
  const { fiche } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader eyebrow={fiche.category} title={fiche.title} description={fiche.summary} />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-8">
          {fiche.sections.map((s: Fiche["sections"][number]) => (
            <section key={s.heading} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-card-foreground">{s.heading}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.content}</p>
              {s.formulas && (
                <ul className="mt-4 space-y-2">
                  {s.formulas.map((f: string, i: number) => (
                    <li
                      key={i}
                      className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground"
                    >
                      {fmt(f)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {hasExercises(fiche.slug) && <ExerciseQuiz slug={fiche.slug} />}
        </div>

        <nav className="mt-12 border-t border-border pt-6">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Autres fiches
          </p>
          <div className="flex flex-wrap gap-2">
            {fiches
              .filter((f) => f.slug !== fiche.slug)
              .map((f) => (
                <Link
                  key={f.slug}
                  to="/fiches/$slug"
                  params={{ slug: f.slug }}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {f.title}
                </Link>
              ))}
          </div>
        </nav>
      </main>
    </div>
  );
}
