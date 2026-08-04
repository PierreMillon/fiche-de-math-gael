import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Fiches Maths" },
      {
        name: "description",
        content:
          "Le fonctionnement du site expliqué règle par règle : paliers, boss, progression, sauvegarde.",
      },
    ],
  }),
  component: HowItWorksPage,
});

type Rule = { title: string; intro?: string; bullets?: string[]; note?: string };

const RULES: Rule[] = [
  {
    title: "Trois paliers par compétence",
    intro:
      "Chaque compétence (une ligne PEMDAS, le circuit logique, un exercice de fiche) a sa propre pyramide à 3 paliers.",
    bullets: ["Bonne réponse → une case se remplit.", "Mauvaise réponse → une case se vide."],
  },
  {
    title: "Le niveau boss",
    intro: "Une fois les 3 paliers remplis, la pyramide devient dorée : le niveau boss commence.",
    bullets: [
      "6 bonnes réponses d'affilée, sans erreur → triangle final obtenu.",
      "Une seule erreur → les rayons repartent à 0 (le palier, lui, reste acquis).",
    ],
  },
  {
    title: "Le niveau boss teste une vraie compréhension",
    intro: "Les questions ne sont pas juste plus dures : leur forme change.",
    bullets: [
      "Le sens de la question peut être inversé.",
      "Une donnée habituellement fournie doit être retrouvée.",
      "Les nombres sont moins ronds.",
    ],
    note: "Le but : vérifier une vraie compréhension, pas juste reconnaître un motif déjà vu.",
  },
  {
    title: "La page « Ma progression »",
    intro: "Accessible depuis le bandeau en haut de chaque page. Elle regroupe :",
    bullets: [
      "une toile d'araignée de maîtrise par catégorie,",
      "la liste des points les plus fragiles,",
      "une grille colorée de toutes les compétences du site.",
    ],
  },
  {
    title: "Les couleurs de la grille",
    bullets: [
      "Case vide → pas commencé.",
      "Orange → en cours.",
      "Blanc → avancé.",
      "Jaune → niveau boss réussi.",
    ],
  },
  {
    title: "L'hésitation compte aussi",
    intro:
      "Une bonne réponse anormalement lente compte un peu, comme une erreur, dans le classement des points faibles.",
    note: "Rien à cocher soi-même : le temps de réponse est mesuré automatiquement.",
  },
  {
    title: "Réviser mes points faibles",
    intro:
      "Le bouton « Réviser → » sur la page progression enchaîne directement les compétences les plus fragiles, toutes fiches mélangées — plutôt que de tout revoir fiche par fiche.",
  },
  {
    title: "Tout est stocké sur cet appareil",
    intro:
      "Aucun compte, aucun serveur : la progression est enregistrée uniquement dans ce navigateur.",
    note: "Changer de navigateur ou d'appareil repart de zéro, sauf transfert manuel (voir ci-dessous).",
  },
  {
    title: "Transférer sa progression",
    intro: "Depuis la page progression :",
    bullets: [
      "Générer une phrase de quelques mots qui résume l'état actuel.",
      "La coller (ou ouvrir le lien généré) sur un autre appareil recopie cette progression là-bas.",
    ],
    note: "C'est une photo à un instant donné, pas une synchronisation en direct : il faut régénérer une phrase à chaque fois qu'on veut transmettre les derniers progrès.",
  },
  {
    title: "Réinitialiser",
    bullets: [
      "Bouton sur chaque fiche → réinitialise uniquement sa pyramide.",
      "Bouton rouge sur la page progression → efface tout, partout, sur cet appareil.",
    ],
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Guide</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Comment ça marche</h1>
          <p className="mt-3 text-muted-foreground">Le fonctionnement du site, règle par règle.</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <ol className="space-y-6">
          {RULES.map((rule, i) => (
            <li key={rule.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-foreground">{rule.title}</h2>
                {rule.intro && <p className="mt-1 text-sm text-muted-foreground">{rule.intro}</p>}
                {rule.bullets && (
                  <ul className="mt-2 space-y-1">
                    {rule.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary" aria-hidden="true">
                          •
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {rule.note && <p className="mt-2 text-xs text-muted-foreground/80">{rule.note}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
          <Link
            to="/progression"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Voir ma progression
          </Link>
          <Link
            to="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary"
          >
            Toutes les fiches
          </Link>
        </div>
      </main>
    </div>
  );
}
