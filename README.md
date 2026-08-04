# Fiches Maths

Site de révision de mathématiques pour un élève, classé par fiches (algèbre,
analyse, probabilités, géométrie, logique, programmation…). Chaque fiche a
son propre QCM ou exercice interactif, avec suivi de progression (pyramide
par compétence) stocké dans le navigateur, sans compte ni serveur.

**Live** : https://pierremillon.github.io/fiche-de-math-gael/

## Développement local

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — serveur de développement.
- `npm run build` — build de production (SPA statique, `vite.config.ts`).
  Sortie dans `dist-spa/`.
- `npm run preview` — sert le résultat de `npm run build` en local.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — ESLint (+ Prettier via `eslint-plugin-prettier`).
- `npm run test` — Vitest.
- `npm run verify` — enchaîne typecheck, lint et test ; à lancer avant de
  pousser une modification.

## Structure

- `src/data/` — contenu (questions, formules) : `pemdas.tsx` (générateurs de
  QCM PEMDAS avec rendu coloré fait main), `exercises.ts` (banques de
  questions pour les fiches génériques), `fiches.ts` (cartes de formules
  statiques), `decisionTrees.tsx` (arbres de décision interactifs).
- `src/lib/` — logique partagée : `pyramid.tsx` (suivi de progression),
  `quiz.tsx` / `pemdasQuiz.tsx` (composants de QCM), `mathFormat.tsx` (rendu
  LaTeX via KaTeX), `competencies.ts`, `wordCode.ts` (export/import de
  progression sous forme de phrase de mots).
- `src/routes/` — une route TanStack Router par fichier ; les fiches sans UI
  bespoke passent par `fiches.$slug.tsx` (générique, piloté par
  `src/data/fiches.ts` + `src/data/exercises.ts`).

## Déploiement

Push sur `main` déclenche `.github/workflows/deploy-pages.yml`, qui lance
`npm run verify` (typecheck + lint + tests), puis `npm run build` et publie
sur GitHub Pages. Un échec de l'une de ces étapes bloque le déploiement.
