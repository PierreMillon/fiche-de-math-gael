import { createFileRoute, Link } from "@tanstack/react-router";
import { fmt } from "@/lib/mathFormat";
import { ExerciseQuiz } from "@/lib/quiz";
import { DecisionTree } from "@/lib/decisionTree";
import { suitesTree } from "@/data/decisionTrees";

export const Route = createFileRoute("/fiches/suites")({
  head: () => ({
    meta: [
      { title: "Suites — Fiche de révision" },
      {
        name: "description",
        content:
          "Suites arithmétiques et géométriques, et l'arbre de décision pour déterminer la convergence d'une suite.",
      },
      { property: "og:title", content: "Suites — Fiche de révision" },
      {
        property: "og:description",
        content:
          "Formules usuelles et arbre de décision interactif pour la convergence des suites.",
      },
    ],
  }),
  component: SuitesPage,
});

function Formula({ children }: { children: string }) {
  return (
    <li className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
      {fmt(children)}
    </li>
  );
}

function SuitesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Analyse</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Suites</h1>
          <p className="mt-3 text-muted-foreground">
            Formules usuelles, puis l'arbre de décision pour trouver la bonne méthode de
            convergence.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Suite arithmétique</h2>
          <p className="mt-2 text-sm text-muted-foreground">Raison r, premier terme u₀ :</p>
          <ul className="mt-4 space-y-2">
            <Formula>uₙ = u₀ + n·r</Formula>
            <Formula>Sₙ = (n+1)(u₀ + uₙ)/2</Formula>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Suite géométrique</h2>
          <p className="mt-2 text-sm text-muted-foreground">Raison q ≠ 1 :</p>
          <ul className="mt-4 space-y-2">
            <Formula>uₙ = u₀ · qⁿ</Formula>
            <Formula>Sₙ = u₀ · (1 − qⁿ⁺¹)/(1 − q)</Formula>
          </ul>
        </section>

        <DecisionTree title="Convergence d'une suite" root={suitesTree} />

        <ExerciseQuiz slug="suites" />

        <nav className="border-t border-border pt-6">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
        </nav>
      </main>
    </div>
  );
}
