import type { TreeNode } from "@/lib/decisionTree";

// Straight from the "Fiche mémo : Convergence de suites et séries
// numériques" (Lyon 1, PCSI) schémas récapitulatifs — the flowcharts, not
// the surrounding wall of theorem text.

// From "Dénombrement — Cadre 2" : which counting formula applies to a
// given tirage.
export const denombrementTree: TreeNode = {
  type: "question",
  text: "L'ordre du tirage compte-t-il ? (tirages successifs)",
  branches: [
    {
      label: "Non (tirages simultanés)",
      color: "red",
      node: {
        type: "leaf",
        text: "Combinaisons : Cₙᵖ = n!/(p!(n−p)!)",
        detail:
          "Pas de remise possible (les éléments sont distincts). Ex : équipe de volleyball (6 joueurs indifférenciés parmi 25) → C²⁵₆.",
      },
    },
    {
      label: "Oui",
      color: "green",
      node: {
        type: "question",
        text: "Y a-t-il remise (répétitions possibles) ?",
        branches: [
          {
            label: "Oui",
            color: "green",
            node: {
              type: "leaf",
              text: "p-listes : nᵖ",
              detail: "Ex : code d'un cadenas de vélo à 4 chiffres parmi 10 → 10⁴.",
            },
          },
          {
            label: "Non",
            color: "red",
            node: {
              type: "question",
              text: "On tire tous les éléments disponibles (p = n) ?",
              branches: [
                {
                  label: "Oui",
                  color: "green",
                  node: {
                    type: "leaf",
                    text: "Permutations : n!",
                    detail: "Ex : anagrammes d'un mot dont toutes les lettres sont distinctes.",
                  },
                },
                {
                  label: "Non",
                  color: "red",
                  node: {
                    type: "leaf",
                    text: "Arrangements : Aₙᵖ = n!/(n−p)!",
                    detail:
                      "Ex : équipe de football (11 postes différents parmi 25 joueurs) → A²⁵₁₁.",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const suitesTree: TreeNode = {
  type: "question",
  text: "(uₙ) est-elle monotone ?",
  branches: [
    {
      label: "Oui",
      color: "green",
      node: {
        type: "leaf",
        text: "CV des suites monotones",
        detail: "Toute suite monotone et bornée converge. Toute suite monotone non bornée diverge.",
      },
    },
    {
      label: "Non",
      color: "red",
      node: {
        type: "question",
        text: "(uₙ) est-elle géométrique ?",
        branches: [
          {
            label: "Oui",
            color: "green",
            node: {
              type: "leaf",
              text: "CV des suites géométriques",
              detail: "Si (uₙ) est géométrique de raison ρ, elle converge ⟺ |ρ| < 1 ou ρ = 1.",
            },
          },
          {
            label: "Non",
            color: "red",
            node: {
              type: "question",
              text: "La limite se calcule-t-elle directement ?",
              branches: [
                {
                  label: "Oui",
                  color: "green",
                  node: {
                    type: "leaf",
                    text: "Conclure",
                    detail: "Limite finie l : (uₙ) converge vers l. Limite infinie : (uₙ) diverge.",
                  },
                },
                {
                  label: "Non",
                  color: "red",
                  node: {
                    type: "leaf",
                    text: "Comparer à quelque chose de connu",
                    detail: (
                      <ul className="list-disc space-y-1 pl-4">
                        <li>Gendarmes : vₙ ≤ uₙ ≤ wₙ, (vₙ) et (wₙ) → l ⇒ (uₙ) → l.</li>
                        <li>
                          Suites adjacentes : (uₙ) croissante, (vₙ) décroissante, uₙ−vₙ → 0 ⇒ elles
                          convergent vers la même limite.
                        </li>
                        <li>
                          Sous-suites : si (u₂ₙ) et (u₂ₙ₊₁) convergent vers la même limite, (uₙ)
                          aussi.
                        </li>
                      </ul>
                    ),
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const seriesGeneralTree: TreeNode = {
  type: "question",
  text: "uₙ tend-il vers 0 ?",
  branches: [
    {
      label: "Non",
      color: "red",
      node: {
        type: "leaf",
        text: "DV grossièrement",
        detail: "Σuₙ diverge grossièrement (ou trivialement) si uₙ ne tend pas vers 0.",
      },
    },
    {
      label: "Oui",
      color: "green",
      node: {
        type: "question",
        text: "Σuₙ est-elle géométrique ?",
        branches: [
          {
            label: "Oui",
            color: "green",
            node: {
              type: "leaf",
              text: "CV des séries géométriques",
              detail: "Σρⁿ converge ⟺ |ρ| < 1, et dans ce cas Σuₙ = 1/(1−ρ).",
            },
          },
          {
            label: "Non",
            color: "red",
            node: {
              type: "question",
              text: "Pour p fixé, Sₙ₊ₚ−Sₙ → 0, ou lim Sₙ = l ?",
              branches: [
                {
                  label: "Oui",
                  color: "green",
                  node: { type: "leaf", text: "CV par définition de la convergence" },
                },
                {
                  label: "Non",
                  color: "red",
                  node: { type: "leaf", text: "DV par définition de la convergence" },
                },
                {
                  label: "Indéterminé",
                  color: "gray",
                  node: {
                    type: "question",
                    text: "La série est-elle positive ?",
                    branches: [
                      {
                        label: "Oui",
                        color: "green",
                        node: {
                          type: "leaf",
                          text: "Voir l'arbre « séries à termes positifs » ci-dessous",
                        },
                      },
                      {
                        label: "Non",
                        color: "red",
                        node: {
                          type: "question",
                          text: "La série est-elle alternée ?",
                          branches: [
                            {
                              label: "Oui",
                              color: "green",
                              node: {
                                type: "leaf",
                                text: "CV des séries alternées",
                                detail:
                                  "Si (−1)ⁿuₙ ≥ 0 (ou (−1)ⁿ⁺¹uₙ ≥ 0), lim uₙ = 0 et (|uₙ|) décroissante, alors Σuₙ converge.",
                              },
                            },
                            {
                              label: "Non",
                              color: "red",
                              node: {
                                type: "leaf",
                                text: "Étudier Σ|uₙ|",
                                detail: "Convergence absolue : Σ|uₙ| CV ⇒ Σuₙ CV.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const seriesPositivesTree: TreeNode = {
  type: "question",
  text: "Sₙ est-elle bornée ?",
  branches: [
    { label: "Oui", color: "green", node: { type: "leaf", text: "CV" } },
    { label: "Non", color: "red", node: { type: "leaf", text: "DV" } },
    {
      label: "Indéterminé",
      color: "gray",
      node: {
        type: "question",
        text: "Test de la puissance n-ième ?",
        branches: [
          {
            label: "Oui",
            color: "green",
            node: {
              type: "leaf",
              text: "Critère de Cauchy ou Règle de Riemann",
              detail: (
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    Cauchy : ∃r&lt;1, ⁿ√uₙ &lt; r pour tout n ⇒ CV. ∃N₀, ⁿ√uₙ &gt; 1 pour n≥N₀ ⇒ DV.
                  </li>
                  <li>Riemann : ∃α&gt;1, nᵅuₙ → 0 ⇒ CV. ∃α≤1, nᵅuₙ → +∞ ⇒ DV.</li>
                </ul>
              ),
            },
          },
          {
            label: "Non",
            color: "red",
            node: {
              type: "question",
              text: "Règle de d'Alembert ?",
              branches: [
                {
                  label: "Oui",
                  color: "green",
                  node: {
                    type: "leaf",
                    text: "Conclure",
                    detail: "lim uₙ₊₁/uₙ = L : L<1 ⇒ CV. L>1 ⇒ DV grossièrement.",
                  },
                },
                {
                  label: "Non",
                  color: "red",
                  node: {
                    type: "leaf",
                    text: "Comparaison avec d'autres séries",
                    detail: (
                      <ul className="list-disc space-y-1 pl-4">
                        <li>0≤uₙ≤vₙ : Σvₙ CV ⇒ Σuₙ CV. Σuₙ DV ⇒ Σvₙ DV.</li>
                        <li>uₙ=o(vₙ), Σvₙ CV ⇒ Σuₙ CV. uₙ=o(vₙ), Σuₙ DV ⇒ Σvₙ DV.</li>
                        <li>uₙ∼vₙ ⇒ Σuₙ et Σvₙ ont même nature.</li>
                      </ul>
                    ),
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
