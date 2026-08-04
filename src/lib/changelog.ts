// See src/lib/version.ts for the same pattern and vite.appVersion.ts for how
// this is computed at build time — one entry per commit, newest first,
// `typeof` guard for contexts where the `define` replacement never runs.
export type ChangelogEntry = { version: string; subject: string };

// Git history is immutable — rewriting old commit messages would mean
// force-pushing already-published history, which we don't do (see
// AGENTS.md). Early commits predate this changelog and are in English;
// this translates the exact, known subjects to French for display without
// touching the underlying history. Anything not listed here (including
// every commit from now on, written in French directly) passes through
// unchanged.
const TRANSLATIONS: Record<string, string> = {
  "template: tanstack_start_ts_current-dbbe0d48c360": "Initialisation du projet (modèle de départ)",
  Changes: "Modifications",
  "Work in progress": "Travail en cours",
  "Add project README": "Ajout du README du projet",
  "Fix package-lock.json so npm ci works in CI":
    "Correction du package-lock.json pour que npm ci fonctionne en CI",
  "Try enabling GitHub Pages automatically from the workflow":
    "Tentative d'activation automatique de GitHub Pages depuis le workflow",
  "Fix 404 on GitHub Pages: router was missing its basepath":
    "Correction du 404 sur GitHub Pages : le routeur n'avait pas son chemin de base",
  "Fix quiz freeze, landscape layout, sign display, and boss halo centering":
    "Correction du blocage des quiz, de l'affichage paysage, des signes, et du centrage du halo boss",
  "Add homepage progress badges, step-by-step explanations, sign-flip drills":
    "Ajout des badges de progression sur l'accueil, d'explications pas-à-pas, d'exercices de changement de signe",
  "Center the boss halo on the pyramid's visual center of gravity":
    "Centrage du halo boss sur le centre de gravité visuel de la pyramide",
  "Add interactive decision trees for Suites and new Séries numériques fiche":
    "Ajout d'arbres de décision interactifs pour les Suites et nouvelle fiche Séries numériques",
  "Reintegrate the rest of the Suites material, add inequality rules and Dénombrement":
    "Réintégration du reste du contenu sur les Suites, ajout des règles d'inégalités et du Dénombrement",
  "Enable route-based code splitting on the GitHub Pages SPA build":
    "Activation du découpage du code par route sur le build SPA GitHub Pages",
  "Add a progression dashboard: radar chart, weak points, competency grid":
    "Ajout d'un tableau de bord de progression : radar, points faibles, grille de compétences",
  "Fix fraction-bar color coding, add word-phrase progress transfer":
    "Correction du code couleur des barres de fraction, ajout du transfert de progression par phrase",
  "Merge pull request #2 from PierreMillon/claude/resume-access-u0tb02":
    "Fusion de la branche de travail (PR #2)",
  "Use a cuter wordlist and shorten all-untouched progress phrases":
    "Liste de mots plus mignonne, phrases raccourcies quand rien n'est commencé",
  "Polish banner, fix progression page mobile overflow, explain the transfer phrase":
    "Amélioration de la bannière, correction du débordement mobile de la page progression, explication de la phrase de transfert",
  "Merge pull request #3 from PierreMillon/claude/resume-access-u0tb02":
    "Fusion de la branche de travail (PR #3)",
  "Add genuinely harder boss-level questions to all 16 PEMDAS rows (#4)":
    "Questions du niveau boss vraiment plus dures sur les 16 lignes PEMDAS (#4)",
  "Fix logique-booleenne circuit swap bug + full regression pass (#5)":
    "Correction du bug de changement de circuit logique + tests de régression complets (#5)",
  "Weak-points review session, boss level everywhere, implicit confidence, site guide (#6)":
    "Session de révision des points faibles, niveau boss partout, confiance implicite, guide du site (#6)",
  "Fix stale pyramid preview, boss-halo overlap, and flat tier-2→3 difficulty (#7)":
    "Correction de l'aperçu de pyramide obsolète, du chevauchement du halo boss, et de la difficulté plate entre paliers 2 et 3 (#7)",
  "Add a version badge to the site header (#8)":
    "Ajout d'un badge de version dans l'en-tête du site (#8)",
  "Derive version badge from actual commit history (#9)":
    "Numéro de version calculé à partir de l'historique réel des commits (#9)",
};

const translate = (subject: string): string => TRANSLATIONS[subject] ?? subject;

export const CHANGELOG: ChangelogEntry[] = (
  typeof __CHANGELOG__ !== "undefined" ? __CHANGELOG__ : []
).map((entry) => ({ ...entry, subject: translate(entry.subject) }));
