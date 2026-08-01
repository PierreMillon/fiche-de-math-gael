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

type Rule = { title: string; body: string };

const RULES: Rule[] = [
  {
    title: "Trois paliers par compétence",
    body: "Chaque compétence (une ligne PEMDAS, le circuit logique, un exercice de fiche) a sa propre pyramide à 3 paliers. Une bonne réponse remplit une case ; une mauvaise réponse fait redescendre d'une case.",
  },
  {
    title: "Niveau boss",
    body: "Une fois les 3 paliers remplis, la pyramide devient dorée : le niveau boss commence. Il faut 6 bonnes réponses d'affilée, sans faute, pour obtenir le triangle final. Une seule erreur remet les rayons à zéro (mais pas le palier — ça reste acquis).",
  },
  {
    title: "Le niveau boss n'est pas juste plus dur",
    body: "Les questions du niveau boss changent souvent de forme, pas seulement de taille : le sens peut être inversé, un élément habituellement donné doit être retrouvé, les nombres sont moins ronds. Le but est de vérifier une vraie compréhension, pas de reconnaître un motif.",
  },
  {
    title: "Le tableau « Ma progression »",
    body: "Accessible en haut de chaque page, il montre une toile d'araignée par catégorie, la liste des points les plus fragiles, et une grille colorée de toutes les compétences du site.",
  },
  {
    title: "Les couleurs de la grille",
    body: "Case vide = pas commencé. Gris clair = en cours. Vert = avancé. Jaune = niveau boss réussi.",
  },
  {
    title: "Les points faibles comptent aussi l'hésitation",
    body: "Le classement des points faibles ne compte pas que les erreurs : une bonne réponse qui a pris anormalement longtemps compte aussi, un peu, comme un signe d'hésitation — sans qu'il y ait rien à cocher soi-même, juste le temps de réponse mesuré automatiquement.",
  },
  {
    title: "Réviser mes points faibles",
    body: "Le bouton « Réviser → » sur la page progression lance une session qui enchaîne directement les compétences les plus fragiles, toutes fiches mélangées, plutôt que de tout revoir fiche par fiche.",
  },
  {
    title: "Tout est stocké sur cet appareil",
    body: "Aucun compte, aucun serveur : la progression est enregistrée uniquement dans ce navigateur, sur cet appareil. Changer de navigateur ou d'appareil repart de zéro, sauf transfert manuel (règle suivante).",
  },
  {
    title: "Transférer sa progression",
    body: "La page progression permet de générer une phrase de quelques mots qui résume l'état actuel. La coller (ou ouvrir le lien généré) sur un autre appareil y recopie cette progression. C'est une photo à un instant donné, pas une synchronisation en direct : il faut regénérer une phrase à chaque fois qu'on veut transmettre les derniers progrès.",
  },
  {
    title: "Réinitialiser",
    body: "Chaque fiche a son propre bouton pour réinitialiser sa pyramide. La page progression a un bouton séparé, dans un encadré rouge, qui efface tout, partout, sur cet appareil.",
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
              <div>
                <h2 className="font-semibold text-foreground">{rule.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{rule.body}</p>
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
