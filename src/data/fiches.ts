export type Fiche = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  sections: { heading: string; content: string; formulas?: string[] }[];
};

export const fiches: Fiche[] = [
  {
    slug: "derivees",
    title: "Dérivées",
    category: "Analyse",
    summary: "Règles de dérivation et dérivées usuelles.",
    sections: [
      {
        heading: "Définition",
        content:
          "La dérivée de f en a est la limite du taux d'accroissement (f(a+h) − f(a)) / h quand h tend vers 0.",
      },
      {
        heading: "Dérivées usuelles",
        content: "Fonctions de référence :",
        formulas: [
          "(xⁿ)' = n·xⁿ⁻¹",
          "(sin x)' = cos x",
          "(cos x)' = −sin x",
          "(eˣ)' = eˣ",
          "(ln x)' = 1/x",
        ],
      },
      {
        heading: "Opérations",
        content: "Règles de calcul :",
        formulas: [
          "(u + v)' = u' + v'",
          "(u·v)' = u'·v + u·v'",
          "(u/v)' = (u'·v − u·v') / v²",
          "(u ∘ v)' = v' · (u' ∘ v)",
        ],
      },
    ],
  },
  {
    slug: "integrales",
    title: "Intégrales",
    category: "Analyse",
    summary: "Primitives, intégration par parties et changement de variable.",
    sections: [
      {
        heading: "Primitives usuelles",
        content: "À une constante près :",
        formulas: [
          "∫ xⁿ dx = xⁿ⁺¹ / (n+1)   (n ≠ −1)",
          "∫ 1/x dx = ln|x|",
          "∫ eˣ dx = eˣ",
          "∫ sin x dx = −cos x",
          "∫ cos x dx = sin x",
        ],
      },
      {
        heading: "Intégration par parties",
        content: "Pour u et v dérivables :",
        formulas: ["∫ u'·v = [u·v] − ∫ u·v'"],
      },
    ],
  },
  {
    slug: "limites",
    title: "Limites",
    category: "Analyse",
    summary: "Formes indéterminées et croissances comparées.",
    sections: [
      {
        heading: "Croissances comparées",
        content: "En +∞ :",
        formulas: [
          "ln x ≪ xᵃ ≪ eˣ   (a > 0)",
          "lim (ln x)/x = 0",
          "lim eˣ / xⁿ = +∞",
        ],
      },
      {
        heading: "Formes indéterminées",
        content: "À lever par factorisation, conjugué ou taux d'accroissement.",
        formulas: ["∞ − ∞", "0 × ∞", "0/0", "∞/∞"],
      },
    ],
  },
  {
    slug: "suites",
    title: "Suites",
    category: "Analyse",
    summary: "Suites arithmétiques, géométriques et raisonnement par récurrence.",
    sections: [
      {
        heading: "Suite arithmétique",
        content: "Raison r, premier terme u₀ :",
        formulas: ["uₙ = u₀ + n·r", "Sₙ = (n+1)(u₀ + uₙ)/2"],
      },
      {
        heading: "Suite géométrique",
        content: "Raison q ≠ 1 :",
        formulas: ["uₙ = u₀ · qⁿ", "Sₙ = u₀ · (1 − qⁿ⁺¹)/(1 − q)"],
      },
      {
        heading: "Récurrence",
        content:
          "Initialisation, hérédité, conclusion. Vérifier P(0), puis P(n) ⇒ P(n+1).",
      },
    ],
  },
  {
    slug: "probabilites",
    title: "Probabilités",
    category: "Probabilités",
    summary: "Probabilités conditionnelles, indépendance et loi binomiale.",
    sections: [
      {
        heading: "Formules de base",
        content: "Événements A et B :",
        formulas: [
          "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)",
          "P_B(A) = P(A ∩ B) / P(B)",
          "A, B indépendants ⇔ P(A ∩ B) = P(A)·P(B)",
        ],
      },
      {
        heading: "Loi binomiale B(n, p)",
        content: "n épreuves de Bernoulli indépendantes :",
        formulas: [
          "P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ",
          "E(X) = n·p",
          "V(X) = n·p·(1−p)",
        ],
      },
    ],
  },
  {
    slug: "vecteurs",
    title: "Vecteurs & géométrie",
    category: "Géométrie",
    summary: "Produit scalaire, colinéarité et équations de droites.",
    sections: [
      {
        heading: "Produit scalaire",
        content: "Dans le plan ou l'espace :",
        formulas: [
          "u·v = ‖u‖·‖v‖·cos(θ)",
          "u·v = x·x' + y·y' (+ z·z')",
          "u ⊥ v ⇔ u·v = 0",
        ],
      },
      {
        heading: "Colinéarité",
        content: "u(x, y) et v(x', y') colinéaires ⇔ x·y' − y·x' = 0.",
      },
    ],
  },
  {
    slug: "complexes",
    title: "Nombres complexes",
    category: "Algèbre",
    summary: "Forme algébrique, module, argument et forme exponentielle.",
    sections: [
      {
        heading: "Formes",
        content: "z = a + i·b, avec a, b ∈ ℝ :",
        formulas: [
          "|z| = √(a² + b²)",
          "arg(z) = θ  (mod 2π)",
          "z = |z|·(cos θ + i·sin θ) = |z|·e^{iθ}",
        ],
      },
      {
        heading: "Propriétés",
        content: "Pour tous z, z' complexes :",
        formulas: [
          "|z·z'| = |z|·|z'|",
          "arg(z·z') = arg(z) + arg(z')",
          "e^{iθ}·e^{iφ} = e^{i(θ+φ)}",
        ],
      },
    ],
  },
  {
    slug: "logarithme",
    title: "Logarithme & exponentielle",
    category: "Analyse",
    summary: "Propriétés algébriques et équations.",
    sections: [
      {
        heading: "Logarithme népérien",
        content: "Pour a, b > 0 :",
        formulas: [
          "ln(a·b) = ln a + ln b",
          "ln(a/b) = ln a − ln b",
          "ln(aⁿ) = n·ln a",
          "ln 1 = 0, ln e = 1",
        ],
      },
      {
        heading: "Exponentielle",
        content: "Pour tous x, y ∈ ℝ :",
        formulas: [
          "eˣ⁺ʸ = eˣ · eʸ",
          "e⁻ˣ = 1/eˣ",
          "(eˣ)ⁿ = eⁿˣ",
          "eˣ = y ⇔ x = ln y (y > 0)",
        ],
      },
    ],
  },
];

export const getFiche = (slug: string) => fiches.find((f) => f.slug === slug);

export const categories = Array.from(new Set(fiches.map((f) => f.category)));