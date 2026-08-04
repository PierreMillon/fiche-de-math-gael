import { createFileRoute, Link } from "@tanstack/react-router";
import { fmt } from "@/lib/mathFormat";
import { ExerciseQuiz } from "@/lib/quiz";
import { DecisionTree } from "@/lib/decisionTree";
import { denombrementTree } from "@/data/decisionTrees";
import { PageHeader } from "@/lib/PageHeader";

export const Route = createFileRoute("/fiches/denombrement")({
  head: () => ({
    meta: [
      { title: "Dénombrement — Fiche de révision" },
      {
        name: "description",
        content:
          "L'arbre de décision pour choisir la bonne formule de comptage (p-listes, arrangements, permutations, combinaisons), et l'exemple du chemin sur grille.",
      },
      { property: "og:title", content: "Dénombrement — Fiche de révision" },
      {
        property: "og:description",
        content: "Arbre de décision interactif et exemple travaillé pour le dénombrement.",
      },
    ],
  }),
  component: DenombrementPage,
});

function Formula({ children }: { children: string }) {
  return (
    <li className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
      {fmt(children)}
    </li>
  );
}

type Idee = { title: string; body: string };

const IDEES: Idee[] = [
  {
    title: "1ère intuition (fausse piste)",
    body: "L'ordre compte et il y a remise → nᵖ = ? Ça ne marche pas : ce modèle compterait des trajets impossibles (par exemple aller 12 fois vers le haut), puisqu'il ne force pas le bon nombre de pas dans chaque direction.",
  },
  {
    title: "2e idée : anagramme",
    body: "Pour aller de D à A, on « monte » de 4 cases et on va « à droite » de 8 cases : un chemin est un mot de 12 lettres (D ou H) avec exactement 8 D et 4 H. C'est un anagramme à 12 lettres avec une lettre répétée 8 fois et une répétée 4 fois → 12!/(8!4!) chemins.",
  },
  {
    title: "3e idée : combinaisons (on choisit les pas vers le haut)",
    body: "Un chemin est entièrement déterminé par les 4 déplacements (sur 12) qui vont vers le haut ; l'ordre ne compte pas → C¹²₄ = 12!/(4!8!) chemins.",
  },
  {
    title: "4e idée : combinaisons (on choisit les pas vers la droite)",
    body: "Symétriquement, un chemin est déterminé par les 8 déplacements (sur 12) qui vont vers la droite → C¹²₈ = 12!/(8!4!) chemins. Même résultat que la 3e idée : C¹²₄ = C¹²₈ = 495.",
  },
];

function GridPathExample() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
        Exemple travaillé : chemins sur une grille
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        D = départ, A = arrivée, pas de retour en arrière (on ne peut aller qu'à droite ou vers le
        haut). Combien de chemins distincts de D à A ?
      </p>
      <div className="mt-4 space-y-2">
        {IDEES.map((idee, i) => (
          <details
            key={idee.title}
            className="group rounded-md border border-border bg-muted px-3 py-2 open:pb-3"
          >
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none">
              <span className="mr-2 text-primary">{i + 1}.</span>
              {idee.title}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{idee.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function DenombrementPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Probabilités"
        title="Dénombrement"
        description="L'arbre pour trouver la bonne formule de comptage, puis un exemple travaillé."
      />

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Équiprobabilité</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si toutes les issues sont équiprobables :
          </p>
          <ul className="mt-4 space-y-2">
            <Formula>P(A) = Card(A) / Card(Ω)</Formula>
          </ul>
        </section>

        <DecisionTree title="Quelle formule utiliser ?" root={denombrementTree} />

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Éléments non distincts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si les éléments à dénombrer ne sont pas tous distincts, on compte d'abord comme s'ils
            l'étaient, puis on corrige : on divise le cardinal obtenu par k! pour chaque groupe de k
            éléments identiques (c'est exactement la correction utilisée dans la 2e idée de
            l'exemple ci-dessous).
          </p>
        </section>

        <GridPathExample />

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Propriétés des combinaisons
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Symétrie et triangle de Pascal :</p>
          <ul className="mt-4 space-y-2">
            <Formula>C(n,k) = C(n,n−k)</Formula>
            <Formula>C(n,k) + C(n,k+1) = C(n+1,k+1)</Formula>
          </ul>
        </section>

        <ExerciseQuiz slug="denombrement" />

        <nav className="border-t border-border pt-6">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
        </nav>
      </main>
    </div>
  );
}
