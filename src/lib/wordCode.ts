import { ALL_COMPETENCIES } from "@/lib/competencies";
import { BOSS_TARGET, initialPyramid, readStoredPyramid, type Pyramid } from "@/lib/pyramid";

// 256 words, one per byte value (0-255) — a friendly stand-in for hex.
// No accents, no duplicates: both matter for reliable round-tripping when
// someone re-types the phrase by hand instead of pasting a link.
export const WORDLIST: string[] = [
  "chat",
  "chien",
  "tigre",
  "lion",
  "ours",
  "loup",
  "renard",
  "lapin",
  "souris",
  "cheval",
  "vache",
  "cochon",
  "mouton",
  "chevre",
  "poule",
  "canard",
  "oie",
  "dindon",
  "aigle",
  "hibou",
  "corbeau",
  "pigeon",
  "moineau",
  "cygne",
  "pingouin",
  "dauphin",
  "baleine",
  "requin",
  "poulpe",
  "crabe",
  "homard",
  "poisson",
  "grenouille",
  "tortue",
  "lezard",
  "serpent",
  "araignee",
  "abeille",
  "papillon",
  "fourmi",
  "scarabee",
  "libellule",
  "coccinelle",
  "escargot",
  "limace",
  "ecureuil",
  "herisson",
  "castor",
  "loutre",
  "panda",
  "koala",
  "kangourou",
  "singe",
  "gorille",
  "zebre",
  "girafe",
  "elephant",
  "rhinoceros",
  "hippopotame",
  "chameau",
  "dromadaire",
  "crocodile",
  "alligator",
  "scorpion",
  "mouche",
  "moustique",
  "guepe",
  "frelon",
  "sauterelle",
  "pomme",
  "poire",
  "banane",
  "orange",
  "citron",
  "fraise",
  "cerise",
  "raisin",
  "peche",
  "abricot",
  "prune",
  "melon",
  "pasteque",
  "ananas",
  "mangue",
  "kiwi",
  "noix",
  "noisette",
  "amande",
  "cacahuete",
  "carotte",
  "patate",
  "tomate",
  "salade",
  "oignon",
  "poireau",
  "radis",
  "navet",
  "courgette",
  "poivron",
  "champignon",
  "citrouille",
  "haricot",
  "petitpois",
  "mais",
  "riz",
  "ble",
  "pain",
  "beurre",
  "fromage",
  "lait",
  "oeuf",
  "miel",
  "sucre",
  "sel",
  "poivre",
  "chocolat",
  "gateau",
  "biscuit",
  "bonbon",
  "glace",
  "crepe",
  "gaufre",
  "tarte",
  "soupe",
  "pizza",
  "pate",
  "frite",
  "sandwich",
  "yaourt",
  "robot",
  "fusee",
  "planete",
  "etoile",
  "lune",
  "soleil",
  "comete",
  "nuage",
  "orage",
  "eclair",
  "arcenciel",
  "neige",
  "pluie",
  "vent",
  "volcan",
  "montagne",
  "colline",
  "vallee",
  "riviere",
  "lac",
  "ocean",
  "plage",
  "foret",
  "jungle",
  "desert",
  "grotte",
  "ile",
  "pont",
  "tour",
  "chateau",
  "cabane",
  "phare",
  "moulin",
  "train",
  "bateau",
  "avion",
  "velo",
  "voiture",
  "camion",
  "tracteur",
  "ballon",
  "cerfvolant",
  "tambour",
  "trompette",
  "guitare",
  "piano",
  "violon",
  "flute",
  "tambourin",
  "livre",
  "crayon",
  "stylo",
  "gomme",
  "regle",
  "cahier",
  "tableau",
  "lampe",
  "montre",
  "horloge",
  "miroir",
  "cle",
  "porte",
  "fenetre",
  "chaise",
  "table",
  "lit",
  "tapis",
  "coussin",
  "rideau",
  "cube",
  "pyramide",
  "cercle",
  "carre",
  "triangle",
  "coeur",
  "losange",
  "spirale",
  "pirate",
  "dragon",
  "sorcier",
  "fantome",
  "vampire",
  "zombie",
  "fee",
  "lutin",
  "gnome",
  "troll",
  "geant",
  "nain",
  "chevalier",
  "princesse",
  "roi",
  "reine",
  "phenix",
  "griffon",
  "licorne",
  "sirene",
  "centaure",
  "minotaure",
  "sphinx",
  "hydre",
  "kraken",
  "golem",
  "cyborg",
  "alien",
  "asteroide",
  "galaxie",
  "nebuleuse",
  "meteore",
  "satellite",
  "cosmonaute",
  "telescope",
  "orbite",
  "diamant",
  "rubis",
  "emeraude",
  "saphir",
  "perle",
  "or",
  "argent",
  "bronze",
  "cuivre",
  "fer",
  "plume",
  "feuille",
  "racine",
  "branche",
];

const WORD_INDEX: Map<string, number> = new Map(WORDLIST.map((w, i) => [w, i]));

// A pyramid's whole progress state (tier/filled/complete/bossRays/bossDone)
// collapses into one of 13 values, so it fits a nibble. wrongTotal is
// deliberately not carried over — it's a nice-to-have on the device that
// earned it, not essential to transfer, and leaving it out keeps the
// phrase shorter.
export function pyramidToCode(p: Pyramid | null): number {
  if (!p) return 0;
  if (p.complete) return 6 + Math.min(BOSS_TARGET, p.bossRays);
  if (p.tier === 1) return Math.min(2, p.filled);
  if (p.tier === 2) return 3 + Math.min(1, p.filled);
  return 5;
}

export function codeToPyramid(code: number, existingWrongTotal: number): Pyramid {
  if (code >= 6) {
    const bossRays = code - 6;
    return {
      tier: 3,
      filled: 1,
      complete: true,
      bossRays,
      bossDone: bossRays >= BOSS_TARGET,
      wrongTotal: existingWrongTotal,
    };
  }
  if (code <= 2)
    return { ...initialPyramid, tier: 1, filled: code, wrongTotal: existingWrongTotal };
  if (code <= 4)
    return { ...initialPyramid, tier: 2, filled: code - 3, wrongTotal: existingWrongTotal };
  return { ...initialPyramid, tier: 3, filled: 0, wrongTotal: existingWrongTotal };
}

// One byte per two competencies (a nibble each), prefixed with a header
// byte carrying the competency count at encode time — not a real
// checksum, just enough to warn on decode if the site's competency list
// has grown/changed shape since, instead of silently misattributing
// progress to the wrong fiche. Pure (no localStorage) so it's cheap to
// round-trip in tests.
export function encodeCodes(codes: number[], competencyCount: number): string {
  const bytes: number[] = [competencyCount % 256];
  for (let i = 0; i < codes.length; i += 2) {
    const hi = codes[i] & 0x0f;
    const lo = (codes[i + 1] ?? 0) & 0x0f;
    bytes.push((hi << 4) | lo);
  }
  return bytes.map((b) => WORDLIST[b]).join("-");
}

export function decodeCodes(phrase: string): { header: number; codes: number[] } | null {
  const words = phrase
    .trim()
    .toLowerCase()
    .split(/[\s,-]+/)
    .filter(Boolean);
  if (words.length < 2) return null;

  const bytes: number[] = [];
  for (const w of words) {
    const idx = WORD_INDEX.get(w);
    if (idx === undefined) return null;
    bytes.push(idx);
  }

  const [header, ...rest] = bytes;
  const codes: number[] = [];
  for (const b of rest) {
    codes.push((b >> 4) & 0x0f);
    codes.push(b & 0x0f);
  }
  return { header, codes };
}

export function exportProgressPhrase(): string {
  const codes = ALL_COMPETENCIES.map((c) => {
    const pyramids = c.keys.map(readStoredPyramid);
    // Competencies only ever have one key in practice; average defensively.
    const avg = pyramids.reduce((sum, p) => sum + pyramidToCode(p), 0) / pyramids.length;
    return Math.round(avg);
  });
  return encodeCodes(codes, ALL_COMPETENCIES.length);
}

export type ImportResult = { applied: number; mismatch: boolean };

export function importProgressPhrase(phrase: string): ImportResult | null {
  const decoded = decodeCodes(phrase);
  if (!decoded) return null;

  const mismatch = decoded.header !== ALL_COMPETENCIES.length % 256;
  let applied = 0;
  ALL_COMPETENCIES.forEach((c, i) => {
    const code = decoded.codes[i];
    if (code === undefined) return;
    const key = c.keys[0];
    const existing = readStoredPyramid(key);
    const next = codeToPyramid(code, existing?.wrongTotal ?? 0);
    localStorage.setItem("pyramid:" + key, JSON.stringify(next));
    applied++;
  });

  return { applied, mismatch };
}
