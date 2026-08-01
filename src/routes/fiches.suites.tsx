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
          "Définition, suites arithmétiques et géométriques, sens de variation, récurrence, et l'arbre de décision pour la convergence.",
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

// Cobweb/staircase diagram: the visual intuition behind why a recursively
// defined sequence converges (or not) toward the fixed point of f — the
// staircase hugs the diagonal y=x and the curve y=f(x) more tightly at each
// step. Coordinates are hand-placed for a clean illustration, not derived
// from a real f (this is a memo diagram, not a plot).
function CobwebDiagram() {
  return (
    <svg viewBox="0 0 220 220" className="mx-auto h-44 w-44 sm:h-52 sm:w-52" aria-hidden="true">
      <line
        x1="15"
        y1="205"
        x2="15"
        y2="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <line
        x1="15"
        y1="205"
        x2="210"
        y2="205"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <line
        x1="15"
        y1="205"
        x2="205"
        y2="15"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path d="M40,190 Q60,40 200,70" fill="none" stroke="#4ade80" strokeWidth="2" />
      <polyline
        points="40,205 40,155 65,155 65,135 85,135 85,115 105,115 105,100 120,100 120,90 130,90"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="1.75"
      />
      <circle cx="150" cy="68" r="3" fill="#facc15" />
      <text x="153" y="60" fontSize="9" fill="#facc15">
        point fixe
      </text>
      <text x="30" y="215" fontSize="9" fill="currentColor" opacity="0.7">
        u₀
      </text>
    </svg>
  );
}

// The classic "rang n" fill-in template — same three steps and colour code
// Gaël uses on every induction proof, kept as a reusable skeleton rather
// than one worked example.
function RecurrenceTemplate() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
        Démonstration par récurrence
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Démontrons que pour tout n ∈ ℕ, <span className="text-red-400">« rang n »</span>.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-green-400">1. Initialisation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            On vérifie <span className="text-green-400">« rang 0 (ou le premier rang) »</span>.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-pink-400">2. Hérédité</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Supposons <span className="text-pink-400">« rang n »</span> vraie pour un n fixé
            quelconque. Montrons <span className="text-blue-400">« rang n+1 »</span>.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            (on part de <span className="text-pink-400">« rang n »</span>, et par une chaîne
            d'implications on arrive à <span className="text-blue-400">« rang n+1 »</span>)
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">3. Conclusion</p>
          <p className="mt-1 text-sm text-muted-foreground">
            La propriété est vraie au rang initial, et elle est héréditaire ; donc d'après le
            raisonnement par récurrence, elle est vraie pour tout n ∈ ℕ.
          </p>
        </div>
      </div>
    </div>
  );
}

type VariationMethod = { pct: string; title: string; body: string };

const VARIATION_METHODS: VariationMethod[] = [
  {
    pct: "70%",
    title: "uₙ₊₁ − uₙ",
    body: "> 0 ⟺ (uₙ) croissante. ≤ 0 ⟺ (uₙ) décroissante.",
  },
  {
    pct: "20%",
    title: "Si uₙ₊₁ = f(uₙ)",
    body: "on conjecture puis on démontre par récurrence uₙ₊₁ > uₙ (ou <) après avoir étudié les variations de f.",
  },
  {
    pct: "5%",
    title: "Si uₙ = f(n)",
    body: "on étudie les variations de f (signe de f′, tableau de variation).",
  },
  {
    pct: "5%",
    title: "Si uₙ > 0",
    body: "uₙ₊₁/uₙ > 1 ⟺ (uₙ) croissante. uₙ₊₁/uₙ < 1 ⟺ (uₙ) décroissante.",
  },
];

function VariationSection() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Sens de variation d'une suite</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Dans l'ordre où ça sert le plus souvent (d'après Gaël).
      </p>
      <ul className="mt-4 space-y-3">
        {VARIATION_METHODS.map((m) => (
          <li
            key={m.title}
            className="flex gap-3 rounded-md border border-border bg-muted px-3 py-2"
          >
            <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
              {m.pct}
            </span>
            <p className="text-sm text-foreground">
              <span className="font-mono">{fmt(m.title)}</span>
              <span className="text-muted-foreground"> — {m.body}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
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
            Définition, suites usuelles, sens de variation et récurrence, puis l'arbre de décision
            pour la convergence.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Qu'est-ce qu'une suite ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Une suite (uₙ) est une fonction de ℕ dans ℝ : à chaque rang n, elle associe un réel uₙ.
            Deux façons de la définir :
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted px-3 py-2">
              <p className="text-sm font-semibold text-foreground">Explicite</p>
              <p className="mt-1 font-mono text-sm text-foreground">{fmt("uₙ = f(n)")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                On calcule directement le terme de rang n, sans connaître les précédents.
              </p>
            </div>
            <div className="rounded-md border border-border bg-muted px-3 py-2">
              <p className="text-sm font-semibold text-foreground">Récurrente</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {fmt("uₙ₊₁ = f(uₙ), u₀ donné")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chaque terme se déduit du précédent : impossible de « sauter » directement au rang
                n.
              </p>
            </div>
          </div>
          <div className="mt-4 text-primary">
            <CobwebDiagram />
            <p className="text-center text-xs text-muted-foreground">
              Suite récurrente : l'escalier se resserre vers le point fixe de f, la limite si elle
              converge.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Suite arithmétique</h2>
          <p className="mt-2 text-sm text-muted-foreground">Raison r, premier terme u₀ :</p>
          <ul className="mt-4 space-y-2">
            <Formula>uₙ₊₁ = uₙ + r</Formula>
            <Formula>uₙ = u₀ + n·r</Formula>
            <Formula>Sₙ = (n+1)(u₀ + uₙ)/2</Formula>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Suite géométrique</h2>
          <p className="mt-2 text-sm text-muted-foreground">Raison q ≠ 1 :</p>
          <ul className="mt-4 space-y-2">
            <Formula>uₙ₊₁ = uₙ · q</Formula>
            <Formula>uₙ = u₀ · qⁿ</Formula>
            <Formula>Sₙ = u₀ · (1 − qⁿ⁺¹)/(1 − q)</Formula>
          </ul>
        </section>

        <VariationSection />

        <DecisionTree title="Convergence d'une suite" root={suitesTree} />

        <RecurrenceTemplate />

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
