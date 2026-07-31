export type QItem = { q: string; a: string; d: [string, string, string] };
export type Bank = { 1: QItem[]; 2: QItem[]; 3: QItem[] };

export const exercises: Record<string, Bank> = {
  derivees: {
    1: [
      { q: "Dérivée de f(x) = x^3 ?", a: "3x^2", d: ["x^2", "3x", "x^4/4"] },
      { q: "Dérivée de f(x) = sin x ?", a: "cos x", d: ["−cos x", "−sin x", "tan x"] },
      { q: "Dérivée de f(x) = 5x + 2 ?", a: "5", d: ["5x", "2", "7"] },
    ],
    2: [
      { q: "Dérivée de f(x) = x·e^x ?", a: "(1+x)e^x", d: ["e^x", "x e^x", "(x−1)e^x"] },
      { q: "Dérivée de f(x) = ln(x^2) ?", a: "2/x", d: ["1/x^2", "2x", "1/(2x)"] },
      { q: "Dérivée de f(x) = (2x+1)^3 ?", a: "6(2x+1)^2", d: ["3(2x+1)^2", "2(2x+1)^3", "6(2x+1)^3"] },
    ],
    3: [
      { q: "Dérivée de f(x) = x^(1/2) ?", a: "1/(2x^(1/2))", d: ["x^(−1/2)", "2x^(1/2)", "1/x^(1/2)"] },
      { q: "Dérivée de f(x) = x/(x^2+1) ?", a: "(1−x^2)/(x^2+1)^2", d: ["(x^2−1)/(x^2+1)^2", "1/(2x)", "(1+x^2)/(x^2+1)^2"] },
      { q: "Dérivée de f(x) = e^(x^2) ?", a: "2x e^(x^2)", d: ["e^(x^2)", "x^2 e^(x^2)", "2x e^x"] },
    ],
  },
  integrales: {
    1: [
      { q: "∫ x^2 dx = ?", a: "x^3/3 + C", d: ["2x + C", "x^3 + C", "x^2/2 + C"] },
      { q: "∫ cos x dx = ?", a: "sin x + C", d: ["−sin x + C", "cos x + C", "−cos x + C"] },
      { q: "∫ e^x dx = ?", a: "e^x + C", d: ["x e^x + C", "e^x/x + C", "ln x + C"] },
    ],
    2: [
      { q: "∫ de 0 à 1 de 3x^2 dx = ?", a: "1", d: ["3", "1/3", "2"] },
      { q: "∫ 1/(2x) dx = ?", a: "(1/2)ln|x| + C", d: ["ln|2x| + C", "2 ln|x| + C", "−1/(2x^2) + C"] },
      { q: "∫ x e^x dx (par parties) = ?", a: "(x−1)e^x + C", d: ["(x+1)e^x + C", "x^2 e^x/2 + C", "e^x + C"] },
    ],
    3: [
      { q: "∫ de 0 à π de sin x dx = ?", a: "2", d: ["0", "1", "π"] },
      { q: "∫ ln x dx = ?", a: "x ln x − x + C", d: ["1/x + C", "x ln x + C", "ln x/x + C"] },
      { q: "∫ x^(1/2) dx = ?", a: "(2/3)x^(3/2) + C", d: ["(3/2)x^(3/2) + C", "x^(3/2) + C", "(1/2)x^(−1/2) + C"] },
    ],
  },
  limites: {
    1: [
      { q: "lim (x→+∞) 1/x = ?", a: "0", d: ["+∞", "1", "−∞"] },
      { q: "lim (x→+∞) e^x = ?", a: "+∞", d: ["0", "1", "−∞"] },
      { q: "lim (x→0+) ln x = ?", a: "−∞", d: ["0", "+∞", "1"] },
    ],
    2: [
      { q: "lim (x→+∞) (3x^2+x)/(x^2+1) = ?", a: "3", d: ["+∞", "0", "1"] },
      { q: "lim (x→+∞) (ln x)/x = ?", a: "0", d: ["+∞", "1", "e"] },
      { q: "lim (x→0) sin x / x = ?", a: "1", d: ["0", "+∞", "sin 1"] },
    ],
    3: [
      { q: "lim (x→+∞) e^x / x^5 = ?", a: "+∞", d: ["0", "1", "5"] },
      { q: "lim (x→0) (e^x − 1)/x = ?", a: "1", d: ["0", "e", "+∞"] },
      { q: "lim (x→+∞) x^(1/x) = ?", a: "1", d: ["0", "+∞", "e"] },
    ],
  },
  suites: {
    1: [
      { q: "Suite arithmétique u0 = 2, r = 3. u4 = ?", a: "14", d: ["11", "12", "162"] },
      { q: "Suite géométrique u0 = 3, q = 2. u3 = ?", a: "24", d: ["12", "18", "48"] },
      { q: "Une suite géométrique de raison q = 1/2 converge vers ?", a: "0", d: ["1/2", "+∞", "1"] },
    ],
    2: [
      { q: "u0 = 1, r = 4 : somme u0+…+u5 = ?", a: "66", d: ["60", "76", "36"] },
      { q: "u0 = 2, q = 3 : somme u0+…+u3 = ?", a: "80", d: ["54", "78", "162"] },
      { q: "u(n+1) = u(n)+5 est une suite…", a: "arithmétique de raison 5", d: ["géométrique de raison 5", "constante", "divergente vers 0"] },
    ],
    3: [
      { q: "u(n) = (2/3)^n : limite ?", a: "0", d: ["+∞", "2/3", "1"] },
      { q: "u(n+1) = 0,5 u(n) + 3 : point fixe (limite) ?", a: "6", d: ["3", "0", "1,5"] },
      { q: "Récurrence : après l'initialisation, on prouve…", a: "l'hérédité P(n) ⇒ P(n+1)", d: ["P(n+1) ⇒ P(n)", "P(0) une 2e fois", "la limite"] },
    ],
  },
  probabilites: {
    1: [
      { q: "Dé équilibré : P(obtenir 4) = ?", a: "1/6", d: ["1/4", "1/3", "1/2"] },
      { q: "P(A) = 0,3 : P(non A) = ?", a: "0,7", d: ["0,3", "1,3", "0,5"] },
      { q: "X ~ B(10 ; 0,2) : E(X) = ?", a: "2", d: ["0,2", "10", "1,6"] },
    ],
    2: [
      { q: "A et B indépendants, P(A)=0,5, P(B)=0,4 : P(A∩B) = ?", a: "0,2", d: ["0,9", "0,1", "0,45"] },
      { q: "P(A)=0,6, P(B)=0,3, P(A∩B)=0,2 : P(A∪B) = ?", a: "0,7", d: ["0,9", "0,5", "0,8"] },
      { q: "X ~ B(10 ; 0,2) : V(X) = ?", a: "1,6", d: ["2", "0,8", "4"] },
    ],
    3: [
      { q: "X ~ B(4 ; 0,5) : P(X = 2) = ?", a: "3/8", d: ["1/4", "1/2", "1/16"] },
      { q: "P(B)=0,4 et P(A∩B)=0,1 : P_B(A) = ?", a: "0,25", d: ["0,4", "0,04", "0,1"] },
      { q: "Deux tirages avec remise, P(succès)=0,3 : P(au moins un succès) = ?", a: "0,51", d: ["0,6", "0,09", "0,49"] },
    ],
  },
  vecteurs: {
    1: [
      { q: "u(1;2) et v(3;4) : u·v = ?", a: "11", d: ["7", "10", "14"] },
      { q: "u(2;0) et v(0;5) : u et v sont…", a: "orthogonaux", d: ["colinéaires", "égaux", "opposés"] },
      { q: "Norme de u(3;4) = ?", a: "5", d: ["7", "25", "3,5"] },
    ],
    2: [
      { q: "u(2;3) et v(4;6) : ces vecteurs sont…", a: "colinéaires", d: ["orthogonaux", "de même norme", "nuls"] },
      { q: "u(1;−2;2) : ‖u‖ = ?", a: "3", d: ["5", "9", "1"] },
      { q: "u·v = 0 signifie…", a: "u ⊥ v", d: ["u ∥ v", "u = v", "u = 0"] },
    ],
    3: [
      { q: "u(1;1) et v(1;0) : cos(θ) = ?", a: "2^(1/2)/2", d: ["1/2", "0", "1"] },
      { q: "Droite d'équation 2x + 3y − 6 = 0 : vecteur normal ?", a: "(2;3)", d: ["(3;−2)", "(−6;0)", "(1;1)"] },
      { q: "u(1;2;3) et v(2;4;k) colinéaires : k = ?", a: "6", d: ["3", "5", "12"] },
    ],
  },
  complexes: {
    1: [
      { q: "|3 + 4i| = ?", a: "5", d: ["7", "25", "3"] },
      { q: "i^2 = ?", a: "−1", d: ["1", "i", "0"] },
      { q: "Conjugué de 2 − 5i ?", a: "2 + 5i", d: ["−2 + 5i", "−2 − 5i", "5 − 2i"] },
    ],
    2: [
      { q: "(1 + i)^2 = ?", a: "2i", d: ["2", "1 + i^2", "−2i"] },
      { q: "Argument de i ?", a: "π/2", d: ["0", "π", "−π/2"] },
      { q: "|z| = 2 et arg z = π : z = ?", a: "−2", d: ["2", "2i", "−2i"] },
    ],
    3: [
      { q: "e^(iπ) = ?", a: "−1", d: ["1", "i", "0"] },
      { q: "Module de (1+i)/(1−i) ?", a: "1", d: ["2", "2^(1/2)", "0"] },
      { q: "Racines de z^2 = −4 ?", a: "2i et −2i", d: ["2 et −2", "4i", "i et −i"] },
    ],
  },
  logarithme: {
    1: [
      { q: "ln(1) = ?", a: "0", d: ["1", "e", "−∞"] },
      { q: "ln(e^3) = ?", a: "3", d: ["e^3", "1/3", "ln 3"] },
      { q: "e^0 = ?", a: "1", d: ["0", "e", "+∞"] },
    ],
    2: [
      { q: "ln(a) + ln(b) = ?", a: "ln(ab)", d: ["ln(a+b)", "ln(a)·ln(b)", "ln(a/b)"] },
      { q: "e^x = 5 ⇔ x = ?", a: "ln 5", d: ["5/e", "e^5", "log 5"] },
      { q: "ln(a^4) = ?", a: "4 ln a", d: ["(ln a)^4", "ln 4 · a", "a ln 4"] },
    ],
    3: [
      { q: "Résoudre e^(2x) = 9 : x = ?", a: "ln 3", d: ["ln 9", "3", "2 ln 3"] },
      { q: "ln(x) = −1 ⇔ x = ?", a: "1/e", d: ["−e", "e", "0"] },
      { q: "ln(x^(1/2)) = ?", a: "(1/2)ln x", d: ["2 ln x", "(ln x)^(1/2)", "ln x − 2"] },
    ],
  },
  "developpements-limites": {
    1: [
      { q: "DL1 en 0 de e^x ?", a: "1 + x + o(x)", d: ["x + o(x)", "1 − x + o(x)", "1 + x^2 + o(x)"] },
      { q: "DL1 en 0 de sin x ?", a: "x + o(x)", d: ["1 + x + o(x)", "x^2 + o(x)", "1 − x + o(x)"] },
      { q: "DL2 en 0 de cos x ?", a: "1 − x^2/2 + o(x^2)", d: ["1 + x^2/2 + o(x^2)", "x − x^2 + o(x^2)", "1 − x + o(x^2)"] },
    ],
    2: [
      { q: "DL2 en 0 de ln(1+x) ?", a: "x − x^2/2 + o(x^2)", d: ["x + x^2/2 + o(x^2)", "1 + x + o(x^2)", "x − x^2 + o(x^2)"] },
      { q: "DL2 en 0 de 1/(1−x) ?", a: "1 + x + x^2 + o(x^2)", d: ["1 − x + x^2 + o(x^2)", "1 + x^2 + o(x^2)", "x + x^2 + o(x^2)"] },
      { q: "DL2 en 0 de (1+x)^(1/2) ?", a: "1 + x/2 − x^2/8 + o(x^2)", d: ["1 + x/2 + x^2/8 + o(x^2)", "1 + x − x^2 + o(x^2)", "1 + 2x + o(x^2)"] },
    ],
    3: [
      { q: "lim (x→0) (e^x − 1 − x)/x^2 (via DL) = ?", a: "1/2", d: ["1", "0", "2"] },
      { q: "DL3 en 0 de sin x ?", a: "x − x^3/6 + o(x^3)", d: ["x − x^3/3 + o(x^3)", "x + x^3/6 + o(x^3)", "x − x^2/2 + o(x^3)"] },
      { q: "lim (x→0) (ln(1+x) − x)/x^2 = ?", a: "−1/2", d: ["1/2", "0", "−1"] },
    ],
  },
  denombrement: {
    1: [
      { q: "Nombre de permutations de 4 objets ?", a: "24", d: ["4", "16", "12"] },
      { q: "C(5,2) = ?", a: "10", d: ["20", "5", "25"] },
      { q: "Nombre de mots de 3 lettres avec un alphabet de 4 lettres (répétitions permises) ?", a: "64", d: ["12", "24", "81"] },
    ],
    2: [
      { q: "Nombre d'arrangements A(5,3) ?", a: "60", d: ["10", "125", "20"] },
      { q: "C(6,3) = ?", a: "20", d: ["18", "15", "120"] },
      { q: "Nombre de parties d'un ensemble à 5 éléments ?", a: "32", d: ["25", "10", "120"] },
    ],
    3: [
      { q: "Nombre d'anagrammes du mot MAMAN ?", a: "30", d: ["120", "60", "20"] },
      { q: "C(n,k) = C(n, ?)", a: "n−k", d: ["k−n", "n+k", "k"] },
      { q: "Tirages simultanés de 3 cartes parmi 32 : combien ?", a: "C(32,3) = 4960", d: ["A(32,3) = 29760", "32^3", "3^32"] },
    ],
  },
  matrices: {
    1: [
      { q: "Dimension du produit d'une matrice 2×3 par une 3×4 ?", a: "2×4", d: ["3×3", "4×2", "impossible"] },
      { q: "Déterminant de [[1,2],[3,4]] ?", a: "−2", d: ["2", "10", "−10"] },
      { q: "La matrice identité I2 est…", a: "[[1,0],[0,1]]", d: ["[[0,1],[1,0]]", "[[1,1],[1,1]]", "[[0,0],[0,0]]"] },
    ],
    2: [
      { q: "AB = BA en général ?", a: "Non, le produit n'est pas commutatif", d: ["Oui toujours", "Oui si carrées", "Oui si det ≠ 0"] },
      { q: "Inverse de [[2,0],[0,4]] ?", a: "[[1/2,0],[0,1/4]]", d: ["[[−2,0],[0,−4]]", "[[4,0],[0,2]]", "[[1/4,0],[0,1/2]]"] },
      { q: "det(A) = 0 signifie…", a: "A n'est pas inversible", d: ["A = 0", "A est l'identité", "A est symétrique"] },
    ],
    3: [
      { q: "det(AB) = ?", a: "det(A)·det(B)", d: ["det(A)+det(B)", "det(A)/det(B)", "det(A+B)"] },
      { q: "Pour A 2×2, det(2A) = ?", a: "4 det(A)", d: ["2 det(A)", "det(A)", "8 det(A)"] },
      { q: "Valeurs propres de [[3,0],[0,−1]] ?", a: "3 et −1", d: ["0 et 2", "−3 et 1", "3 seulement"] },
    ],
  },
  statistiques: {
    1: [
      { q: "Moyenne de 2, 4, 6, 8 ?", a: "5", d: ["4", "6", "20"] },
      { q: "Médiane de 1, 3, 7, 9, 10 ?", a: "7", d: ["3", "6", "9"] },
      { q: "Étendue de 4, 9, 15 ?", a: "11", d: ["15", "9", "6"] },
    ],
    2: [
      { q: "Variance de 2, 4, 6 (moyenne 4) ?", a: "8/3", d: ["4", "2", "16/3"] },
      { q: "Si on ajoute 5 à toutes les valeurs, l'écart-type…", a: "ne change pas", d: ["augmente de 5", "est multiplié par 5", "devient nul"] },
      { q: "Q1 est la valeur telle que…", a: "25 % des données lui sont inférieures", d: ["50 % lui sont inférieures", "25 % lui sont supérieures", "c'est la moyenne"] },
    ],
    3: [
      { q: "Si on multiplie toutes les valeurs par 3, la variance est…", a: "multipliée par 9", d: ["multipliée par 3", "inchangée", "divisée par 3"] },
      { q: "Loi normale : intervalle contenant ≈ 95 % des valeurs ?", a: "[μ−2σ ; μ+2σ]", d: ["[μ−σ ; μ+σ]", "[μ−3σ ; μ+3σ]", "[0 ; μ]"] },
      { q: "Coefficient de corrélation r = −0,98 indique…", a: "une forte liaison linéaire décroissante", d: ["aucune liaison", "une liaison croissante", "une erreur de calcul"] },
    ],
  },
  trigonometrie: {
    1: [
      { q: "cos(0) = ?", a: "1", d: ["0", "−1", "1/2"] },
      { q: "sin(π/2) = ?", a: "1", d: ["0", "1/2", "2^(1/2)/2"] },
      { q: "cos^2 x + sin^2 x = ?", a: "1", d: ["0", "2", "cos(2x)"] },
    ],
    2: [
      { q: "sin(π/6) = ?", a: "1/2", d: ["3^(1/2)/2", "2^(1/2)/2", "1"] },
      { q: "cos(π/4) = ?", a: "2^(1/2)/2", d: ["1/2", "3^(1/2)/2", "1"] },
      { q: "tan x = ?", a: "sin x / cos x", d: ["cos x / sin x", "sin x · cos x", "1/sin x"] },
    ],
    3: [
      { q: "cos(2x) = ?", a: "1 − 2 sin^2 x", d: ["2 cos x", "1 + 2 sin^2 x", "cos^2 x + sin^2 x"] },
      { q: "sin(a+b) = ?", a: "sin a cos b + cos a sin b", d: ["sin a cos b − cos a sin b", "cos a cos b + sin a sin b", "sin a + sin b"] },
      { q: "Solutions de cos x = 0 sur ℝ ?", a: "x = π/2 + kπ", d: ["x = kπ", "x = π/2 + 2kπ", "x = 0"] },
    ],
  },
  python: {
    1: [
      { q: "Que renvoie len([1, 2, 3]) ?", a: "3", d: ["2", "[1,2,3]", "erreur"] },
      { q: "Que vaut 7 // 2 en Python ?", a: "3", d: ["3.5", "1", "4"] },
      { q: "Type de 3.0 ?", a: "float", d: ["int", "str", "bool"] },
    ],
    2: [
      { q: "Que vaut [i*i for i in range(3)] ?", a: "[0, 1, 4]", d: ["[1, 4, 9]", "[0, 1, 2]", "[1, 2, 3]"] },
      { q: "Que vaut 7 % 3 ?", a: "1", d: ["2", "0", "2.33"] },
      { q: "Combien d'itérations pour for i in range(2, 10, 3) ?", a: "3", d: ["4", "8", "2"] },
    ],
    3: [
      { q: "def f(n): return 1 if n<2 else n*f(n−1). f(4) = ?", a: "24", d: ["12", "4", "10"] },
      { q: "a = [1,2,3]; b = a; b.append(4); len(a) = ?", a: "4", d: ["3", "1", "erreur"] },
      { q: "Complexité d'une recherche dichotomique sur n éléments ?", a: "O(log n)", d: ["O(n)", "O(n^2)", "O(1)"] },
    ],
  },
  java: {
    1: [
      { q: "Type entier 32 bits en Java ?", a: "int", d: ["integer", "long only", "num"] },
      { q: "Affichage console en Java ?", a: "System.out.println(...)", d: ["print(...)", "console.log(...)", "echo(...)"] },
      { q: "Que vaut 7 / 2 avec deux int en Java ?", a: "3", d: ["3.5", "4", "erreur"] },
    ],
    2: [
      { q: "Taille d'un tableau tab en Java ?", a: "tab.length", d: ["tab.size()", "len(tab)", "tab.count"] },
      { q: "Comparer deux String en Java ?", a: "a.equals(b)", d: ["a == b", "a.compare(b)", "a === b"] },
      { q: "Mot-clé pour hériter d'une classe ?", a: "extends", d: ["implements", "inherits", "super"] },
    ],
    3: [
      { q: "for (int i = 0; i < 5; i += 2) : nombre d'itérations ?", a: "3", d: ["2", "5", "4"] },
      { q: "Une méthode static appartient…", a: "à la classe, pas à l'instance", d: ["à l'instance", "au package", "à l'interface"] },
      { q: "Que lève 5/0 avec des int ?", a: "ArithmeticException", d: ["NullPointerException", "Infinity", "0"] },
    ],
  },
};

export const hasExercises = (slug: string) => slug in exercises;