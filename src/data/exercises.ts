export type QItem = { q: string; a: string; d: [string, string, string]; e: string };
export type Bank = { 1: QItem[]; 2: QItem[]; 3: QItem[] };

export const exercises: Record<string, Bank> = {
  derivees: {
    1: [
      {
        q: "Dérivée de f(x) = x^3 ?",
        a: "3x^2",
        d: ["x^2", "3x", "x^4/4"],
        e: "Règle (xⁿ)' = n·xⁿ⁻¹ avec n = 3.",
      },
      {
        q: "Dérivée de f(x) = sin x ?",
        a: "cos x",
        d: ["−cos x", "−sin x", "tan x"],
        e: "Dérivée usuelle : (sin x)' = cos x.",
      },
      {
        q: "Dérivée de f(x) = 5x + 2 ?",
        a: "5",
        d: ["5x", "2", "7"],
        e: "La dérivée d'une fonction affine ax+b est a.",
      },
    ],
    2: [
      {
        q: "Dérivée de f(x) = x·e^x ?",
        a: "(1+x)e^x",
        d: ["e^x", "x e^x", "(x−1)e^x"],
        e: "Produit : (uv)' = u'v+uv' avec u=x, v=e^x.",
      },
      {
        q: "Dérivée de f(x) = ln(x^2) ?",
        a: "2/x",
        d: ["1/x^2", "2x", "1/(2x)"],
        e: "(ln u)' = u'/u avec u=x², soit 2x/x² = 2/x.",
      },
      {
        q: "Dérivée de f(x) = (2x+1)^3 ?",
        a: "6(2x+1)^2",
        d: ["3(2x+1)^2", "2(2x+1)^3", "6(2x+1)^3"],
        e: "Composée : (uⁿ)' = n·u'·uⁿ⁻¹ avec u=2x+1, u'=2.",
      },
    ],
    3: [
      {
        q: "Dérivée de f(x) = x^(1/2) ?",
        a: "1/(2x^(1/2))",
        d: ["x^(−1/2)", "2x^(1/2)", "1/x^(1/2)"],
        e: "(xⁿ)' = n·xⁿ⁻¹ avec n=1/2.",
      },
      {
        q: "Dérivée de f(x) = x/(x^2+1) ?",
        a: "(1−x^2)/(x^2+1)^2",
        d: ["(x^2−1)/(x^2+1)^2", "1/(2x)", "(1+x^2)/(x^2+1)^2"],
        e: "Quotient : (u/v)' = (u'v−uv')/v².",
      },
      {
        q: "Dérivée de f(x) = e^(x^2) ?",
        a: "2x e^(x^2)",
        d: ["e^(x^2)", "x^2 e^(x^2)", "2x e^x"],
        e: "Composée : (e^u)' = u'·e^u avec u=x², u'=2x.",
      },
    ],
  },
  integrales: {
    1: [
      {
        q: "∫ x^2 dx = ?",
        a: "x^3/3 + C",
        d: ["2x + C", "x^3 + C", "x^2/2 + C"],
        e: "Primitive de xⁿ : xⁿ⁺¹/(n+1).",
      },
      {
        q: "∫ cos x dx = ?",
        a: "sin x + C",
        d: ["−sin x + C", "cos x + C", "−cos x + C"],
        e: "Primitive usuelle de cos x.",
      },
      {
        q: "∫ e^x dx = ?",
        a: "e^x + C",
        d: ["x e^x + C", "e^x/x + C", "ln x + C"],
        e: "e^x est sa propre primitive.",
      },
    ],
    2: [
      {
        q: "∫ de 0 à 1 de 3x^2 dx = ?",
        a: "1",
        d: ["3", "1/3", "2"],
        e: "Primitive x³, donc [x³] de 0 à 1 = 1.",
      },
      {
        q: "∫ 1/(2x) dx = ?",
        a: "(1/2)ln|x| + C",
        d: ["ln|2x| + C", "2 ln|x| + C", "−1/(2x^2) + C"],
        e: "1/(2x) = (1/2)·(1/x), primitive (1/2)ln|x|.",
      },
      {
        q: "∫ x e^x dx (par parties) = ?",
        a: "(x−1)e^x + C",
        d: ["(x+1)e^x + C", "x^2 e^x/2 + C", "e^x + C"],
        e: "u=x, v'=e^x ⇒ ∫u'v = uv−∫uv' = x·e^x − e^x.",
      },
    ],
    3: [
      {
        q: "∫ de 0 à π de sin x dx = ?",
        a: "2",
        d: ["0", "1", "π"],
        e: "[−cos x] de 0 à π = −cos π + cos 0 = 1+1 = 2.",
      },
      {
        q: "∫ ln x dx = ?",
        a: "x ln x − x + C",
        d: ["1/x + C", "x ln x + C", "ln x/x + C"],
        e: "Par parties avec u=ln x, v'=1.",
      },
      {
        q: "∫ x^(1/2) dx = ?",
        a: "(2/3)x^(3/2) + C",
        d: ["(3/2)x^(3/2) + C", "x^(3/2) + C", "(1/2)x^(−1/2) + C"],
        e: "Primitive de xⁿ avec n=1/2.",
      },
    ],
  },
  limites: {
    1: [
      {
        q: "lim (x→+∞) 1/x = ?",
        a: "0",
        d: ["+∞", "1", "−∞"],
        e: "1/x devient négligeable quand x→+∞.",
      },
      {
        q: "lim (x→+∞) e^x = ?",
        a: "+∞",
        d: ["0", "1", "−∞"],
        e: "L'exponentielle diverge vers +∞.",
      },
      {
        q: "lim (x→0+) ln x = ?",
        a: "−∞",
        d: ["0", "+∞", "1"],
        e: "ln x tend vers −∞ quand x→0⁺.",
      },
    ],
    2: [
      {
        q: "lim (x→+∞) (3x^2+x)/(x^2+1) = ?",
        a: "3",
        d: ["+∞", "0", "1"],
        e: "On factorise par x² au numérateur et au dénominateur.",
      },
      {
        q: "lim (x→+∞) (ln x)/x = ?",
        a: "0",
        d: ["+∞", "1", "e"],
        e: "Croissance comparée : ln x ≪ x.",
      },
      {
        q: "lim (x→0) sin x / x = ?",
        a: "1",
        d: ["0", "+∞", "sin 1"],
        e: "Limite usuelle en 0, c'est la dérivée de sin en 0.",
      },
    ],
    3: [
      {
        q: "lim (x→+∞) e^x / x^5 = ?",
        a: "+∞",
        d: ["0", "1", "5"],
        e: "Croissance comparée : e^x l'emporte sur toute puissance de x.",
      },
      {
        q: "lim (x→0) (e^x − 1)/x = ?",
        a: "1",
        d: ["0", "e", "+∞"],
        e: "C'est le taux d'accroissement de exp en 0, donc sa dérivée : 1.",
      },
      {
        q: "lim (x→+∞) x^(1/x) = ?",
        a: "1",
        d: ["0", "+∞", "e"],
        e: "x^(1/x) = e^(ln x / x) et ln x/x → 0.",
      },
    ],
  },
  suites: {
    1: [
      {
        q: "Suite arithmétique u0 = 2, r = 3. u4 = ?",
        a: "14",
        d: ["11", "12", "162"],
        e: "uₙ = u₀+n·r ⇒ 2+4×3 = 14.",
      },
      {
        q: "Suite géométrique u0 = 3, q = 2. u3 = ?",
        a: "24",
        d: ["12", "18", "48"],
        e: "uₙ = u₀·qⁿ ⇒ 3×2³ = 24.",
      },
      {
        q: "Une suite géométrique de raison q = 1/2 converge vers ?",
        a: "0",
        d: ["1/2", "+∞", "1"],
        e: "|q|<1 ⇒ la suite géométrique tend vers 0.",
      },
    ],
    2: [
      {
        q: "u0 = 1, r = 4 : somme u0+…+u5 = ?",
        a: "66",
        d: ["60", "76", "36"],
        e: "Sₙ=(n+1)(u₀+uₙ)/2, avec u5=21 ⇒ 6×22/2 = 66.",
      },
      {
        q: "u0 = 2, q = 3 : somme u0+…+u3 = ?",
        a: "80",
        d: ["54", "78", "162"],
        e: "Sₙ=u₀(1−qⁿ⁺¹)/(1−q) ⇒ 2×(1−81)/(1−3) = 80.",
      },
      {
        q: "u(n+1) = u(n)+5 est une suite…",
        a: "arithmétique de raison 5",
        d: ["géométrique de raison 5", "constante", "divergente vers 0"],
        e: "Chaque terme s'obtient en ajoutant une constante ⇒ arithmétique.",
      },
    ],
    3: [
      {
        q: "u(n) = (2/3)^n : limite ?",
        a: "0",
        d: ["+∞", "2/3", "1"],
        e: "|q| = 2/3 < 1 ⇒ limite 0.",
      },
      {
        q: "u(n+1) = 0,5 u(n) + 3 : point fixe (limite) ?",
        a: "6",
        d: ["3", "0", "1,5"],
        e: "l = 0,5l+3 ⇒ 0,5l=3 ⇒ l=6.",
      },
      {
        q: "Récurrence : après l'initialisation, on prouve…",
        a: "l'hérédité P(n) ⇒ P(n+1)",
        d: ["P(n+1) ⇒ P(n)", "P(0) une 2e fois", "la limite"],
        e: "L'étape suivante d'une récurrence est l'hérédité.",
      },
    ],
  },
  probabilites: {
    1: [
      {
        q: "Dé équilibré : P(obtenir 4) = ?",
        a: "1/6",
        d: ["1/4", "1/3", "1/2"],
        e: "Équiprobabilité sur 6 issues.",
      },
      {
        q: "P(A) = 0,3 : P(non A) = ?",
        a: "0,7",
        d: ["0,3", "1,3", "0,5"],
        e: "P(non A) = 1 − P(A).",
      },
      {
        q: "X ~ B(10 ; 0,2) : E(X) = ?",
        a: "2",
        d: ["0,2", "10", "1,6"],
        e: "E(X) = n·p = 10×0,2 = 2.",
      },
    ],
    2: [
      {
        q: "A et B indépendants, P(A)=0,5, P(B)=0,4 : P(A∩B) = ?",
        a: "0,2",
        d: ["0,9", "0,1", "0,45"],
        e: "Indépendance : P(A∩B) = P(A)×P(B).",
      },
      {
        q: "P(A)=0,6, P(B)=0,3, P(A∩B)=0,2 : P(A∪B) = ?",
        a: "0,7",
        d: ["0,9", "0,5", "0,8"],
        e: "P(A∪B) = P(A)+P(B)−P(A∩B).",
      },
      {
        q: "X ~ B(10 ; 0,2) : V(X) = ?",
        a: "1,6",
        d: ["2", "0,8", "4"],
        e: "V(X) = n·p·(1−p) = 10×0,2×0,8 = 1,6.",
      },
    ],
    3: [
      {
        q: "X ~ B(4 ; 0,5) : P(X = 2) = ?",
        a: "3/8",
        d: ["1/4", "1/2", "1/16"],
        e: "C(4,2)×0,5²×0,5² = 6/16 = 3/8.",
      },
      {
        q: "P(B)=0,4 et P(A∩B)=0,1 : P_B(A) = ?",
        a: "0,25",
        d: ["0,4", "0,04", "0,1"],
        e: "P_B(A) = P(A∩B)/P(B) = 0,1/0,4.",
      },
      {
        q: "Deux tirages avec remise, P(succès)=0,3 : P(au moins un succès) = ?",
        a: "0,51",
        d: ["0,6", "0,09", "0,49"],
        e: "1 − P(aucun succès) = 1 − 0,7² = 0,51.",
      },
    ],
  },
  vecteurs: {
    1: [
      {
        q: "u(1;2) et v(3;4) : u·v = ?",
        a: "11",
        d: ["7", "10", "14"],
        e: "u·v = x·x'+y·y' = 1×3+2×4 = 11.",
      },
      {
        q: "u(2;0) et v(0;5) : u et v sont…",
        a: "orthogonaux",
        d: ["colinéaires", "égaux", "opposés"],
        e: "u·v = 0 ⇒ orthogonaux.",
      },
      { q: "Norme de u(3;4) = ?", a: "5", d: ["7", "25", "3,5"], e: "‖u‖ = √(3²+4²) = √25 = 5." },
    ],
    2: [
      {
        q: "u(2;3) et v(4;6) : ces vecteurs sont…",
        a: "colinéaires",
        d: ["orthogonaux", "de même norme", "nuls"],
        e: "v = 2u, donc colinéaires.",
      },
      { q: "u(1;−2;2) : ‖u‖ = ?", a: "3", d: ["5", "9", "1"], e: "√(1+4+4) = √9 = 3." },
      {
        q: "u·v = 0 signifie…",
        a: "u ⊥ v",
        d: ["u ∥ v", "u = v", "u = 0"],
        e: "Le produit scalaire nul caractérise l'orthogonalité.",
      },
    ],
    3: [
      {
        q: "u(1;1) et v(1;0) : cos(θ) = ?",
        a: "2^(1/2)/2",
        d: ["1/2", "0", "1"],
        e: "cos θ = u·v/(‖u‖‖v‖) = 1/√2.",
      },
      {
        q: "Droite d'équation 2x + 3y − 6 = 0 : vecteur normal ?",
        a: "(2;3)",
        d: ["(3;−2)", "(−6;0)", "(1;1)"],
        e: "Les coefficients (a;b) de ax+by+c=0 donnent le vecteur normal.",
      },
      {
        q: "u(1;2;3) et v(2;4;k) colinéaires : k = ?",
        a: "6",
        d: ["3", "5", "12"],
        e: "v = 2u ⇒ k = 2×3 = 6.",
      },
    ],
  },
  complexes: {
    1: [
      { q: "|3 + 4i| = ?", a: "5", d: ["7", "25", "3"], e: "√(3²+4²) = 5." },
      { q: "i^2 = ?", a: "−1", d: ["1", "i", "0"], e: "Définition du nombre imaginaire i." },
      {
        q: "Conjugué de 2 − 5i ?",
        a: "2 + 5i",
        d: ["−2 + 5i", "−2 − 5i", "5 − 2i"],
        e: "Le conjugué change le signe de la partie imaginaire.",
      },
    ],
    2: [
      {
        q: "(1 + i)^2 = ?",
        a: "2i",
        d: ["2", "1 + i^2", "−2i"],
        e: "(1+i)² = 1+2i+i² = 1+2i−1 = 2i.",
      },
      {
        q: "Argument de i ?",
        a: "π/2",
        d: ["0", "π", "−π/2"],
        e: "i est sur l'axe imaginaire positif.",
      },
      {
        q: "|z| = 2 et arg z = π : z = ?",
        a: "−2",
        d: ["2", "2i", "−2i"],
        e: "z = 2(cos π + i sin π) = −2.",
      },
    ],
    3: [
      { q: "e^(iπ) = ?", a: "−1", d: ["1", "i", "0"], e: "Formule d'Euler : e^(iπ) = −1." },
      {
        q: "Module de (1+i)/(1−i) ?",
        a: "1",
        d: ["2", "2^(1/2)", "0"],
        e: "|1+i| = |1−i| = √2, le rapport des modules vaut 1.",
      },
      {
        q: "Racines de z^2 = −4 ?",
        a: "2i et −2i",
        d: ["2 et −2", "4i", "i et −i"],
        e: "z² = −4 ⇔ z = ±2i.",
      },
    ],
  },
  logarithme: {
    1: [
      { q: "ln(1) = ?", a: "0", d: ["1", "e", "−∞"], e: "ln(1) = 0 par définition." },
      {
        q: "ln(e^3) = ?",
        a: "3",
        d: ["e^3", "1/3", "ln 3"],
        e: "ln et exp sont des fonctions réciproques.",
      },
      { q: "e^0 = ?", a: "1", d: ["0", "e", "+∞"], e: "Toute exponentielle en 0 vaut 1." },
    ],
    2: [
      {
        q: "ln(a) + ln(b) = ?",
        a: "ln(ab)",
        d: ["ln(a+b)", "ln(a)·ln(b)", "ln(a/b)"],
        e: "Propriété : ln(a)+ln(b) = ln(ab).",
      },
      {
        q: "e^x = 5 ⇔ x = ?",
        a: "ln 5",
        d: ["5/e", "e^5", "log 5"],
        e: "On applique ln aux deux membres.",
      },
      {
        q: "ln(a^4) = ?",
        a: "4 ln a",
        d: ["(ln a)^4", "ln 4 · a", "a ln 4"],
        e: "ln(aⁿ) = n ln a.",
      },
    ],
    3: [
      {
        q: "Résoudre e^(2x) = 9 : x = ?",
        a: "ln 3",
        d: ["ln 9", "3", "2 ln 3"],
        e: "2x = ln 9 ⇒ x = (1/2)ln 9 = ln 3.",
      },
      { q: "ln(x) = −1 ⇔ x = ?", a: "1/e", d: ["−e", "e", "0"], e: "x = e^(−1) = 1/e." },
      {
        q: "ln(x^(1/2)) = ?",
        a: "(1/2)ln x",
        d: ["2 ln x", "(ln x)^(1/2)", "ln x − 2"],
        e: "ln(xⁿ) = n ln x avec n = 1/2.",
      },
    ],
  },
  "developpements-limites": {
    1: [
      {
        q: "DL1 en 0 de e^x ?",
        a: "1 + x + o(x)",
        d: ["x + o(x)", "1 − x + o(x)", "1 + x^2 + o(x)"],
        e: "e^x ≈ 1+x au premier ordre.",
      },
      {
        q: "DL1 en 0 de sin x ?",
        a: "x + o(x)",
        d: ["1 + x + o(x)", "x^2 + o(x)", "1 − x + o(x)"],
        e: "sin x ≈ x au premier ordre.",
      },
      {
        q: "DL2 en 0 de cos x ?",
        a: "1 − x^2/2 + o(x^2)",
        d: ["1 + x^2/2 + o(x^2)", "x − x^2 + o(x^2)", "1 − x + o(x^2)"],
        e: "cos x ≈ 1 − x²/2 à l'ordre 2.",
      },
    ],
    2: [
      {
        q: "DL2 en 0 de ln(1+x) ?",
        a: "x − x^2/2 + o(x^2)",
        d: ["x + x^2/2 + o(x^2)", "1 + x + o(x^2)", "x − x^2 + o(x^2)"],
        e: "ln(1+x) ≈ x − x²/2 à l'ordre 2.",
      },
      {
        q: "DL2 en 0 de 1/(1−x) ?",
        a: "1 + x + x^2 + o(x^2)",
        d: ["1 − x + x^2 + o(x^2)", "1 + x^2 + o(x^2)", "x + x^2 + o(x^2)"],
        e: "Série géométrique : 1+x+x²+…",
      },
      {
        q: "DL2 en 0 de (1+x)^(1/2) ?",
        a: "1 + x/2 − x^2/8 + o(x^2)",
        d: ["1 + x/2 + x^2/8 + o(x^2)", "1 + x − x^2 + o(x^2)", "1 + 2x + o(x^2)"],
        e: "Formule (1+x)^α ≈ 1+αx+α(α−1)x²/2 avec α=1/2.",
      },
    ],
    3: [
      {
        q: "lim (x→0) (e^x − 1 − x)/x^2 (via DL) = ?",
        a: "1/2",
        d: ["1", "0", "2"],
        e: "e^x=1+x+x²/2+o(x²), donc le quotient tend vers 1/2.",
      },
      {
        q: "DL3 en 0 de sin x ?",
        a: "x − x^3/6 + o(x^3)",
        d: ["x − x^3/3 + o(x^3)", "x + x^3/6 + o(x^3)", "x − x^2/2 + o(x^3)"],
        e: "Développement usuel de sin x à l'ordre 3.",
      },
      {
        q: "lim (x→0) (ln(1+x) − x)/x^2 = ?",
        a: "−1/2",
        d: ["1/2", "0", "−1"],
        e: "ln(1+x)=x−x²/2+o(x²), donc la limite vaut −1/2.",
      },
    ],
  },
  denombrement: {
    1: [
      {
        q: "Nombre de permutations de 4 objets ?",
        a: "24",
        d: ["4", "16", "12"],
        e: "n! = 4! = 24.",
      },
      { q: "C(5,2) = ?", a: "10", d: ["20", "5", "25"], e: "C(5,2) = 5!/(2!3!) = 10." },
      {
        q: "Nombre de mots de 3 lettres avec un alphabet de 4 lettres (répétitions permises) ?",
        a: "64",
        d: ["12", "24", "81"],
        e: "Avec répétition : 4³ = 64.",
      },
    ],
    2: [
      {
        q: "Nombre d'arrangements A(5,3) ?",
        a: "60",
        d: ["10", "125", "20"],
        e: "A(n,k) = n!/(n−k)! = 5×4×3 = 60.",
      },
      { q: "C(6,3) = ?", a: "20", d: ["18", "15", "120"], e: "C(6,3) = 6!/(3!3!) = 20." },
      {
        q: "Nombre de parties d'un ensemble à 5 éléments ?",
        a: "32",
        d: ["25", "10", "120"],
        e: "2ⁿ parties, ici 2⁵ = 32.",
      },
    ],
    3: [
      {
        q: "Nombre d'anagrammes du mot MAMAN ?",
        a: "30",
        d: ["120", "60", "20"],
        e: "5!/(3!·2!) = 30 (3 A et 2 M).",
      },
      { q: "C(n,k) = C(n, ?)", a: "n−k", d: ["k−n", "n+k", "k"], e: "Symétrie des combinaisons." },
      {
        q: "Tirages simultanés de 3 cartes parmi 32 : combien ?",
        a: "C(32,3) = 4960",
        d: ["A(32,3) = 29760", "32^3", "3^32"],
        e: "Tirage simultané : l'ordre ne compte pas, on utilise C.",
      },
    ],
  },
  matrices: {
    1: [
      {
        q: "Dimension du produit d'une matrice 2×3 par une 3×4 ?",
        a: "2×4",
        d: ["3×3", "4×2", "impossible"],
        e: "Les colonnes de A doivent égaler les lignes de B ⇒ résultat 2×4.",
      },
      {
        q: "Déterminant de [[1,2],[3,4]] ?",
        a: "−2",
        d: ["2", "10", "−10"],
        e: "det = ad−bc = 1×4 − 2×3 = −2.",
      },
      {
        q: "La matrice identité I2 est…",
        a: "[[1,0],[0,1]]",
        d: ["[[0,1],[1,0]]", "[[1,1],[1,1]]", "[[0,0],[0,0]]"],
        e: "1 sur la diagonale, 0 ailleurs.",
      },
    ],
    2: [
      {
        q: "AB = BA en général ?",
        a: "Non, le produit n'est pas commutatif",
        d: ["Oui toujours", "Oui si carrées", "Oui si det ≠ 0"],
        e: "Le produit matriciel n'est pas commutatif en général.",
      },
      {
        q: "Inverse de [[2,0],[0,4]] ?",
        a: "[[1/2,0],[0,1/4]]",
        d: ["[[−2,0],[0,−4]]", "[[4,0],[0,2]]", "[[1/4,0],[0,1/2]]"],
        e: "L'inverse d'une matrice diagonale inverse chaque terme diagonal.",
      },
      {
        q: "det(A) = 0 signifie…",
        a: "A n'est pas inversible",
        d: ["A = 0", "A est l'identité", "A est symétrique"],
        e: "Un déterminant nul caractérise une matrice non inversible.",
      },
    ],
    3: [
      {
        q: "det(AB) = ?",
        a: "det(A)·det(B)",
        d: ["det(A)+det(B)", "det(A)/det(B)", "det(A+B)"],
        e: "Propriété multiplicative du déterminant.",
      },
      {
        q: "Pour A 2×2, det(2A) = ?",
        a: "4 det(A)",
        d: ["2 det(A)", "det(A)", "8 det(A)"],
        e: "det(kA) = kⁿ det(A) avec n = 2.",
      },
      {
        q: "Valeurs propres de [[3,0],[0,−1]] ?",
        a: "3 et −1",
        d: ["0 et 2", "−3 et 1", "3 seulement"],
        e: "Pour une matrice diagonale, les valeurs propres sont les termes diagonaux.",
      },
    ],
  },
  statistiques: {
    1: [
      { q: "Moyenne de 2, 4, 6, 8 ?", a: "5", d: ["4", "6", "20"], e: "(2+4+6+8)/4 = 5." },
      {
        q: "Médiane de 1, 3, 7, 9, 10 ?",
        a: "7",
        d: ["3", "6", "9"],
        e: "Valeur centrale de la série triée.",
      },
      {
        q: "Étendue de 4, 9, 15 ?",
        a: "11",
        d: ["15", "9", "6"],
        e: "Étendue = max − min = 15 − 4 = 11.",
      },
    ],
    2: [
      {
        q: "Variance de 2, 4, 6 (moyenne 4) ?",
        a: "8/3",
        d: ["4", "2", "16/3"],
        e: "V = ((2−4)²+(4−4)²+(6−4)²)/3 = 8/3.",
      },
      {
        q: "Si on ajoute 5 à toutes les valeurs, l'écart-type…",
        a: "ne change pas",
        d: ["augmente de 5", "est multiplié par 5", "devient nul"],
        e: "Ajouter une constante ne change pas la dispersion.",
      },
      {
        q: "Q1 est la valeur telle que…",
        a: "25 % des données lui sont inférieures",
        d: ["50 % lui sont inférieures", "25 % lui sont supérieures", "c'est la moyenne"],
        e: "Le premier quartile laisse 25 % des données en dessous.",
      },
    ],
    3: [
      {
        q: "Si on multiplie toutes les valeurs par 3, la variance est…",
        a: "multipliée par 9",
        d: ["multipliée par 3", "inchangée", "divisée par 3"],
        e: "V(ax) = a²·V(x) avec a = 3 ⇒ ×9.",
      },
      {
        q: "Loi normale : intervalle contenant ≈ 95 % des valeurs ?",
        a: "[μ−2σ ; μ+2σ]",
        d: ["[μ−σ ; μ+σ]", "[μ−3σ ; μ+3σ]", "[0 ; μ]"],
        e: "Règle empirique : environ 95 % des valeurs dans [μ−2σ ; μ+2σ].",
      },
      {
        q: "Coefficient de corrélation r = −0,98 indique…",
        a: "une forte liaison linéaire décroissante",
        d: ["aucune liaison", "une liaison croissante", "une erreur de calcul"],
        e: "r proche de −1 signale une forte corrélation linéaire négative.",
      },
    ],
  },
  trigonometrie: {
    1: [
      {
        q: "cos(0) = ?",
        a: "1",
        d: ["0", "−1", "1/2"],
        e: "Valeur usuelle du cercle trigonométrique.",
      },
      {
        q: "sin(π/2) = ?",
        a: "1",
        d: ["0", "1/2", "2^(1/2)/2"],
        e: "Valeur usuelle du cercle trigonométrique.",
      },
      {
        q: "cos^2 x + sin^2 x = ?",
        a: "1",
        d: ["0", "2", "cos(2x)"],
        e: "Identité trigonométrique fondamentale.",
      },
    ],
    2: [
      {
        q: "sin(π/6) = ?",
        a: "1/2",
        d: ["3^(1/2)/2", "2^(1/2)/2", "1"],
        e: "Valeur usuelle du cercle trigonométrique.",
      },
      {
        q: "cos(π/4) = ?",
        a: "2^(1/2)/2",
        d: ["1/2", "3^(1/2)/2", "1"],
        e: "Valeur usuelle du cercle trigonométrique.",
      },
      {
        q: "tan x = ?",
        a: "sin x / cos x",
        d: ["cos x / sin x", "sin x · cos x", "1/sin x"],
        e: "Par définition, tan x = sin x / cos x.",
      },
    ],
    3: [
      {
        q: "cos(2x) = ?",
        a: "1 − 2 sin^2 x",
        d: ["2 cos x", "1 + 2 sin^2 x", "cos^2 x + sin^2 x"],
        e: "Formule de duplication du cosinus.",
      },
      {
        q: "sin(a+b) = ?",
        a: "sin a cos b + cos a sin b",
        d: ["sin a cos b − cos a sin b", "cos a cos b + sin a sin b", "sin a + sin b"],
        e: "Formule d'addition du sinus.",
      },
      {
        q: "Solutions de cos x = 0 sur ℝ ?",
        a: "x = π/2 + kπ",
        d: ["x = kπ", "x = π/2 + 2kπ", "x = 0"],
        e: "Le cosinus s'annule en π/2 modulo π.",
      },
    ],
  },
  python: {
    1: [
      {
        q: "Que renvoie len([1, 2, 3]) ?",
        a: "3",
        d: ["2", "[1,2,3]", "erreur"],
        e: "len() compte le nombre d'éléments.",
      },
      {
        q: "Que vaut 7 // 2 en Python ?",
        a: "3",
        d: ["3.5", "1", "4"],
        e: "// est la division entière tronquée.",
      },
      {
        q: "Type de 3.0 ?",
        a: "float",
        d: ["int", "str", "bool"],
        e: "Un nombre à virgule est un float.",
      },
    ],
    2: [
      {
        q: "Que vaut [i*i for i in range(3)] ?",
        a: "[0, 1, 4]",
        d: ["[1, 4, 9]", "[0, 1, 2]", "[1, 2, 3]"],
        e: "i vaut 0,1,2 et on calcule i² pour chacun.",
      },
      {
        q: "Que vaut 7 % 3 ?",
        a: "1",
        d: ["2", "0", "2.33"],
        e: "% renvoie le reste de la division euclidienne.",
      },
      {
        q: "Combien d'itérations pour for i in range(2, 10, 3) ?",
        a: "3",
        d: ["4", "8", "2"],
        e: "i prend 2, 5, 8 → 3 itérations.",
      },
    ],
    3: [
      {
        q: "def f(n): return 1 if n<2 else n*f(n−1). f(4) = ?",
        a: "24",
        d: ["12", "4", "10"],
        e: "f(4) = 4×3×2×1 = 24 (factorielle).",
      },
      {
        q: "a = [1,2,3]; b = a; b.append(4); len(a) = ?",
        a: "4",
        d: ["3", "1", "erreur"],
        e: "b=a partage la même liste ; append modifie les deux.",
      },
      {
        q: "Complexité d'une recherche dichotomique sur n éléments ?",
        a: "O(log n)",
        d: ["O(n)", "O(n^2)", "O(1)"],
        e: "On divise l'intervalle de recherche par 2 à chaque étape.",
      },
    ],
  },
  java: {
    1: [
      {
        q: "Type entier 32 bits en Java ?",
        a: "int",
        d: ["integer", "long only", "num"],
        e: "int est le type entier standard en Java.",
      },
      {
        q: "Affichage console en Java ?",
        a: "System.out.println(...)",
        d: ["print(...)", "console.log(...)", "echo(...)"],
        e: "System.out.println affiche sur la console.",
      },
      {
        q: "Que vaut 7 / 2 avec deux int en Java ?",
        a: "3",
        d: ["3.5", "4", "erreur"],
        e: "Division entière entre deux int : le résultat est tronqué.",
      },
    ],
    2: [
      {
        q: "Taille d'un tableau tab en Java ?",
        a: "tab.length",
        d: ["tab.size()", "len(tab)", "tab.count"],
        e: "length est un attribut des tableaux Java.",
      },
      {
        q: "Comparer deux String en Java ?",
        a: "a.equals(b)",
        d: ["a == b", "a.compare(b)", "a === b"],
        e: "equals() compare le contenu, == compare les références.",
      },
      {
        q: "Mot-clé pour hériter d'une classe ?",
        a: "extends",
        d: ["implements", "inherits", "super"],
        e: "extends déclare l'héritage entre classes.",
      },
    ],
    3: [
      {
        q: "for (int i = 0; i < 5; i += 2) : nombre d'itérations ?",
        a: "3",
        d: ["2", "5", "4"],
        e: "i vaut 0, 2, 4 (3 valeurs) avant de dépasser 5.",
      },
      {
        q: "Une méthode static appartient…",
        a: "à la classe, pas à l'instance",
        d: ["à l'instance", "au package", "à l'interface"],
        e: "static rattache le membre à la classe elle-même.",
      },
      {
        q: "Que lève 5/0 avec des int ?",
        a: "ArithmeticException",
        d: ["NullPointerException", "Infinity", "0"],
        e: "La division entière par 0 lève une ArithmeticException en Java.",
      },
    ],
  },
  equations: {
    1: [
      {
        q: "Signe de x^2+1 sur ℝ ?",
        a: "toujours positif",
        d: ["toujours négatif", "dépend de x", "nul en x=0"],
        e: "x² ≥ 0 donc x²+1 ≥ 1 > 0, quel que soit x.",
      },
      {
        q: "Résoudre : x+1 = 2+x",
        a: "aucune solution",
        d: ["x=1", "x=−1", "toutes les valeurs de x"],
        e: "x s'annule des deux côtés, il reste 1=2 : c'est impossible.",
      },
      {
        q: "Résoudre : 1−2x>0",
        a: "x<1/2",
        d: ["x>1/2", "x<−1/2", "x>−1/2"],
        e: "1−2x>0 ⟺ −2x>−1 ⟺ x<1/2 (on divise par un négatif : le sens change).",
      },
    ],
    2: [
      {
        q: "Signe de −e^(3x)+2 ?",
        a: "positif si x<(1/3)ln 2",
        d: ["positif si x>(1/3)ln 2", "toujours positif", "toujours négatif"],
        e: "−e^(3x)+2>0 ⟺ e^(3x)<2 ⟺ 3x<ln 2 ⟺ x<(1/3)ln 2.",
      },
      {
        q: "Résoudre : 3x+2 = x+5",
        a: "x=3/2",
        d: ["x=3", "x=−3/2", "x=1"],
        e: "3x−x = 5−2 ⟺ 2x=3 ⟺ x=3/2.",
      },
      {
        q: "Racines de x^2−x−2 ?",
        a: "x=−1 et x=2",
        d: ["x=1 et x=−2", "x=−1 et x=−2", "x=1 et x=2"],
        e: "Δ=1+8=9>0, x=(1±3)/2, soit −1 et 2.",
      },
    ],
    3: [
      {
        q: "Résoudre A×B=0 avec A=x+3, B=x−5",
        a: "x=−3 ou x=5",
        d: ["x=−3 et x=5 en même temps", "x=3 ou x=−5", "aucune solution"],
        e: "A×B=0 ⟺ A=0 ou B=0 (règle du produit nul).",
      },
      {
        q: "N/D=0 avec N=x−2, D=x−6",
        a: "x=2 (car D(2)≠0)",
        d: ["x=2 ou x=6", "x=6", "aucune solution"],
        e: "N/D=0 ⟺ N=0 et D≠0 : x=6 est exclu car il annule le dénominateur.",
      },
      {
        q: "Pour résoudre e^x−x=0, sans forme explicite, on…",
        a: "étudie la fonction et applique le TVI",
        d: [
          "factorise directement",
          "utilise un discriminant",
          "prend le logarithme des deux côtés",
        ],
        e: "On étudie les variations de la fonction puis on applique le théorème des valeurs intermédiaires.",
      },
    ],
  },
};

export const hasExercises = (slug: string) => slug in exercises;
