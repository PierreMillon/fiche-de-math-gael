export type Fiche = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  sections: { heading: string; content: string; formulas?: string[] }[];
};

export const fiches: Fiche[] = [
  {
    slug: "pemdas",
    title: "Bases PEMDAS",
    category: "Algèbre",
    summary:
      "Transformations élémentaires : somme, multiplication, division, exposant. Chaque ligne ouvre un QCM.",
    sections: [],
  },
  {
    slug: "tangente",
    title: "La tangente, visuellement",
    category: "Analyse",
    summary:
      "Animation interactive : déplace un point sur la courbe et observe la tangente et sa pente f'(x).",
    sections: [],
  },
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
  {
    slug: "logique-booleenne",
    title: "Logique booléenne — circuits",
    category: "Logique",
    summary:
      "Portes logiques (ET, OU, NON, NON-ET, NON-OU, XOR) et circuits interactifs. Fais circuler le signal et devine la sortie.",
    sections: [],
  },
  {
    slug: "developpements-limites",
    title: "Développements limités",
    category: "Analyse",
    summary: "DL usuels en 0 et calcul de limites par développement.",
    sections: [
      {
        heading: "DL usuels en 0",
        content: "À l'ordre 2 (avec o(x²)) :",
        formulas: [
          "e^x = 1 + x + x²/2 + o(x²)",
          "ln(1+x) = x − x²/2 + o(x²)",
          "sin x = x − x³/6 + o(x³)",
          "cos x = 1 − x²/2 + o(x²)",
          "1/(1−x) = 1 + x + x² + o(x²)",
          "(1+x)^α = 1 + αx + α(α−1)x²/2 + o(x²)",
        ],
      },
      {
        heading: "Méthode",
        content:
          "Pour lever une forme indéterminée : remplacer chaque fonction par son DL au bon ordre, simplifier, puis conclure.",
      },
    ],
  },
  {
    slug: "denombrement",
    title: "Dénombrement",
    category: "Probabilités",
    summary: "Permutations, arrangements, combinaisons et cardinaux.",
    sections: [
      {
        heading: "Formules clés",
        content: "Sur un ensemble à n éléments :",
        formulas: [
          "n! permutations",
          "A(n,k) = n! / (n−k)!  (ordre, sans répétition)",
          "C(n,k) = n! / (k!(n−k)!)  (sans ordre)",
          "nᵏ listes de k éléments avec répétition",
          "2ⁿ parties d'un ensemble à n éléments",
        ],
      },
      {
        heading: "Propriétés des combinaisons",
        content: "Symétrie et triangle de Pascal :",
        formulas: ["C(n,k) = C(n,n−k)", "C(n,k) + C(n,k+1) = C(n+1,k+1)"],
      },
    ],
  },
  {
    slug: "matrices",
    title: "Matrices",
    category: "Algèbre",
    summary: "Produit matriciel, déterminant et inversibilité.",
    sections: [
      {
        heading: "Produit",
        content:
          "Le produit d'une matrice n×p par une p×q donne une matrice n×q. Il n'est pas commutatif.",
        formulas: ["(AB)ᵢⱼ = Σₖ aᵢₖ · bₖⱼ", "A·I = I·A = A"],
      },
      {
        heading: "Déterminant 2×2",
        content: "Pour A = [[a,b],[c,d]] :",
        formulas: [
          "det(A) = ad − bc",
          "A⁻¹ = (1/det A)·[[d,−b],[−c,a]]  (det A ≠ 0)",
          "det(AB) = det(A)·det(B)",
        ],
      },
    ],
  },
  {
    slug: "statistiques",
    title: "Statistiques",
    category: "Probabilités",
    summary: "Moyenne, médiane, variance, écart-type et corrélation.",
    sections: [
      {
        heading: "Indicateurs",
        content: "Sur une série de n valeurs :",
        formulas: [
          "x̄ = (1/n)·Σ xᵢ",
          "V = (1/n)·Σ (xᵢ − x̄)²",
          "σ = √V",
          "V(ax) = a²·V(x)",
        ],
      },
      {
        heading: "Loi normale",
        content: "Pour X ~ N(μ, σ²) :",
        formulas: [
          "P(μ−σ ≤ X ≤ μ+σ) ≈ 68 %",
          "P(μ−2σ ≤ X ≤ μ+2σ) ≈ 95 %",
          "P(μ−3σ ≤ X ≤ μ+3σ) ≈ 99,7 %",
        ],
      },
    ],
  },
  {
    slug: "trigonometrie",
    title: "Trigonométrie",
    category: "Géométrie",
    summary: "Cercle trigonométrique, valeurs usuelles et formules d'addition.",
    sections: [
      {
        heading: "Valeurs usuelles",
        content: "Angles remarquables :",
        formulas: [
          "cos 0 = 1, sin 0 = 0",
          "cos π/6 = √3/2, sin π/6 = 1/2",
          "cos π/4 = sin π/4 = √2/2",
          "cos π/3 = 1/2, sin π/3 = √3/2",
          "cos π/2 = 0, sin π/2 = 1",
        ],
      },
      {
        heading: "Formules",
        content: "Pour tous réels a et b :",
        formulas: [
          "cos²x + sin²x = 1",
          "sin(a+b) = sin a·cos b + cos a·sin b",
          "cos(a+b) = cos a·cos b − sin a·sin b",
          "cos 2x = 1 − 2 sin²x = 2 cos²x − 1",
          "tan x = sin x / cos x",
        ],
      },
    ],
  },
  {
    slug: "python",
    title: "Programmation Python",
    category: "Programmation",
    summary: "Types, boucles, listes, fonctions et complexité.",
    sections: [
      {
        heading: "Bases",
        content: "Opérateurs et types courants :",
        formulas: [
          "7 // 2 → 3 (division entière)",
          "7 % 3 → 1 (reste)",
          "range(a, b, p) → a, a+p, … < b",
          "len(liste) → nombre d'éléments",
        ],
      },
      {
        heading: "Fonctions et listes",
        content: "Définition, récursivité et compréhension de liste :",
        formulas: [
          "def f(x): return x*x",
          "[i*i for i in range(3)] → [0, 1, 4]",
          "b = a copie la référence, pas la liste",
          "Dichotomie : O(log n)",
        ],
      },
    ],
  },
  {
    slug: "java",
    title: "Programmation Java",
    category: "Programmation",
    summary: "Typage, tableaux, classes et pièges classiques.",
    sections: [
      {
        heading: "Bases",
        content: "Langage typé statiquement :",
        formulas: [
          "int, double, boolean, char, String",
          "7 / 2 → 3 (deux int)",
          "tab.length (tableau), liste.size() (List)",
          "System.out.println(x)",
        ],
      },
      {
        heading: "Objets",
        content: "Classes et méthodes :",
        formulas: [
          "class A extends B { }",
          "a.equals(b) pour comparer des String",
          "static → membre de la classe",
          "5 / 0 → ArithmeticException",
        ],
      },
    ],
  },
];

export const getFiche = (slug: string) => fiches.find((f) => f.slug === slug);

export const categories = Array.from(new Set(fiches.map((f) => f.category)));