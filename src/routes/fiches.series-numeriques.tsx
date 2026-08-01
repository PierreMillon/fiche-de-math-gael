import { createFileRoute, Link } from "@tanstack/react-router";
import { ExerciseQuiz } from "@/lib/quiz";
import { DecisionTree } from "@/lib/decisionTree";
import { seriesGeneralTree, seriesPositivesTree } from "@/data/decisionTrees";

export const Route = createFileRoute("/fiches/series-numeriques")({
  head: () => ({
    meta: [
      { title: "Séries numériques — Fiche de révision" },
      {
        name: "description",
        content:
          "Deux arbres de décision interactifs pour déterminer la nature d'une série : cas général, puis séries à termes positifs.",
      },
      { property: "og:title", content: "Séries numériques — Fiche de révision" },
      {
        property: "og:description",
        content: "Arbres de décision pour la convergence des séries numériques.",
      },
    ],
  }),
  component: SeriesPage,
});

function SeriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Analyse</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Séries numériques</h1>
          <p className="mt-3 text-muted-foreground">
            Deux arbres de décision : le cas général d'abord, puis le cas particulier (mais
            fréquent) des séries à termes positifs.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <DecisionTree title="Cas général" root={seriesGeneralTree} />
        <DecisionTree title="Séries à termes positifs" root={seriesPositivesTree} />

        <ExerciseQuiz slug="series-numeriques" />

        <nav className="border-t border-border pt-6">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
        </nav>
      </main>
    </div>
  );
}
